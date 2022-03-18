// 根据 kkt 写法 重置 create-react-app 中的 react-script配置
import { reactScripts } from "../../overrides/pathUtils"
import webpackNodeExternals from "webpack-node-externals"
import webpack from "webpack"
import { OptionsProps } from "../../interface"
import fs from 'fs';
import { restDevModuleRuleCss } from "./../../overrides/utils"

import { loaderConf, OverridesProps } from "./../../overrides"

import { getWbpackBarPlugins, restOutPut, restWebpackManifestPlugin, clearHtmlTemp } from "../../overrides/utils"

// 引入环境变量
require(`${reactScripts}/config/env`);

const getWebpackConfig = (newConfig: webpack.Configuration, type: "server" | "client", overrides: OverridesProps, nodeExternals: boolean, split: boolean, env: "development" | "production") => {
  newConfig.entry = overrides[`${type}_path`]
  newConfig = getWbpackBarPlugins(newConfig, {
    name: type,
  })
  const out: webpack.Configuration["output"] = {
    filename: `${type}.js`,
    path: overrides.output_path,
  }

  if (type === "server") {
    out.library = { type: "commonjs" }
  }

  newConfig = restOutPut(newConfig, out)
  newConfig = restWebpackManifestPlugin(newConfig, overrides.paths, type)
  newConfig = clearHtmlTemp(newConfig)
  newConfig.module.exprContextCritical = false;
  newConfig.plugins.push(
    new webpack.DefinePlugin({
      OUTPUT_PUBLIC_PATH: JSON.stringify(overrides.output_path),
    }),
  )
  // if (type === "client") {
  //   "buffer": "6.0.3",
  //   "crypto": "1.0.1",
  //   "https-browserify": "1.0.0",
  //   "path-browserify": "1.0.1",
  //   "stream-http": "3.2.0",
  //   "tty-browserify": "0.0.1",
  //   "util": "0.12.4",
  //   "process": "0.11.10",
  //   "browserify-zlib": "0.2.0",
  //   "crypto-browserify": "3.12.0",
  //   "stream-browserify": "3.0.0",
  //   "os-browserify": "0.3.0",
  //   "url": "0.11.0",
  // newConfig.plugins.push(
  //   new webpack.ProvidePlugin({
  //     "process": require.resolve("process/browser"),
  //     "path": require.resolve("path-browserify"),
  //     "http": require.resolve("stream-http"),
  //     "https": require.resolve("https-browserify"),
  //     "zlib": require.resolve("browserify-zlib"),
  //     "tty": require.resolve("tty-browserify"),
  //     "util": require.resolve("util/"),
  //     "crypto": require.resolve("crypto-browserify"),
  //     "stream": require.resolve("stream-browserify"),
  //     "os": require.resolve("os-browserify/browser"),
  //     "Buffer": require.resolve("buffer"),
  //     "url": require.resolve("url/"),
  //   })
  // )
  // }

  if (!split) {
    newConfig.plugins.push(new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }))
  }
  if (nodeExternals) {
    newConfig.externals = [webpackNodeExternals()]
  }
  return newConfig
}

export default async (env: "development" | "production", options: OptionsProps) => {
  const overrides = await loaderConf()

  const { overridesClientWebpack, overridesServerWebpack, overridesWebpack, ...rest } = overrides

  const configFactory = require(`${reactScripts}/config/webpack.config`);

  let configArr: webpack.Configuration[] = []

  /**------------------------  client    ---------------------    */
  if (fs.existsSync(overrides.client_path)) {
    const configClient = configFactory(env);
    let newConfigClient = getWebpackConfig(configClient, "client", overrides, options.clientNodeExternals, options.clientIsChunk, env)
    if (overridesClientWebpack) {
      newConfigClient = overridesClientWebpack(newConfigClient, env, { ...rest, env })
    }
    configArr.push(newConfigClient)
  }

  /**------------------------  server    ---------------------    */
  if (fs.existsSync(overrides.server_path)) {
    const configServer = configFactory(env);
    let newConfigServer = getWebpackConfig(configServer, "server", overrides, options.serverNodeExternals, options.serverIsChunk, env)
    newConfigServer.devtool = false
    newConfigServer.target = "node14"
    if (env === "development") {
      newConfigServer = restDevModuleRuleCss(newConfigServer)
    }
    if (overridesServerWebpack) {
      newConfigServer = overridesServerWebpack(newConfigServer, env, { ...rest, env })
    }
    configArr.push(newConfigServer)
  }

  /**------------------------  other    ---------------------    */
  if (overridesWebpack && typeof overridesWebpack === "function") {
    configArr = overridesWebpack(configArr, env, { ...rest, env }) as webpack.Configuration[]
  }

  const compiler = webpack(configArr);
  return {
    compiler,
    config: configArr,
    overrides
  }
}