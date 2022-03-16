// 根据 kkt 写法 重置 create-react-app 中的 react-script配置
import { reactScripts } from "../../overrides/pathUtils"
import webpackNodeExternals from "webpack-node-externals"
import webpack from "webpack"

import { loaderConf, OverridesProps } from "./../../overrides"

import { getWbpackBarPlugins, restOutPut, restWebpackManifestPlugin, clearHtmlTemp } from "../../overrides/utils"
// 引入环境变量
require(`${reactScripts}/config/env`);

const getWebpackConfig = (newConfig: webpack.Configuration, type: "server" | "client", overrides: OverridesProps, nodeExternals: boolean) => {
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
  newConfig = restWebpackManifestPlugin(newConfig, type)
  newConfig = clearHtmlTemp(newConfig)
  newConfig.module.exprContextCritical = false;

  newConfig.plugins.push(new webpack.DefinePlugin({
    OUTPUT_PUBLIC_PATH: JSON.stringify(overrides.output_path),
  }))

  if (nodeExternals) {
    newConfig.externals = [webpackNodeExternals()]
  }

  return newConfig
}

export default async (env: "development" | "production", nodeExternals: {
  clientNodeExternals: boolean,
  serverNodeExternals: boolean
}) => {
  const overrides = await loaderConf()

  const { overridesClientWebpack, overridesServerWebpack, overridesWebpack } = overrides

  const configFactory = require(`${reactScripts}/config/webpack.config`);

  let configArr: webpack.Configuration[] = []

  /**------------------------  client    ---------------------    */
  const configClient = configFactory(env);
  let newConfigClient = getWebpackConfig(configClient, "client", overrides, nodeExternals.clientNodeExternals)
  if (overridesClientWebpack) {
    newConfigClient = overridesClientWebpack(newConfigClient, env)
  }
  configArr.push(newConfigClient)

  /**------------------------  server    ---------------------    */
  const configServer = configFactory(env);
  let newConfigServer = getWebpackConfig(configServer, "server", overrides, nodeExternals.serverNodeExternals)
  newConfigServer.devtool = false
  newConfigServer.target = "node"
  if (overridesServerWebpack) {
    newConfigServer = overridesServerWebpack(newConfigServer, env)
  }
  configArr.push(newConfigServer)

  /**------------------------  other    ---------------------    */
  if (overridesWebpack && typeof overridesWebpack === "function") {
    configArr = overridesWebpack(configArr, env) as webpack.Configuration[]
  }
  const compiler = webpack(configArr);
  return {
    compiler,
    config: configArr,
    overrides
  }
}