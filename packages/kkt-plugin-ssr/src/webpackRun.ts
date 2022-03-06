process.env.GENERATE_SOURCEMAP = 'false';
process.env.FAST_REFRESH = 'false';
// 直接做一个 webpack run ， 占时可以打包代码了，自己做一个代码打包后提示就哦了
import webpack from 'webpack';
import path from 'path';
import nodeExternals from 'webpack-node-externals';
import webapckMerge from 'webpack-merge';
import { getPlugins } from './utils';
class SSRWebpackRunPlugin {
  options: webpack.Configuration = {};

  constructor(options: webpack.Configuration) {
    if (options) {
      this.options = webapckMerge(this.options, options);
    }
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.thisCompilation.tap('SSRWebpackRunPlugin', (compilation) => {
      const NODE_ENV = process.env.NODE_ENV as webpack.Configuration['mode'];
      const childCompiler = webpack({
        mode: 'production',
        target: 'node',
        devtool: false,
        entry: path.resolve(process.cwd(), './src/server.js'),
        output: {
          path: path.resolve(process.cwd(), './build'),
          filename: 'server.js',
          libraryTarget: 'commonjs2',
          library: {
            type: 'commonjs2',
          },
        },
        context: process.cwd(),
        externals: [nodeExternals()],
        module: {
          strictExportPresence: true,
          rules: compilation.options.module.rules,
        },
        optimization: {},
        // resolve 不能走父级的 有问题
        // resolve: compilation.options.resolve,
        // resolveLoader: compilation.options.resolve,
        plugins: getPlugins(compilation.options.plugins),
      });

      // childCompiler.hooks.thisCompilation.tap("SSRWebpackRunPlugin", (childCompilation) => {
      //   childCompilation.hooks.processAssets.tap("SSRWebpackRunPlugin", (compilationAssets) => {
      //     Object.entries(compilationAssets || {}).forEach(([name, so]) => {
      //       // 直接输出的文件是正常的
      //       childCompiler.outputFileSystem.writeFile(name, so.buffer(), (err) => {
      //         if (err) console.log(err);
      //       })
      //       // compilation.emitAsset(name, so)
      //     })
      //   })
      // })

      compilation.hooks.processAssets.tapAsync('SSRWebpackRunPlugin', (_assets, callback) => {
        childCompiler.run((error) => {
          if (error) {
            callback(error);
            return;
          }
          callback(null);
        });
      });
    });
  }
}

export default SSRWebpackRunPlugin;
