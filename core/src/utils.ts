import { WebpackConfiguration, MiniCssExtractPlugin } from 'kkt';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

export function filterPlugins(conf: WebpackConfiguration, mini: boolean = false, cssFilename?: string) {
  conf.plugins = conf.plugins
    .map(
      (item) =>
        cssFilename &&
        /(MiniCssExtractPlugin)/.test(item.constructor.name) &&
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: `${cssFilename}${mini ? '.min.css' : '.css'}`,
        }),
    )
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
  return conf;
}

/** remove @babel/runtime */
export function removeLoaders(conf: WebpackConfiguration) {
  conf.module.rules = conf.module.rules.map((rule) => {
    if (typeof rule === 'object' && rule.oneOf) {
      rule.oneOf = rule.oneOf
        .map((item) =>
          item.exclude &&
            /@babel(?:\/|\\{1,2})runtime/.toString() === item.exclude.toString() &&
            item.test.toString() === /\.(js|mjs)$/.toString()
            ? null
            : item,
        )
        .filter(Boolean);
    }
    return rule;
  });
  return conf;
}
