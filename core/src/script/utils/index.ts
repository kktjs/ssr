// 根据 kkt 写法 重置 create-react-app 中的 react-script配置
import { reactScripts, webpackConfigPath } from "../../overrides/pathUtils"
import webpackNodeExternals from "webpack-node-externals"
import webpack from "webpack"
import { OptionsProps } from "../../interface"
import fs from 'fs';
import nodemonWebpackPlugin from "nodemon-webpack-plugin"
import { loaderConf, OverridesProps } from "./../../overrides"

import DevServerPlugins from "./devServer"

import {
  getWbpackBarPlugins,
  restOutPut,
  restWebpackManifestPlugin,
  clearHtmlTemp,
  restDevModuleRuleCss,
  removeSourceMapLoader
} from "../../overrides/utils"
const { choosePort } = require('react-dev-utils/WebpackDevServerUtils');
// 引入环境变量
require(`${reactScripts}/config/env`);

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || 'localhost';

const getWebpackConfig = (newConfig: webpack.Configuration, type: "server" | "client", overrides: OverridesProps, nodeExternals: boolean, split: boolean, env: "development" | "production", isWebpackDevServer: boolean) => {
  newConfig.entry = overrides[`${type}_path`]
  newConfig = getWbpackBarPlugins(newConfig, {
    name: type,
  })
  const out: webpack.Configuration["output"] = {
    filename: `${type}.js`,
    path: overrides.output_path,
  }

  if (type === "server") {
    out.library = { type: "commonjs2" }
  }

  const HOST = process.env.HOST || 'localhost'
  const PORT = process.env.PORT || 3000

  const httpPath = `http://${HOST}:${PORT}`

  newConfig = restOutPut(newConfig, out)

  if (isWebpackDevServer && env === "development") {
    newConfig.output.publicPath = `${httpPath}/`
  } else {
    newConfig.output.publicPath = `/`
  }

  let isCreateAsset = false;
  if (isWebpackDevServer && type === "client" && env === "development") {
    isCreateAsset = true
  }

  if (isWebpackDevServer && type === "server" && env === "development") {
    newConfig.plugins.push(
      new DevServerPlugins({
        filename: `${out.filename}`,
        outputPath: out.path
      }),
      new nodemonWebpackPlugin({
        script: `${out.path}/${out.filename}`,
        watch: [`${out.path}`]
      }),
    )
  }

  newConfig = restWebpackManifestPlugin(newConfig, overrides.paths, type, isCreateAsset, httpPath)

  newConfig = clearHtmlTemp(newConfig)

  newConfig.module.exprContextCritical = false;
  newConfig.plugins.push(
    new webpack.DefinePlugin({
      OUTPUT_PUBLIC_PATH: JSON.stringify(overrides.output_path),
      HOST: JSON.stringify(HOST),
      PORT: JSON.stringify(PORT),
      Dev_Server: JSON.stringify(isWebpackDevServer),
      "process.env.PORT": JSON.stringify(PORT || 3000),
      "process.env.HOST": JSON.stringify(HOST || "localhost")
    }),
  )

  if (!split) {
    newConfig.plugins.push(new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }))
  }
  if (nodeExternals) {
    newConfig.externals = [webpackNodeExternals()]
  }

  if (type === "server") {
    newConfig.optimization.minimize = false
    newConfig.optimization.minimizer = []
  }
  return newConfig
}

export default async (env: "development" | "production", options: OptionsProps, isWebpackDevServer: boolean = false) => {
  console.log(111)

  const PORT = await choosePort(HOST, DEFAULT_PORT);

  const overrides = await loaderConf()

  process.env.PORT = PORT || "3000"
  process.env.HOST = HOST || "localhost";


  const { overridesClientWebpack, overridesServerWebpack, overridesWebpack, ...rest } = overrides

  const configFactory = require(`${webpackConfigPath}`);

  let configArr: webpack.Configuration[] = []


  /**------------------------  client    ---------------------    */
  if (fs.existsSync(overrides.client_path)) {
    const configClient = configFactory(env);
    let newConfigClient = configClient
    // 控制 client 是否使用 ssr，默认情况下使用
    if (!options.original) {
      newConfigClient = getWebpackConfig(configClient, "client", overrides, options.clientNodeExternals, options.clientIsChunk, env, isWebpackDevServer)
    }
    if (isWebpackDevServer && !options.original) {
      // 去除 source-map-loader
      newConfigClient = removeSourceMapLoader(newConfigClient)
    }
    if (overridesClientWebpack) {
      newConfigClient = overridesClientWebpack(newConfigClient, env, { ...rest, env })
    }
    configArr.push(newConfigClient)
  }

  /**------------------------  server    ---------------------    */
  if (fs.existsSync(overrides.server_path)) {
    const configServer = configFactory(env);
    let newConfigServer = getWebpackConfig(configServer, "server", overrides, options.serverNodeExternals, options.serverIsChunk, env, isWebpackDevServer)
    newConfigServer.devtool = false
    newConfigServer.target = "node14"
    newConfigServer = restDevModuleRuleCss(newConfigServer)
    // 去除 source-map-loader
    newConfigServer = removeSourceMapLoader(newConfigServer)
    if (overridesServerWebpack) {
      newConfigServer = overridesServerWebpack(newConfigServer, env, { ...rest, env })
    }
    configArr.push(newConfigServer)
  }

  /**------------------------  other    ---------------------    */
  if (overridesWebpack && typeof overridesWebpack === "function") {
    configArr = overridesWebpack(configArr, env, { ...rest, env }) as webpack.Configuration[]
  }

  return {
    compiler: isWebpackDevServer ? undefined : webpack(configArr),
    config: configArr,
    overrides
  }
}