import webpack from 'webpack';
import path from 'path';
import nodeExternals from 'webpack-node-externals';
import webapckMerge from 'webpack-merge';

export interface SSRWebpackPluginProps {
  output?: webpack.WebpackOptionsNormalized["output"],
  entry?: string;
  externals?: webpack.WebpackOptionsNormalized["externals"]
  target?: string;
  externalsPresets?: webpack.WebpackOptionsNormalized["externalsPresets"],
  resolve?: webpack.WebpackOptionsNormalized["resolve"],
}

class SSRWebpackPlugin {
  options: SSRWebpackPluginProps = {
    "entry": path.resolve(process.cwd(), "src/server"),
    "target": "node",
    externalsPresets: { node: true },  // 为了忽略 path、fs 等内置模块
    "resolve": {
      "extensions": [".cjs", ".jsx", ".js", ".mjs", "ts", "tsx"],
    },
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
      this.options = webapckMerge(this.options, options);
    }
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.thisCompilation.tap('SSRWebpackPlugin', (compilation) => {

      const output = this.options.output

      const childCompiler = compilation.createChildCompiler('SSRWebpackPlugin', output);

      // new webpack.library.EnableLibraryPlugin('commonjs2').apply(childCompiler);

      new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }).apply(childCompiler);

      const entry = this.options.entry as string
      new webpack.EntryPlugin(compilation.compiler.context, entry).apply(childCompiler);

      new webpack.node.NodeTargetPlugin().apply(childCompiler);
      // new webpack.LoaderTargetPlugin("node").apply(childCompiler)
      // new webpack.Module().apply(childCompiler)

      let externals = [nodeExternals()]
      if (this.options.externals) {
        if (Array.isArray(this.options.externals)) {
          externals = externals.concat(this.options.externals)
        } else {
          externals = externals.concat([this.options.externals])
        }
      }
      new webpack.ExternalsPlugin('SSRWebpackPlugin', externals).apply(childCompiler)

      childCompiler.runAsChild((err, entries, chidlCompilation) => {
        if (err) {
          console.log(err);
          process.exit(1)
        }
      });
    });
  }
}

export default SSRWebpackPlugin;
