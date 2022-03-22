import WebpackBar from 'webpackbar';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import { WebpackConfiguration } from 'kkt';
import path from "path"
import { Paths } from "./pathUtils"
import webpack from "webpack"
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import FS from 'fs-extra';

const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const lessModuleRegex = /\.module\.less$/;
const lessRegex = /\.less$/;

const getToString = (rule: RegExp) => {
  return rule.toString();
};

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
export const restWebpackManifestPlugin = (
  conf: WebpackConfiguration,
  paths: Partial<Paths>, type?: string,
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
        generate: (seed, files, entrypoints) => {

          const getPahts = (name: string) => {
            if (!isCreateAsset || /^http/.test(name)) {
              return name
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

export const addMiniCssExtractPlugin = (conf: WebpackConfiguration): WebpackConfiguration => {
  return {
    ...conf,
    plugins: conf.plugins.concat([
      // 开发状态下没有这个 plugin 
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      })
    ]),
  }
}

// node 环境  把 css 进行处理
export const restDevModuleRuleCss = (conf: WebpackConfiguration,): WebpackConfiguration => {
  return {
    ...conf,
    plugins: conf.plugins.filter(plugin => plugin && plugin.constructor && plugin.constructor.name !== "MiniCssExtractPlugin"),
    module: {
      ...conf.module,
      rules: getModuleCSSRules(conf.module.rules,)
    },
  }
}

/**
 * 1. 去除  style-loader|mini-css-extract-plugin
 * */
export const getModuleCSSRules = (rules: (webpack.RuleSetRule | '...')[], shouldUseSourceMap: boolean = false) => {
  const newRules: any = [];

  const cssModuleOption = (mode: "icss" | "local") => ({
    importLoaders: 3,
    sourceMap: shouldUseSourceMap,
    modules: {
      mode,
      getLocalIdent: getCSSModuleLocalIdent,
      exportOnlyLocals: true
    },
  });


  rules.forEach((rule) => {
    if (typeof rule === 'string') {
      newRules.push(rule);
      return;
    }

    if (/(style-loader|mini-css-extract-plugin)/.test(rule.loader)) {

    } else if (rule && typeof rule === 'object' && rule.test && /css-loader/.test(rule.loader) && !/postcss-loader/.test(rule.loader)) {
      const isModule = [getToString(cssModuleRegex), getToString(sassModuleRegex), getToString(lessModuleRegex),].includes(rule.test.toString())
      newRules.push({
        loader: require.resolve("css-loader"),
        options: cssModuleOption(isModule ? "local" : "icss")
      })
    } else if (rule.oneOf) {
      const newOneOf = rule.oneOf.map((item) => {
        if (
          item.test &&
          [
            getToString(cssRegex),
            getToString(cssModuleRegex),
            getToString(sassRegex),
            getToString(sassModuleRegex),
            getToString(lessModuleRegex),
            getToString(lessRegex),
          ].includes(item.test.toString())
        ) {
          const isModule = [getToString(cssModuleRegex), getToString(sassModuleRegex), getToString(lessModuleRegex),].includes(item.test.toString())
          let newUse;
          if (Array.isArray(item.use)) {
            newUse = item.use.map((ite) => {
              if (typeof ite === 'string' && /(style-loader|mini-css-extract-plugin)/.test(ite)) {
                return false
              } else if (typeof ite === 'string' && /css-loader/.test(ite) && !/postcss-loader/.test(ite)) {
                return {
                  loader: require.resolve("css-loader"),
                  options: cssModuleOption(isModule ? "local" : "icss")
                }
              } else if (typeof ite === 'object' && /(style-loader|mini-css-extract-plugin)/.test(ite.loader)) {
                return false
              } else if (typeof ite === 'object' && /css-loader/.test(ite.loader) && !/postcss-loader/.test(ite.loader)) {
                return {
                  loader: require.resolve("css-loader"),
                  options: cssModuleOption(isModule ? "local" : "icss")
                }
              }
              return ite;
            }).filter(Boolean);
          }
          return {
            ...item,
            use: newUse || [],
          };
        }
        return item;
      });
      newRules.push({ ...rule, oneOf: newOneOf });
    } else {
      newRules.push(rule);
    }
  });
  return newRules;
};
