import { WebpackConfiguration } from 'kkt';
import { WebpackManifestPlugin } from "webpack-manifest-plugin"
import WebpackBar from 'webpackbar';
import path from 'path';
import FS from 'fs-extra';
import { getHttpHost } from "."

/** 加 进度条，  */
export const AddWbpackBarPlugins = (conf: WebpackConfiguration, opt: WebpackBar["options"]): WebpackConfiguration => {
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

export const createNewWebpackManifestPlugin = (
  paths: Record<string, string>,
  type: string,
  isCreateAsset: boolean = false,
  httpPath: string = getHttpHost()) => {
  return new WebpackManifestPlugin({
    fileName: type ? `asset-${type}-manifest.json` : 'asset-manifest.json',
    publicPath: paths.publicUrlOrPath,
    generate: (seed, files, entrypoints) => {
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
        if (!file.name.endsWith('.map')) {
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
        fileName => !fileName.endsWith('.map')
      ).map((fileName) => getPahts(fileName));

      entrypointFiles.forEach((filename) => {
        const extname = path.extname(filename).replace(".", "") as "css" | "js";	 //获取文件的后缀名
        clientOrServer[extname] = getPahts(filename)
      })
      const result = {
        ...routhPaths,
        files: manifestFiles,
        entrypoints: entrypointFiles,
        [type]: clientOrServer,
      }
      if (isCreateAsset) {
        if (!FS.existsSync(paths.appBuild)) {
          FS.ensureDirSync(paths.appBuild)
        }
        FS.writeFileSync(`${paths.appBuild}/asset-${type}-manifest.json`, JSON.stringify(result, null, 2), { flag: "w+", encoding: "utf-8" })
      }
      return {
        ...result,
      };
    },
  })
}


/** 重置 WebpackManifestPlugin 输出名称 */
export const restWebpackManifestPlugin = (
  conf: WebpackConfiguration,
  paths: Record<string, string>, type?: string,
  isCreateAsset: boolean = false,
  httpPath: string = ""
): WebpackConfiguration => {
  const plugins = []
    .concat(conf.plugins)
    .filter(
      plugin => plugin && plugin.constructor.name !== 'WebpackManifestPlugin'
    )
    .concat([createNewWebpackManifestPlugin(
      paths,
      type,
      isCreateAsset,
      httpPath
    )]);
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


// loader source-map-loader
export const removeSourceMapLoader = (conf: WebpackConfiguration): WebpackConfiguration => {
  return {
    ...conf,
    module: {
      ...conf.module,
      rules: conf.module.rules.filter((rule) => !(rule !== "..." && /source-map-loader/.test(rule.loader) && /\.(js|mjs|jsx|ts|tsx|css)$/.toString() === rule.test.toString()))
    }
  }
}
