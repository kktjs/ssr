//  重置 create-react-app 中的 react-script配置
import webpackNodeExternals from "webpack-node-externals"
import webpack from "webpack"
import { OptionsProps, OverridesProps } from "../interface"
import CreateTemporaryAsset from "./plugins/CreateTemporaryAsset"
import { restOutPut } from "./output"
import { getWbpackBarPlugins, restWebpackManifestPlugin, clearHtmlTemp, addServerPlugins, AddDefinePlugin } from "./plugins"

export type ProcessingConfigProps = (
  newConfig: webpack.Configuration,
  type: "server" | "client",
  overrides: OverridesProps,
  nodeExternals: boolean,
  split: boolean,
  options: OptionsProps
) => webpack.Configuration


const processingConfig: ProcessingConfigProps = (newConfig, type, overrides, nodeExternals, split, options) => {
  const isDev = process.env.NODE_ENV === "development"
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
  if (isDev) {
    out.publicPath = `${httpPath}/`
  } else {
    out.publicPath = `/`
  }

  /** 重置 输入配置 */
  newConfig = restOutPut(newConfig, out)

  /** start 命令下 生成 client 端 asset 文件 **/
  let isCreateAsset = false;

  if (type === "client" && isDev) {
    isCreateAsset = true
  }
  /** start 命令下  生成 server.js文件和 自动启动 server.js 服务  */
  if (type === "server" && isDev) {
    newConfig = addServerPlugins(newConfig, out)
  }
  /**  重置 asset-manifest.json 文件内容 */
  newConfig = restWebpackManifestPlugin(newConfig, overrides.paths, type, isCreateAsset, httpPath)
  /** 清除 html 模板方面的 plugin  **/
  newConfig = clearHtmlTemp(newConfig)

  newConfig.module.exprContextCritical = false;
  // 添加 define plugin
  newConfig = AddDefinePlugin(newConfig, overrides, isDev)

  newConfig.plugins.push(
    new CreateTemporaryAsset(`${overrides.output_path}/asset-${type}-manifest.json`)
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

  if (!options.miniServer && type === "server") {
    /** server 端 去除代码压缩 */
    newConfig.optimization.minimize = false
    newConfig.optimization.minimizer = []
  }

  if (!options.miniClient && type === "client") {
    /** client 端 去除代码压缩 */
    newConfig.optimization.minimize = false
    newConfig.optimization.minimizer = []
  }

  return newConfig
}

export default processingConfig