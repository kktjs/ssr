const path = require('path');
const LoadablePlugin = require('@loadable/webpack-plugin')
const apiMocker = require('webpack-api-mocker');

module.exports = {
  plugins: [
    require.resolve('@kkt/plugin-less'),
  ],
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
