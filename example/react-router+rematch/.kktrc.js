const apiMocker = require('mocker-api');

module.exports = {
  plugins: [
    require.resolve('@kkt/plugin-less'),
  ],
  // Modify the webpack config
  config: (conf, { target, dev, env }, webpack) => {
    /**
     * Uncaught Invariant Violation: 4.3.1 -> 5.0.1 w/ monorepo use of shared components
     * https://github.com/ReactTraining/react-router/issues/6769#issuecomment-505435886
     */
    if (target === 'web' && env === 'prod') {
      // conf = {
      //   ...conf,
      //   optimization: {
      //     ...conf.optimization,
      //     // https://webpack.js.org/plugins/split-chunks-plugin/
      //     splitChunks: {
      //       chunks: 'async',
      //       minSize: 30000,
      //       minChunks: 2,
      //       maxAsyncRequests: 5,
      //       maxInitialRequests: 3,
      //       automaticNameDelimiter: '~',
      //       name: true,
      //       cacheGroups: {
      //         vendors: {
      //           test: /[\\/]node_modules[\\/]/,
      //           priority: -10
      //         },
      //         default: {
      //           minChunks: 2,
      //           priority: -20,
      //           reuseExistingChunk: true
      //         }
      //       }
      //     }
      //   }
      // };
    }
    if (target === 'web' && dev && conf.devServer) {
      conf.devServer = {
        ...conf.devServer,
        before: (app) => {
          apiMocker(app, require.resolve('./mocker/index.js'), {
            proxy: {
              '/repos/*': 'https://api.github.com/',
            },
            changeHost: true,
          });
        }
      }
    }
    return conf;
  },
};
