import webpack from 'webpack';
import path from 'path';
import nodeExternals from 'webpack-node-externals';
import { WebpackPluginSSRProps } from "."
import { getHttpHost } from "./utils"
import { getModuleCSSRules } from "./utils/module"

import { AddWbpackBarPlugins, restWebpackManifestPlugin, clearHtmlTemp, removeSourceMapLoader } from "./utils/plugins"
import nodemonWebpackPlugin from "nodemon-webpack-plugin"

/**
 * 从父级继承
 * module
 * plugins
 * resolve
 * output
 * 
 * **/


export interface GetCreateChildCompilerReturn {
  childCompiler: webpack.Compiler,
  fileName: string,
  isEnvDevelopment: boolean,
  output: webpack.Configuration["output"]
}

const getCreateChildCompiler = (compilation: webpack.Compilation, options: WebpackPluginSSRProps, parentCompiler: webpack.Compiler): GetCreateChildCompilerReturn => {
  const { overridesWebpack, ...rest } = options

  const paths = require("react-scripts/config/paths")

  const NODE_ENV = process.env.NODE_ENV as webpack.Configuration['mode'];
  const isEnvDevelopment = NODE_ENV === 'development';

  const output: webpack.Configuration["output"] = {
    path: compilation.options.output.path,
    filename: 'server.js',
    libraryTarget: 'commonjs2',
    library: {
      type: 'commonjs2',
    },
    ...(options.output || {}),
  };

  const httpPath = getHttpHost()

  /** start 命令时候 配置前缀 为 devServer 端口  */
  if (process.env.NODE_ENV === "development") {
    output.publicPath = `${httpPath}/`
  } else {
    output.publicPath = `/`
  }

  const fileName = path.basename(output.filename as string).replace(/.(js|jsx?|cjs|mjs|tsx?)$/, '');

  let config: webpack.Configuration = {
    mode: NODE_ENV,
    target: 'node14',
    devtool: false,
    entry: path.resolve(process.cwd(), './src/server.js'),
    externals: [nodeExternals()],
    // 从父级继承 需要做处理
    optimization: {},
    ...rest,
    output,
    context: process.cwd(),
    module: {
      strictExportPresence: true,
      rules: getModuleCSSRules(compilation.options.module.rules, false),
    },
    resolve: {
      ...compilation.options.resolve,
      alias: {
        ...compilation.options.resolve.alias,
        ...(options.resolve?.alias || {}),
      },
      // 这个造成的 打包后运行报错
      byDependency: {},
    },
    plugins: compilation.options.plugins.filter((plugin) => !(plugin && plugin.constructor.name === "WebpackPluginSSR")),
  }
  config = removeSourceMapLoader(config)
  config = clearHtmlTemp(config)
  config = AddWbpackBarPlugins(config, { name: "server" })
  config = restWebpackManifestPlugin(config, paths, "server", isEnvDevelopment, httpPath)

  if (overridesWebpack) {
    config = overridesWebpack(config)
  }

  const HOST = process.env.HOST || 'localhost'
  const PORT = process.env.PORT || 3000

  const define = {
    /** 输出文件地址 */
    OUTPUT_PUBLIC_PATH: JSON.stringify(config.output.path),
    /** server 端获取 asset-client-mainifest.json 文件的最终输出位置  */
    KKT_PUBLIC_DIR: JSON.stringify(process.env.KKT_PUBLIC_DIR || config.output.path),
    /** 当前ip地址 **/
    HOST: JSON.stringify(HOST),
    /** 当前端口 **/
    PORT: JSON.stringify(PORT),
    /** 是否是 start 模式 **/
    /** start 模式下 文件获取地址 */
    HOSTAPI: JSON.stringify(undefined),
    "process.env.PORT": JSON.stringify(PORT),
    "process.env.HOSTAPI": JSON.stringify(process.env.HOSTAPI || undefined),
    "process.env.HOST": JSON.stringify(HOST)
  }

  if (process.env.NODE_ENV === "development") {
    // 代理 服务的 ip 地址
    define.HOSTAPI = JSON.stringify(httpPath)
    define["process.env.HOSTAPI"] = JSON.stringify(httpPath)
  }

  config.plugins.push(
    new nodemonWebpackPlugin({
      script: `${config.output.path}/${config.output.filename}`,
      watch: [`${config.output.path}`]
    }),
    new webpack.DefinePlugin(define)
  )

  // 起一个服务, 处理 server 服务文件
  const childCompiler = webpack(config);

  return {
    childCompiler,
    fileName,
    isEnvDevelopment,
    output
  }
}

export default getCreateChildCompiler