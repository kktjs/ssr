// 引入环境变量
require(`${reactScripts}/config/env`);

//  重置 create-react-app 中的 react-script配置
import { reactScripts, webpackConfigPath } from "../overrides/pathUtils"
import webpack from "webpack"
import fs from 'fs';
import { OptionsProps } from "../interface"
import { loaderConf } from "../overrides"
import { restDevModuleRuleCss, removeSourceMapLoader } from "./module"
import getWebpackConfig from "./ProcessingConfig"

const { choosePort } = require('react-dev-utils/WebpackDevServerUtils');

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || 'localhost';

export default async (env: "development" | "production", options: OptionsProps, isWebpackDevServer: boolean = false) => {

  /**  端口处理 */
  let PORT;
  if (env === "development") {
    PORT = await choosePort(HOST, DEFAULT_PORT)
  }

  /** 加载自定义配置 */
  const overrides = await loaderConf()

  process.env.PORT = PORT || "3000"
  process.env.HOST = HOST || "localhost";

  const { overridesClientWebpack, overridesServerWebpack, overridesWebpack, overridesCommonWebpack, ...rest } = overrides

  const configFactory = require(`${webpackConfigPath}`);

  let configArr: webpack.Configuration[] = []

  /**------------------------  client  配置  ---------------------    */
  if (fs.existsSync(overrides.client_path)) {
    const configClient = configFactory(env);

    let newConfigClient = configClient

    // 控制 client 是否使用 ssr，默认情况下使用
    if (!options.original) {

      newConfigClient = getWebpackConfig(configClient, "client", overrides, options.clientNodeExternals, options.clientIsChunk, env, isWebpackDevServer, options)
    }
    if (isWebpackDevServer && !options.original) {
      // 去除 source-map-loader
      newConfigClient = removeSourceMapLoader(newConfigClient)
    }
    if (overridesCommonWebpack) {
      newConfigClient = overridesCommonWebpack(newConfigClient, env, { ...rest, env })
    }
    if (overridesClientWebpack) {
      newConfigClient = overridesClientWebpack(newConfigClient, env, { ...rest, env })
    }
    configArr.push(newConfigClient)
  }

  /**------------------------  server    配置 ---------------------    */
  if (fs.existsSync(overrides.server_path)) {

    const configServer = configFactory(env);

    let newConfigServer = getWebpackConfig(configServer, "server", overrides, options.serverNodeExternals, options.serverIsChunk, env, isWebpackDevServer, options)

    newConfigServer.devtool = false
    newConfigServer.target = "node14"

    /** server 处理 css   */
    newConfigServer = restDevModuleRuleCss(newConfigServer)
    /** 去除 source-map-loader */
    newConfigServer = removeSourceMapLoader(newConfigServer)

    if (overridesCommonWebpack) {

      newConfigServer = overridesCommonWebpack(newConfigServer, env, { ...rest, env })

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

  return {
    compiler: isWebpackDevServer ? undefined : webpack(configArr),
    config: configArr,
    overrides
  }
}