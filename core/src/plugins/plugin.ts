process.env.GENERATE_SOURCEMAP = "false"
process.env.FAST_REFRESH = 'false';
import webpack from 'webpack';
import path from 'path';
import nodeExternals from 'webpack-node-externals';
import { getModuleRules, getPlugins } from "./utils"

export interface SSRWebpackPluginProps {
  output?: webpack.WebpackOptionsNormalized["output"],
  entry?: string;
  externals?: webpack.WebpackOptionsNormalized["externals"]
  target?: string;
}

class SSRWebpackPlugin {
  options: SSRWebpackPluginProps = {
    "entry": path.join(process.cwd(), "src/serverIndex"),
    "target": "node",
    "output": {
      // @ts-ignore
      libraryTarget: "commonjs",
      enabledChunkLoadingTypes: ['require'],
      enabledLibraryTypes: ['commonjs2'],
      enabledWasmLoadingTypes: ['async-node'],
      globalObject: 'global',
      workerChunkLoading: 'require',
      workerWasmLoading: 'async-node',
      "path": path.join(process.cwd(), 'build'),
      "filename": 'server.js',
      "library": {
        "type": "commonjs2",
      },
    },
  }

  constructor(options: SSRWebpackPluginProps) {
    if (options) {
      this.options = {
        ...this.options,
        ...options,
        output: {
          ...this.options.output,
          ...(options.output || {})
        }
      }
    }
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.thisCompilation.tap('SSRWebpackPlugin', (compilation) => {
      const output = this.options.output
      const childCompiler = compilation.createChildCompiler('SSRWebpackPlugins', output);

      childCompiler.options.target = this.options.target
      childCompiler.options.devtool = false
      childCompiler.options.externalsPresets.node = true
      childCompiler.options.externalsPresets.web = false
      childCompiler.options.externalsType = "commonjs"
      childCompiler.options.loader.target = "node"

      // // module 中 处理 css 打包问题
      childCompiler.options.module = {
        ...compilation.options.module,
        rules: getModuleRules(compilation.options.module.rules)
      }
      // 去除部分没用的 plugin
      childCompiler.options.plugins = getPlugins(compilation.options.plugins)
      // 设置代码拆分最大值
      new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }).apply(childCompiler);
      // fs path ... 处理
      new webpack.node.NodeTargetPlugin().apply(childCompiler);

      // 外部，去除不需要 打包到 bundle 中的 
      let externals = [nodeExternals()]
      if (this.options.externals) {
        if (Array.isArray(this.options.externals)) {
          externals = externals.concat(this.options.externals)
        } else {
          externals = externals.concat([this.options.externals])
        }
      }
      new webpack.ExternalsPlugin("node", externals).apply(childCompiler)

      // 添加入口文件
      const entry = this.options.entry as string
      new webpack.EntryPlugin(compilation.compiler.context, entry).apply(childCompiler);

      compilation.hooks.processAssets.tapAsync("SSRWebpackPlugin",
        (_assets, callback) => {
          childCompiler.runAsChild((error, _entries, childCompilation) => {
            if (error) {
              callback(error);
              return;
            }
            callback(null);
          });
        }
      );
    });
  }
}


export default SSRWebpackPlugin