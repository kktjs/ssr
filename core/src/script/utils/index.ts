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

  if (!split) {
    newConfig.plugins.push(new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }))
  }
  if (nodeExternals) {
    newConfig.externals = [webpackNodeExternals()]
  }
  newConfig = restDevModuleRuleCss(newConfig)

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