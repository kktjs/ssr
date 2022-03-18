import webpack from 'webpack';
import { WebpackConfiguration } from 'kkt';
import { WebpackManifestPlugin } from "webpack-manifest-plugin"
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import path from 'path';
import paths from "./paths"

const SimpleProgressWebpackPlugin = require('@kkt/simple-progress-webpack-plugin');

export const getWebpackRunPlugins = (plugins: WebpackConfiguration['plugins']) => {
  // 过滤 不用的插件
  let newPlugins: webpack.Configuration['plugins'] = [
    new SimpleProgressWebpackPlugin({
      format: 'compact',
      name: 'Server',
    }),
  ];

  (plugins || []).forEach((plugin) => {
    if (
      !(
        plugin &&
        plugin.constructor &&
        ['HtmlWebpackPlugin', 'SSRWebpackRunPlugin', 'WebpackManifestPlugin'].includes(
          plugin.constructor.name,
        )
      )
    ) {
      newPlugins?.push(plugin);
    }
  });
  return newPlugins;
};

// 为了 开发模式下生成 css 文件
export const getCSSPlugins = (
  plugins: WebpackConfiguration['plugins'],
  isEnvDevelopment: boolean,
  cssFilename: string = 'server',
) => {
  if (isEnvDevelopment) {
    // 为了让开发模式下生成 css 文件
    plugins.push(
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: `${cssFilename}.css`,
      }),
    );
  }
  return plugins;
};

// 去除 html temp 模板插件
export const getRemoveHtmlTemp = (plugins: WebpackConfiguration['plugins']) => {
  // 开发模式 如果去除 会造成 页面没内容
  if (process.env.NODE_ENV === "development") {
    return plugins
  }
  let newPlugins: webpack.Configuration['plugins'] = [];
  (plugins || []).forEach((plugin) => {
    if (
      !(
        plugin &&
        plugin.constructor &&
        ['HtmlWebpackPlugin', "InlineChunkHtmlPlugin", "InterpolateHtmlPlugin"].includes(
          plugin.constructor.name,
        )
      )
    ) {
      newPlugins?.push(plugin);
    }
  });
  return newPlugins;
}


// 重新 设置 asset-manifest.json 内容，适配老版的服务渲染问题 
export const restWebpackManifestPlugin = (conf: WebpackConfiguration) => {
  conf.plugins.push(new WebpackManifestPlugin({
    fileName: 'asset-manifest.json',
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
      const client: Record<string, string> = { css: null, js: null }
      const entrypointFiles = entrypoints.main.filter(
        fileName => !fileName.endsWith('.map')
      );
      entrypointFiles.forEach((filename) => {
        const extname = path.extname(filename).replace(".", "") as "css" | "js";	 //获取文件的后缀名
        client[extname] = filename
      })
      return {
        ...routhPaths,
        files: manifestFiles,
        entrypoints: entrypointFiles,
        client,
      };
    },
  }))
  return conf
}

