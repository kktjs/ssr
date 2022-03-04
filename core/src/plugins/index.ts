process.env.GENERATE_SOURCEMAP = "false"
process.env.FAST_REFRESH = 'false';
import webpack from 'webpack';
import path from 'path';
import nodeExternals from 'webpack-node-externals';
import { getModuleRules, getPlugins } from "./utils"
export { default as SSRWebpackRunPlugin } from "./webpackRun"

export interface SSRWebpackPluginProps {
  output?: webpack.WebpackOptionsNormalized["output"],
  entry?: string;
  externals?: webpack.WebpackOptionsNormalized["externals"]
  target?: string;
}

export class SSRWebpackPlugin {
  options: SSRWebpackPluginProps = {
    "entry": path.join(process.cwd(), "src/serverIndex"),
    "target": "node",
    "output": {
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
      const childCompiler = compilation.createChildCompiler('SSRWebpackPlugins', output, []);
      childCompiler.options.target = this.options.target
      childCompiler.options.devtool = false

      // module 中 处理 css 打包问题
      childCompiler.options.module = {
        ...compilation.options.module,
        rules: getModuleRules(compilation.options.module.rules)
      }
      // 去除部分没用的 plugin
      childCompiler.options.plugins = getPlugins(compilation.options.plugins)
      // 设置代码拆分最大值
      new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }).apply(childCompiler);
      // 添加入口文件
      const entry = this.options.entry as string
      new webpack.EntryPlugin(compilation.compiler.context, entry).apply(childCompiler);

      // fs path ... 处理
      new webpack.node.NodeTargetPlugin().apply(childCompiler);

      // 外部，去除不需要 打包到 bundle 中的 
      let externals = [nodeExternals({
        allowlist: [
          /\.(eot|woff|woff2|ttf|otf)$/,
          /\.(svg|png|jpg|jpeg|gif|ico)$/,
          /\.(mp4|mp3|ogg|swf|webp)$/,
          /\.(css|scss|sass|sss|less)$/
        ]
      })]
      if (this.options.externals) {
        if (Array.isArray(this.options.externals)) {
          externals = externals.concat(this.options.externals)
        } else {
          externals = externals.concat([this.options.externals])
        }
      }
      new webpack.ExternalsPlugin(undefined, externals).apply(childCompiler)

      // 运行子程序
      childCompiler.runAsChild((err) => {
        if (err) {
          console.log(err);
          process.exit(1)
        }
      });
    });
  }
}


