import webpack from 'webpack';
import path from 'path';
import nodeExternals from 'webpack-node-externals';
import { getModuleRules, } from './utils';
import { getWebpackRunPlugins } from "./utils/plugins"
export interface SSRWebpackPluginProps {
  output?: webpack.WebpackOptionsNormalized['output'];
  entry?: string;
  externals?: webpack.WebpackOptionsNormalized['externals'];
  target?: string;
}

class SSRWebpackPlugin {
  options: SSRWebpackPluginProps = {
    entry: path.join(process.cwd(), 'src/serverIndex'),
    target: 'node',
    output: {
      // @ts-ignore
      libraryTarget: 'commonjs',
      path: path.join(process.cwd(), 'build'),
      filename: 'server.js',
      library: {
        type: 'commonjs2',
      },
    },
  };

  constructor(options: SSRWebpackPluginProps) {
    if (options) {
      this.options = {
        ...this.options,
        ...options,
        output: {
          ...this.options.output,
          ...(options.output || {}),
        },
      };
    }
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.thisCompilation.tap('SSRWebpackPlugin', (compilation) => {
      const output = this.options.output;

      // 外部，去除不需要 打包到 bundle 中的
      let externals: any = [nodeExternals()];
      if (this.options.externals) {
        externals = this.options.externals;
      }
      // 添加入口文件
      const entry = this.options.entry as string;

      const childCompiler = compilation.createChildCompiler('SSRWebpackPlugins', output, [
        // 排除 ，使用 require 引入
        new webpack.ExternalsPlugin('node', externals),
        // fs path ... 处理
        new webpack.node.NodeTargetPlugin(),
        // 设置代码拆分最大值
        new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
        new webpack.LoaderTargetPlugin('node'),
        // 添加入口
        new webpack.EntryPlugin(compilation.compiler.context, entry),
      ]);
      // @ts-ignore
      childCompiler.options.module!.exprContextCritical = false;

      childCompiler.options.target = this.options.target;
      childCompiler.options.devtool = false;
      childCompiler.options.externalsPresets.node = true;
      childCompiler.options.externalsPresets.web = false;
      childCompiler.options.externalsType = 'commonjs';

      // // module 中 处理 css 打包问题
      childCompiler.options.module = {
        ...compilation.options.module,
        rules: getModuleRules(compilation.options.module.rules),
      };
      // 去除部分没用的 plugin
      childCompiler.options.plugins = getWebpackRunPlugins(compilation.options.plugins);
      //  optimization 代码压缩
      childCompiler.options.optimization = {
        minimize: false,
        minimizer: [],
      };

      // 把文件提交到父级
      // childCompiler.hooks.thisCompilation.tap("SSRWebpackRunPlugin", (childCompilation) => {
      //   childCompilation.hooks.processAssets.tap("SSRWebpackRunPlugin", (compilationAssets) => {
      //     Object.entries(compilationAssets || {}).forEach(([name, so]) => {
      //       // 直接输出的文件是正常的
      //       childCompiler.outputFileSystem.writeFile(name, so.buffer(), (err) => {
      //         if (err) console.log(err);
      //       })
      //       // compilation.emitAsset(name, so)
      //     })
      //     // 可以 收集文件和文件大小 进行打印提示
      //   })
      // })

      compilation.hooks.processAssets.tapAsync('SSRWebpackPlugin', (_assets, callback) => {
        childCompiler.runAsChild((error, _entries, childCompilation) => {
          // console.log(childCompilation.warnings);
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

export default SSRWebpackPlugin;
