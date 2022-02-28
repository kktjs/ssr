import webpack from 'webpack';
import path from 'path';
import nodeExternals from 'webpack-node-externals';
import webapckMerge from 'webpack-merge';

class SSRWebpackPlugin {
  options: webpack.Configuration = {
    "entry": path.join(process.cwd(), 'src/server.js'),
    "target": "node",
    "output": {
      "path": path.join(process.cwd(), '/dist'),
      "filename": 'server.js',
      "library": {
        "type": "commonjs2",
      },
    },
  }

  constructor(options: webpack.Configuration) {
    if (options) {
      this.options = webapckMerge(this.options, options);
    }
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.thisCompilation.tap('SSRWebpackPlugin', (compilation) => {

      const output = this.options.output as webpack.WebpackOptionsNormalized["output"]

      const childCompiler = compilation.createChildCompiler('SSRWebpackPlugin', output, this.options.plugins || []);

      new webpack.library.EnableLibraryPlugin('commonjs2').apply(childCompiler);

      new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }).apply(childCompiler);

      const entry = this.options.entry as string
      new webpack.EntryPlugin(compilation.compiler.context, entry).apply(childCompiler);

      let externals = [nodeExternals()]
      if (this.options.externals) {
        if (Array.isArray(this.options.externals)) {
          externals = externals.concat(this.options.externals)
        } else {
          externals = externals.concat([this.options.externals])
        }
      }
      new webpack.ExternalsPlugin('node', externals).apply(childCompiler);

      childCompiler.runAsChild((err, entries, compilation) => {
        if (err) {
          console.log(err);
          process.exit(1)
          return null;
        }
      });
    });
  }
}

export default SSRWebpackPlugin;
