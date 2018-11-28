// Process application JS with Babel.
// The preset includes JSX, Flow, TypeScript and some ESnext features.
module.exports = (conf, { appSrc }) => {
  conf.module.rules = [
    ...conf.module.rules,
    {
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      include: appSrc,
      loader: require.resolve('babel-loader'),
      options: require('babel-preset-kkt'), // eslint-disable-line
    },
  ];
  return conf;
};
