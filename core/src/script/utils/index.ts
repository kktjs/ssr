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


export type GetWebpackConfig = (
  newConfig: webpack.Configuration,
  type: "server" | "client",
  overrides: OverridesProps,
  nodeExternals: boolean,
  split: boolean,
  env: "development" | "production",
  isWebpackDevServer: boolean,
  options: OptionsProps
) => webpack.Configuration


const getWebpackConfig: GetWebpackConfig = (newConfig, type, overrides, nodeExternals, split, env, isWebpackDevServer, options) => {
  /** 入口 */
  newConfig.entry = overrides[`${type}_path`]
  /** 加载 进度条 plugin */
  newConfig = getWbpackBarPlugins(newConfig, {
    name: type,
  })
  /** 输出配置 */
  const out: webpack.Configuration["output"] = {
    filename: `${type}.js`,
    path: overrides.output_path,
  }
  if (type === "server") {
    /** 输出 类型 */
    out.library = { type: "commonjs2" }
  }

  const HOST = process.env.HOST || 'localhost'
  const PORT = process.env.PORT || 3000

  const httpPath = `http://${HOST}:${PORT}`

  /** start 命令时候 配置前缀 为 devServer 端口  */
  if (isWebpackDevServer && env === "development") {
    out.publicPath = `${httpPath}/`
  } else {
    out.publicPath = `/`
  }

  /** 重置 输入配置 */
  newConfig = restOutPut(newConfig, out)

  let isCreateAsset = false;
  if (isWebpackDevServer && type === "client" && env === "development") {
    isCreateAsset = true
  }
  /** start 命令下  生成 server.js文件和 自动启动 server.js 服务  */
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
  /**  重置 asset-manifest.json 文件内容 */
  newConfig = restWebpackManifestPlugin(newConfig, overrides.paths, type, isCreateAsset, httpPath)
  /** 清除 html 模板方面的 plugin  **/
  newConfig = clearHtmlTemp(newConfig)

  newConfig.module.exprContextCritical = false;

  const define = {
    OUTPUT_PUBLIC_PATH: JSON.stringify(overrides.output_path),
    KKT_PUBLIC_DIR: JSON.stringify(process.env.KKT_PUBLIC_DIR || overrides.output_path),
    HOST: JSON.stringify(HOST),
    PORT: JSON.stringify(PORT),
    Dev_Server: JSON.stringify(isWebpackDevServer),
    HOSTAPI: JSON.stringify(undefined),
    "process.env.PORT": JSON.stringify(PORT),
    "process.env.HOSTAPI": JSON.stringify(undefined),
    "process.env.HOST": JSON.stringify(HOST)
  }

  if (isWebpackDevServer) {
    // 代理 服务的 ip 地址
    define.HOSTAPI = JSON.stringify(`http://${HOST}:${PORT}`)
    define["process.env.HOSTAPI"] = JSON.stringify(`http://${HOST}:${PORT}`)
  }

  newConfig.plugins.push(
    new webpack.DefinePlugin(define),
  )

  if (!split) {
    // 代码是否进行分割
    newConfig.plugins.push(new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }))
  }

  if (nodeExternals) {
    /** 
     * https://www.npmjs.com/package/webpack-node-externals
     * 这个库扫描node_modules文件夹中的所有 node_modules 名称，并构建一个外部函数，告诉 Webpack 不要捆绑这些模块或它们的任何子模块 
     * */
    newConfig.externals = [webpackNodeExternals()]
  }

  if (options.miniServer && type === "server") {
    /** server 端 去除代码压缩 */
    newConfig.optimization.minimize = false
    newConfig.optimization.minimizer = []
  }

  if (options.miniClient && type === "client") {
    /** client 端 去除代码压缩 */
    newConfig.optimization.minimize = false
    newConfig.optimization.minimizer = []
  }

  return newConfig
}

export default async (env: "development" | "production", options: OptionsProps, isWebpackDevServer: boolean = false) => {
  /**  端口处理 */
  const PORT = await choosePort(HOST, DEFAULT_PORT);
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