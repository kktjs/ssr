import WebpackBar from 'webpackbar';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import { WebpackConfiguration } from 'kkt';
import path from "path"
import { Paths } from "./pathUtils"
import webpack from "webpack"
import MiniCssExtractPlugin from 'mini-css-extract-plugin';


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

// 开发模式下 把 css 进行处理
export const restDevModuleRuleCss = (conf: WebpackConfiguration,): WebpackConfiguration => {
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
    module: {
      ...conf.module,
      rules: getModuleCSSRules(conf.module.rules,)
    },
  }
}

/**
 * 1. 开发模式下，去除  style-loader  改成  MiniCssExtractPlugin.lader，让他生成 css 文件
 * */
export const getModuleCSSRules = (rules: (webpack.RuleSetRule | '...')[],) => {
  const newRules: any = [];
  rules.forEach((rule) => {
    if (typeof rule === 'string') {
      newRules.push(rule);
      return;
    }
    if (/style-loader/.test(rule.loader)) {
      newRules.push({
        loader: MiniCssExtractPlugin.loader,
      });
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
          let newUse;
          if (Array.isArray(item.use)) {
            newUse = item.use.map((ite) => {
              if (typeof ite === 'string' && /style-loader/.test(ite)) {
                return {
                  loader: MiniCssExtractPlugin.loader,
                };
              } else if (typeof ite === 'object' && /style-loader/.test(ite.loader)) {
                return {
                  loader: MiniCssExtractPlugin.loader,
                };
              }
              return ite;
            });
          }
          return {
            ...item,
            use: newUse || item.use,
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
