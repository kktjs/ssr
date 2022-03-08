import { WebpackConfiguration, MiniCssExtractPlugin } from 'kkt';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
const SimpleProgressWebpackPlugin = require('@kkt/simple-progress-webpack-plugin');

export const filterPluginsServer = (
  conf: WebpackConfiguration,
  cssFilename: string,
  mini: boolean = false,
) => {
  // plugin 处理 ts ，ForkTsCheckerWebpackPlugin  MiniCssExtractPlugin
  conf.plugins = conf.plugins
    .map((plugin) => {
      if (/(MiniCssExtractPlugin)/.test(plugin.constructor.name)) {
        return new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: `${cssFilename}.css`,
        });
      }
      if (/(ForkTsCheckerWebpackPlugin|DefinePlugin|IgnorePlugin|ESLintPlugin)/.test(plugin.constructor.name)) {
        return plugin;
      }
      return null;
    })
    .filter(Boolean);
  if (!mini) {
    conf.optimization = {
      minimize: false,
      minimizer: [],
    };
  } else {
    conf.plugins.push(new CssMinimizerPlugin());
    conf.optimization!.minimizer!.push(
      new TerserPlugin({
        // cache: true,
        parallel: true,
        // sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        },
      }),
    );
    delete conf.optimization.runtimeChunk;
    delete conf.optimization.splitChunks;
  }
  conf.plugins.push(
    new SimpleProgressWebpackPlugin({
      format: 'compact',
      name: 'Server',
    }),
  );
  // 变更 module rules  中 css loader
  // 如果去除 MiniCssExtractPlugin 需要  module  rules去除对应的 loader
  return conf;
};

// 客户端 去除 html 模板
export const filterPluginsClient = (conf: WebpackConfiguration, mini: boolean = false) => {
  conf.plugins = conf.plugins
    .map((plugin) => {
      if (!/(HtmlWebpackPlugin|InlineChunkHtmlPlugin|InterpolateHtmlPlugin)/.test(plugin.constructor.name)) {
        return plugin;
      }
      return null;
    })
    .filter(Boolean);
  conf.plugins.push(
    new CssMinimizerPlugin(),
    new SimpleProgressWebpackPlugin({
      format: 'compact',
      name: 'Client',
    }),
  );
  if (!mini) {
    // 去除代码压缩的东西
    conf.optimization = {
      minimize: false,
      minimizer: [],
    };
  } else {
    conf.optimization!.minimizer!.push(
      new TerserPlugin({
        parallel: true,
        terserOptions: {},
      }),
    );
    delete conf.optimization.runtimeChunk;
    delete conf.optimization.splitChunks;
  }
  return conf;
};
