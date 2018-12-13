
module.exports = (conf) => {
  conf.module.rules = [
    ...conf.module.rules,
    {
      exclude: [
        /\.html$/,
        /\.(js|mjs|jsx|ts|tsx|vue)$/,
        /\.(less)$/,
        /\.(re)$/,
        /\.(s?css|sass)$/,
        /\.json$/,
        /\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/,
      ],
      loader: require.resolve('file-loader'),
      options: {
        name: 'static/media/[name].[hash:8].[ext]',
      },
    },
  ];
  return conf;
};
