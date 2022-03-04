process.env.GENERATE_SOURCEMAP = "false"
process.env.FAST_REFRESH = 'false';
// 直接做一个 webpack run 通过 emitAsset 提交到主程序
import webpack from 'webpack';
import path from 'path';
import nodeExternals from 'webpack-node-externals';
import webapckMerge from 'webpack-merge';
import { getModuleRules, getPlugins } from "./utils"
const SimpleProgressWebpackPlugin = require("@kkt/simple-progress-webpack-plugin");


class SSRWebpackRunPlugin {
  options: webpack.Configuration = {}

  constructor(options: webpack.Configuration) {
    if (options) {
      this.options = webapckMerge(this.options, options);
    }
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.thisCompilation.tap('SSRWebpackRunPlugin', (compilation) => {
      const NODE_ENV = process.env.NODE_ENV as webpack.Configuration['mode'];
      console.log(compilation.options)
      const childCompiler = compiler.webpack({
        mode: NODE_ENV,
        target: "node",
        devtool: false,
        entry: path.resolve(process.cwd(), "./src/server.js"),
        output: {
          path: path.resolve(process.cwd(), "./build"),
          filename: "server.js",
          libraryTarget: "commonjs2",
          library: {
            type: "commonjs2"
          },
        },
        context: process.cwd(),
        optimization: compilation.options.optimization,
        node: {
          global: true,
          __dirname: false,
          __filename: false,
        },
        externals: [nodeExternals({
          allowlist: [
            /\.(eot|woff|woff2|ttf|otf)$/,
            /\.(svg|png|jpg|jpeg|gif|ico)$/,
            /\.(mp4|mp3|ogg|swf|webp)$/,
            /\.(css|scss|sass|sss|less)$/
          ]
        })],
        ...this.options,
        module: {
          ...compilation.options.module,
          ...(this.options.module || {}),
          rules: getModuleRules(compilation.options.module.rules).concat(this.options.module?.rules || [])
        },
        resolve: {
          modules: ['node_modules'],
          extensions: ['.ts', '.tsx', '.js', "jsx", '.json'],
          ...compilation.options.resolve,
          ...(this.options.resolve || {})
        },
        plugins: getPlugins(compilation.options.plugins).concat(this.options.plugins || []).concat([new SimpleProgressWebpackPlugin({
          format: 'compact',
          name: 'Server',
        })]),
        watch: NODE_ENV === "development",
      })

      childCompiler.hooks.thisCompilation.tap("SSRWebpackRunPlugins", (childCompilation) => {
        childCompilation.hooks.processAssets.tap("SSRWebpackRunPlugins", (compilationAssets) => {
          Object.entries(compilationAssets || {}).forEach(([name, so]) => {
            compilation.emitAsset(name, so)
          })
        })
      })
      // fs path ... 处理
      new webpack.node.NodeTargetPlugin().apply(childCompiler);

      childCompiler.run((err) => {
        if (err) {
          console.log(err)
          process.exit(1)
        }
      })
    });
  }
}

export default SSRWebpackRunPlugin;
