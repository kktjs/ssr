// Process application JS with Babel.
// The preset includes JSX, Flow, TypeScript and some ESnext features.
module.exports = (conf, { appSrc, kktrc, ...otherOption }) => {
  const mainBabelOptions = {
    babelrc: true,
    cacheDirectory: true,
    presets: [],
  };
  mainBabelOptions.presets.push(require.resolve('../babel'));

  // Allow app to override babel options
  const babelOptions = kktrc && kktrc.babel
    ? kktrc.babel(mainBabelOptions, { appSrc, ...otherOption })
    : mainBabelOptions;

  conf.module.rules = [
    ...conf.module.rules,
    {
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      include: appSrc,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: babelOptions,
        },
      ],
    },
  ];
  return conf;
};
