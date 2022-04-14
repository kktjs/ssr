import webpack from "webpack"
import DevServerPlugins from "./devServer"
import { WebpackConfiguration } from 'kkt';
import nodemonWebpackPlugin from "nodemon-webpack-plugin"
import { WebpackManifestPlugin, Manifest, } from 'webpack-manifest-plugin';
import { FileDescriptor } from 'webpack-manifest-plugin/dist/helpers';
import path from "path"
import { Paths, OverridesProps } from "./../../interface"
import FS from 'fs-extra';
import WebpackBar from 'webpackbar';

// plugin 根据 client  server
/** 加 进度条，  */
export const getWbpackBarPlugins = (conf: WebpackConfiguration, opt: WebpackBar["options"]): WebpackConfiguration => {
  const options = { ...(opt || {}) };
  if (options.name === 'server' && !options.color) {
    options.color = 'yellow';
  }
  const plugins = (conf.plugins || []).concat([new WebpackBar({ ...options })]);
  return {
    ...conf,
    plugins,
  };
};

/** 清理 html 模板 plugin */
export const clearHtmlTemp = (conf: WebpackConfiguration): WebpackConfiguration => {
  const plugins = []
    .concat(conf.plugins)
    .filter(
      plugin =>
        plugin &&
        !/(HtmlWebpackPlugin|InlineChunkHtmlPlugin|InterpolateHtmlPlugin)/.test(
          plugin.constructor.name
        )
    );
  return { ...conf, plugins };
};

export interface WebpackManifestPluginGenerateProps {
  seed: Record<any, any>,
  files: FileDescriptor[],
  entrypoints: Record<string, string[]>,
  isCreateAsset: boolean,
  httpPath: string
  paths: Partial<Paths>,
  type?: string,
}

/**   WebpackManifestPlugin 中 generate    **/
export const WebpackManifestPluginGenerate = ({ seed, files, entrypoints, isCreateAsset, httpPath, paths, type }: WebpackManifestPluginGenerateProps): Manifest => {
  const getPahts = (name: string) => {
    if (!isCreateAsset || /^http/.test(name)) {
      if (/^\//.test(name) || /^http/.test(name)) {
        return name
      }
      return "/" + name
    }
    if (/^\//.test(name)) {
      return httpPath + name
    }
    return httpPath + "/" + name
  }
  const routhPaths: Record<string, { css?: string, js?: string }> = {}
  const manifestFiles = files.reduce((manifest, file) => {
    manifest[file.name] = getPahts(file.path);
    if (!(file.name.endsWith('.map') || file.name.endsWith('.hot-update.js'))) {
      const routePath = `${file.name}`.replace(/.(css|js)$/, "")
      if (!routhPaths[routePath]) {
        routhPaths[routePath] = {}
      }
      const extname = path.extname(file.name).replace(".", "") as "css" | "js";	 //获取文件的后缀名
      routhPaths[routePath][extname] = getPahts(file.path);
    }
    return manifest;
  }, seed);

  const clientOrServer: Record<string, string> = { css: null, js: null }

  const entrypointFiles = entrypoints.main.filter(
    fileName => !(fileName.endsWith('.map') || fileName.endsWith('.hot-update.js'))
  ).map((fileName) => getPahts(fileName));
  if (type) {
    entrypointFiles.forEach((filename) => {
      const extname = path.extname(filename).replace(".", "") as "css" | "js";	 //获取文件的后缀名
      clientOrServer[extname] = getPahts(filename)
    })
  }
  const result = {
    ...routhPaths,
    files: manifestFiles,
    entrypoints: entrypointFiles,
    [type]: clientOrServer,
  }
  if (!type) {
    delete result[type]
  }
  if (isCreateAsset) {
    if (!FS.existsSync(paths.appBuild)) {
      FS.ensureDirSync(paths.appBuild)
    }
    const outPath = type ? `${paths.appBuild}/asset-${type}-manifest.json` : `${paths.appBuild}/asset-manifest.json`
    FS.writeFileSync(outPath, JSON.stringify(result, null, 2), { flag: "w+", encoding: "utf-8" })
  }
  return {
    ...result,
  };
}

/** 重置 WebpackManifestPlugin 输出名称 */
export const restWebpackManifestPlugin = (
  conf: WebpackConfiguration,
  paths: Partial<Paths>,
  type?: string,
  isCreateAsset: boolean = false,
  httpPath: string = ''
): WebpackConfiguration => {
  const plugins = []
    .concat(conf.plugins)
    .filter(
      plugin => plugin && plugin.constructor.name !== 'WebpackManifestPlugin'
    )
    .concat([
      new WebpackManifestPlugin({
        fileName: type ? `asset-${type}-manifest.json` : 'asset-manifest.json',
        publicPath: paths.publicUrlOrPath,
        generate: (seed, files, entrypoints) => WebpackManifestPluginGenerate({
          seed,
          files,
          entrypoints,
          isCreateAsset,
          httpPath,
          paths,
          type
        }),
      }),
    ]);
  return { ...conf, plugins };
};

export const addServerPlugins = (conf: WebpackConfiguration, out: webpack.Configuration["output"]) => {
  conf.plugins.push(
    /**  生成 server.js 文件  */
    new DevServerPlugins({
      filename: `${out.filename}`,
      outputPath: out.path
    }),
    /** 自动启动 server.js 文件服务 */
    new nodemonWebpackPlugin({
      script: `${out.path}/${out.filename}`,
      watch: [`${out.path}`]
    }),
  )
  return conf
}

// 添加 DefinePlugin 
export const AddDefinePlugin = (conf: WebpackConfiguration, overrides: OverridesProps, isWebpackDevServer: boolean,) => {

  const HOST = process.env.HOST || 'localhost'
  const PORT = process.env.PORT || 3000

  const define = {
    /** 输出文件地址 */
    OUTPUT_PUBLIC_PATH: JSON.stringify(overrides.output_path),
    /** server 端获取 asset-client-mainifest.json 文件的最终输出位置  */
    KKT_PUBLIC_DIR: JSON.stringify(process.env.KKT_PUBLIC_DIR || overrides.output_path),
    /** 当前ip地址 **/
    HOST: JSON.stringify(HOST),
    /** 当前端口 **/
    PORT: JSON.stringify(PORT),
    /** 是否是 start 模式 **/
    /** start 模式下 文件获取地址 */
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

  conf.plugins.push(
    new webpack.DefinePlugin(define)
  )
  return conf
}