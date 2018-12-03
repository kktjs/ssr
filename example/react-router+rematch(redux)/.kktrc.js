const path = require('path');
const LoadablePlugin = require('@loadable/webpack-plugin')
const apiMocker = require('webpack-api-mocker');
const LoadableBabelPlugin = require('@loadable/babel-plugin');
const babelPreset = require('@kkt/ssr/babel');

module.exports = {
  // Modify the babel config
  // babel: (conf) => {
  //   conf = {
  //     babelrc: false,
  //     presets: [babelPreset],
  //     plugins: [LoadableBabelPlugin],
  //   }
  //   return conf;
  // },
  // Modify the webpack config
  config: (conf, { target, dev, env }, webpack) => {
    if (target === 'web') {
      conf = {
        ...conf,
        plugins: [
          ...conf.plugins,
          new LoadablePlugin({ filename: '../loadable-stats.json', writeToDisk: true }),
          // Ignore assets.json to avoid infinite recompile bug
          // conf.plugins.push(new webpack.WatchIgnorePlugin(['./dist/loadable-assets.json']))
        ],
      };
    }
    console.log('proxyURL:!!!', target, dev);
    console.log('proxyURL:!!!1111:', target, dev);
    if (target === 'web' && dev && conf.devServer) {
      conf.devServer = {
        ...conf.devServer,
        before: (app) => {
          apiMocker(app, path.resolve('./mocker/index.js'), {
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
