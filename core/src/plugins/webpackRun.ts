process.env.GENERATE_SOURCEMAP = 'false';
process.env.FAST_REFRESH = 'false';
// 直接做一个 webpack run ， 占时可以打包代码了，自己做一个代码打包后提示就哦了
import webpack from 'webpack';
import path from 'path';
import nodeExternals from 'webpack-node-externals';
import clearConsole from 'react-dev-utils/clearConsole';

import { getModuleCSSRules } from "./utils/module"
import { getWebpackRunPlugins, getCSSPlugins } from "./utils/plugins"

const today = () => new Date().toISOString().split('.')[0].replace('T', ' ');

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
      const isEnvDevelopment = NODE_ENV === "development"
      const output = {
        path: path.resolve(process.cwd(), './dist'),
        filename: 'server.js',
        libraryTarget: 'commonjs2',
        library: {
          type: 'commonjs2',
        },
        ...(this.options.output || {}),
      };

      const fileName = path.basename(output.filename as string).replace(/.(js|jsx?|cjs|mjs|tsx?)$/, '');

      // 起一个服务, 处理 server 服务文件
      const childCompiler = webpack({
        mode: NODE_ENV,
        target: 'node',
        devtool: false,
        bail: NODE_ENV === 'production',
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
          rules: getModuleCSSRules(compilation.options.module.rules, isEnvDevelopment),
        },
        // 从父级继承 需要做处理
        optimization: {},
        resolve: {
          modules: ['node_modules'],
          ...compilation.options.resolve,
          alias: {
            ...compilation.options.resolve.alias,
            ...(this.options.resolve?.alias || {}),
          },
          // 这个造成的 打包后运行报错
          byDependency: {},
          // plugins: []
        },
        // 继承父级的 plugins 进行处理，过滤不用的 plugins
        plugins: getCSSPlugins(getWebpackRunPlugins(compilation.options.plugins), isEnvDevelopment, fileName),
        // Turn off performance processing because we utilize
        // our own hints via the FileSizeReporter
        performance: false,
      });

      if (isEnvDevelopment) {
        childCompiler.watch({ ...compilation.options.watchOptions }, (err, stats) => {
          if (err) {
            console.log('❌ WEBPACK-SSR:\x1b[31;1mERR\x1b[0m:', err);
            return;
          }
          if (stats.hasErrors()) {
            clearConsole();
            console.log(`❌ WEBPACK-SSR:\x1b[31;1mERR\x1b[0m: \x1b[35;1m${today()}\x1b[0m\n`, stats.toString());
            return;
          }
          clearConsole();
          console.log(`🚀 started! \x1b[35;1m${today()}\x1b[0m`);
          if (err) {
            return;
          }
        });
      }

      // 把文件提交到父级 生产下对文件进行提交到父级，不提交也可以 自己写 log 提示
      childCompiler.hooks.thisCompilation.tap('SSRWebpackRunPlugin', (childCompilation) => {
        childCompilation.hooks.processAssets.tap('SSRWebpackRunPlugin', (compilationAssets) => {
          if (!isEnvDevelopment) {
            Object.entries(compilationAssets || {}).forEach(([name, so]) => {
              compilation.emitAsset(name, so);
            });
          }
        });
      });

      compilation.hooks.processAssets.tapAsync({
        name: "SSRWebpackRunPlugin",
      }, (_assets, callback) => {
        if (!isEnvDevelopment) {
          childCompiler.run((error) => {
            if (error) {
              callback(error);
              return;
            }
            callback(null);
          });
        }
        callback(null)
      });
    });
  }
}

export default SSRWebpackRunPlugin;
