const { ReactLoadablePlugin } = require('react-loadable/webpack');

module.exports = {
  config: (conf, { target, dev, env }, webpack) => {
    if (target === 'web') {
      return {
        ...conf,
        plugins: [
          ...conf.plugins,
          new ReactLoadablePlugin({
            filename: './dist/react-loadable.json',
          }),
        ],
      };
    }
    return conf;
  },
};
