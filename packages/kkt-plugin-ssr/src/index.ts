import webpack from 'webpack';
import path from 'path';
import nodeExternals from 'webpack-node-externals';
import webapckMerge from 'webpack-merge';

export interface SSRWebpackPluginProps {
  output?: webpack.WebpackOptionsNormalized["output"],
  entry?: string;
  externals?: webpack.WebpackOptionsNormalized["externals"]
  target?: string;
}

class SSRWebpackPlugin {
  options: SSRWebpackPluginProps = {
    "entry": path.join(process.cwd(), 'src/server.js'),
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
      this.options = webapckMerge(this.options, options);
    }
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.thisCompilation.tap('SSRWebpackPlugin', (compilation) => {

      const output = this.options.output

      const childCompiler = compilation.createChildCompiler('SSRWebpackPlugin', output);

      new webpack.library.EnableLibraryPlugin('commonjs2').apply(childCompiler);

      new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }).apply(childCompiler);

      const entry = this.options.entry as string
      new webpack.EntryPlugin(compilation.compiler.context, entry).apply(childCompiler);

      new webpack.node.NodeTargetPlugin().apply(childCompiler);

      let externals = [nodeExternals()]
      if (this.options.externals) {
        if (Array.isArray(this.options.externals)) {
          externals = externals.concat(this.options.externals)
        } else {
          externals = externals.concat([this.options.externals])
        }
      }
      new webpack.ExternalsPlugin('node', externals).apply(childCompiler)

      childCompiler.runAsChild((err) => {
        if (err) {
          console.log(err);
          process.exit(1)
        }
      });
    });
  }
}

export default SSRWebpackPlugin;
