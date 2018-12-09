const path = require('path');
const apiMocker = require('mocker-api');

module.exports = {
  config: (conf, { target, dev, env, ...other }, webpack) => {
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
