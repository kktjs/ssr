const LoadableWebpackPlugin = require('@loadable/webpack-plugin');
const LoadableBabelPlugin = require('@loadable/babel-plugin');
const babelPreset = require('@kkt/ssr/babel');

const path = require('path');

module.exports = {
  // Modify the babel config
  babel: (conf) => {
    conf = {
      babelrc: false,
      presets: [babelPreset],
      plugins: [LoadableBabelPlugin],
    }
    console.log('conf:', conf);
    return conf;
  },
  // Modify the webpack config
  config: (conf, { target, dev, env }, webpack) => {
    if (target === 'web') {
      return {
        ...conf,
        plugins: [
          ...conf.plugins,
          new LoadableWebpackPlugin({ filename: '../loadable-stats.json', writeToDisk: true }),
        ],
      };
    }
    return conf;
  },
};
