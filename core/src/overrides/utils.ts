import WebpackBar from 'webpackbar';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import { WebpackConfiguration } from 'kkt';
import path from "path"
import { Paths } from "./pathUtils"

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

/** 重置 WebpackManifestPlugin 输出名称 */
export const restWebpackManifestPlugin = (conf: WebpackConfiguration, paths: Partial<Paths>, type?: string): WebpackConfiguration => {
  const plugins = []
    .concat(conf.plugins)
    .filter(
      plugin => plugin && plugin.constructor.name !== 'WebpackManifestPlugin'
    )
    .concat([
      new WebpackManifestPlugin({
        fileName: type ? `asset-${type}-manifest.json` : 'asset-manifest.json',
        publicPath: paths.publicUrlOrPath,
        generate: (seed, files, entrypoints) => {
          const routhPaths: Record<string, { css?: string, js?: string }> = {}
          const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path;
            if (!file.name.endsWith('.map')) {
              const routePath = `${file.name}`.replace(/.(css|js)$/, "")
              if (!routhPaths[routePath]) {
                routhPaths[routePath] = {}
              }
              const extname = path.extname(file.name).replace(".", "") as "css" | "js";	 //获取文件的后缀名
              routhPaths[routePath][extname] = file.path;
            }
            return manifest;
          }, seed);

          const clientOrServer: Record<string, string> = { css: null, js: null }
          const entrypointFiles = entrypoints.main.filter(
            fileName => !fileName.endsWith('.map')
          );

          entrypointFiles.forEach((filename) => {
            const extname = path.extname(filename).replace(".", "") as "css" | "js";	 //获取文件的后缀名
            clientOrServer[extname] = filename
          })

          return {
            ...routhPaths,
            files: manifestFiles,
            entrypoints: entrypointFiles,
            [type]: clientOrServer,
          };
        },
      }),
    ]);
  return { ...conf, plugins };
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
/** 输出配置 */
export const restOutPut = (conf: WebpackConfiguration, options: WebpackConfiguration['output']): WebpackConfiguration => {
  return {
    ...conf,
    output: {
      ...conf.output,
      ...options,
    },
  };
};
