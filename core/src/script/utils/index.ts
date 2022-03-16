// 根据 kkt 写法 重置 create-react-app 中的 react-script配置
import { reactScripts } from "../../overrides/pathUtils"
import webpack from "webpack"
import { getWbpackBarPlugins, restOutPut, restWebpackManifestPlugin, clearHtmlTemp } from "../../overrides/utils"
import overrides from "../../overrides"
require(`${reactScripts}/config/env`);
require("./../../overrides/env")

const getWebpackConfig = (newConfig: webpack.Configuration, type: "server" | "client") => {
  newConfig.entry = overrides[`${type}_path`]
  newConfig = getWbpackBarPlugins(newConfig, {
    name: type,
    ...(type === "server" && {
      type: "commonjs"
    } || {})
  })
  newConfig = restOutPut(newConfig, { filename: `${type}.js`, path: overrides.output_path, })
  newConfig = restWebpackManifestPlugin(newConfig, type)
  newConfig = clearHtmlTemp(newConfig)
  newConfig.module.exprContextCritical = false;

  newConfig.plugins.push(new webpack.DefinePlugin({
    OUTPUT_PUBLIC_PATH: JSON.stringify(overrides.output_path),
  }))
  return newConfig
}

export default (env: "development" | "production") => {

  const { overridesClientWebpack, overridesServerWebpack, overridesWebpack } = overrides

  const configFactory = require(`${reactScripts}/config/webpack.config`);

  let configArr: webpack.Configuration[] = []

  /**------------------------  client    ---------------------    */
  const configClient = configFactory(env);
  let newConfigClient = getWebpackConfig(configClient, "client")
  if (overridesClientWebpack) {
    newConfigClient = overridesClientWebpack(newConfigClient, env)
  }
  configArr.push(newConfigClient)

  /**------------------------  server    ---------------------    */
  const configServer = configFactory(env);
  let newConfigServer = getWebpackConfig(configServer, "server")
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
    config: configArr
  }
}