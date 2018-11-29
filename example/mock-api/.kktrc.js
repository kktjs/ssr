const path = require('path');
const apiMocker = require('webpack-api-mocker');

module.exports = {
  config: (conf, { target, dev, env }, webpack) => {
    if (target === 'web' && dev) {
      conf.devServer.before = (app) => {
        apiMocker(app, path.resolve('./mocker/index.js'), {
          proxy: {
            '/repos/*': 'https://api.github.com/',
          },
          changeHost: true,
        });
      };
    }
    return conf;
  },
};
