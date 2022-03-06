process.env.GENERATE_SOURCEMAP = 'false';
process.env.FAST_REFRESH = 'false';
// 直接做一个 webpack run ， 占时可以打包代码了，自己做一个代码打包后提示就哦了
import webpack from 'webpack';
import path from 'path';
import nodeExternals from 'webpack-node-externals';
import { getPlugins } from './utils';
class SSRWebpackRunPlugin {
  options: webpack.Configuration = {};

  constructor(options: webpack.Configuration) {
    if (options) {
      this.options = this.options;
    }
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.thisCompilation.tap('SSRWebpackRunPlugin', (compilation) => {
      const NODE_ENV = process.env.NODE_ENV as webpack.Configuration['mode'];
      const output = {
        path: path.resolve(process.cwd(), './build'),
        filename: 'server.js',
        libraryTarget: 'commonjs2',
        library: {
          type: 'commonjs2',
        },
        ...(this.options.output || {}),
      }
      // 起一个服务, 处理 server 服务文件
      const childCompiler = webpack({
        mode: NODE_ENV,
        target: 'node',
        devtool: false,
        bail: NODE_ENV === "production",
        entry: path.resolve(process.cwd(), './src/server.js'),
        externals: [nodeExternals()],
        infrastructureLogging: {
          level: 'none',
        },
        ...this.options,
        output,
        context: process.cwd(),
        module: {
          strictExportPresence: true,
          rules: compilation.options.module.rules,
        },
        // 从父级继承 需要做处理
        optimization: {},
        resolve: {
          modules: ["node_modules"],
          ...compilation.options.resolve,
          alias: {
            ...compilation.options.resolve.alias,
            ...(this.options.resolve?.alias || {}),
          },
          // 这个造成的 打包后运行报错
          byDependency: {},
        },
        // 继承父级的 plugins 进行处理，过滤不用的 plugins 
        plugins: getPlugins(compilation.options.plugins),
        watch: NODE_ENV === "development",
        // Turn off performance processing because we utilize
        // our own hints via the FileSizeReporter
        performance: false,
      });

      // 把文件提交到父级 
      childCompiler.hooks.thisCompilation.tap("SSRWebpackRunPlugin", (childCompilation) => {
        childCompilation.hooks.processAssets.tap("SSRWebpackRunPlugin", (compilationAssets) => {
          Object.entries(compilationAssets || {}).forEach(([name, so]) => {
            // // 直接输出的文件是正常的
            // childCompiler.outputFileSystem.writeFile(name, so.buffer(), (err) => {
            //   if (err) console.log(err);
            // })
            compilation.emitAsset(name, so)
          })
          // 可以 收集文件和文件大小 进行打印提示
        })
      })

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
