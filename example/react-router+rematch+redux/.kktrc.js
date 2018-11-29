// const { DynamicLoadablePlugin } = require('react-dynamic-loadable/DynamicLoadablePlugin');
const { DynamicLoadablePlugin } = require('./plugins/DynamicLoadablePlugin');

module.exports = {
  config: (conf, { target, dev, env }, webpack) => {
    if (target === 'web') {
      return {
        ...conf,
        plugins: [
          ...conf.plugins,
          new DynamicLoadablePlugin({
            filename: './dist/loadable-assets.json',
            exclude: /.(js|css)$/
          }),
        ],
      };
    }
    return conf;
  },
};
