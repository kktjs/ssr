import webpack from 'webpack';
import path from 'path';
import nodeExternals from 'webpack-node-externals';
import webapckMerge from 'webpack-merge';

export interface SSRWebpackPluginProps extends webpack.Configuration {
  output?: webpack.WebpackOptionsNormalized["output"],
  entry?: string;
  externals?: webpack.WebpackOptionsNormalized["externals"]
  target?: string;
  externalsPresets?: webpack.WebpackOptionsNormalized["externalsPresets"],
  resolve?: webpack.WebpackOptionsNormalized["resolve"],
}

class SSRWebpackPlugin {
  options: SSRWebpackPluginProps = {

    mode: "production",
    target: "node",
    entry: path.resolve(__dirname, "./src/serverIndex.js"),
    output: {
      path: path.resolve(__dirname, "./dist"),
      filename: "ssr.js",
      "library": {
        "type": "commonjs2",
      },
    },
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          loader: "babel-loader",
          exclude: /node_moudles/
        },
        {
          test: /\.(css)$/,
          loader: "css-loader",
          exclude: /node_moudles/
        }
      ]
    },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.ts', '.tsx', '.js', '.json']
    }
  }

  constructor(options: SSRWebpackPluginProps) {
    if (options) {
      this.options = webapckMerge(this.options, options);
    }
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.thisCompilation.tap('SSRWebpackPlugin', (compilation) => {

      const childCompiler = compiler.webpack(this.options)

      childCompiler.hooks.thisCompilation.tap("sss", (compilation) => {
        compilation.hooks.processAssets.tap("sss", (CompilationAssets) => {
          console.log("CompilationAssets", CompilationAssets)
          Object.entries(CompilationAssets || {}).forEach(([name, so]) => {
            compilation.emitAsset(name, so)
          })
        })

      })

      childCompiler.run((err) => {
        if (err) {
          console.log(err)
          process.exit(1)
        }
      })

    });
  }
}

export default SSRWebpackPlugin;
