
module.exports = (dotenv) => {
  const serverConf = {
    disableHostCheck: true,
    clientLogLevel: 'none',
    // Enable gzip compression of generated files.
    compress: true,
    // watchContentBase: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: {
      // Paths with dots should still use the history fallback.
      // See https://github.com/facebookincubator/create-react-app/issues/387.
      disableDotRule: true,
    },
    host: dotenv.raw.HOST,
    hot: true,
    noInfo: true,
    overlay: false,
    port: parseInt(dotenv.raw.PORT, 10) + 1,
    quiet: true,
    // By default files from `contentBase` will not trigger a page reload.
    // Reportedly, this avoids CPU overload on some systems.
    // https://github.com/facebookincubator/create-react-app/issues/293
    watchOptions: {
      ignored: /node_modules/,
    },
    // before(app) {
    // },
  };
  return serverConf;
};
