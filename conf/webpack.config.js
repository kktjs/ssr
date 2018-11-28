

const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const AssetsPlugin = require('assets-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const SimpleProgressWebpackPlugin = require('@kkt/simple-progress-webpack-plugin');
const StartServerPlugin = require('start-server-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const paths = require('./');
const devServer = require('./webpack.config.server');

const getClientEnv = require('./env').getClientEnv;
const nodePath = require('./env').nodePath;

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
// const publicPath = paths.servedPath;
// Some apps do not use client-side routing with pushState.
// For these, "homepage" can be set to "." to enable relative asset paths.
// const shouldUseRelativeAssetPaths = publicPath === './';

module.exports = (
  target = 'web',
  env = 'dev',
) => {
  const IS_NODE = target === 'node';
  const IS_WEB = target === 'web';
  const IS_PROD = env === 'prod';
  const IS_DEV = env === 'dev';

  process.env.NODE_ENV = IS_PROD ? 'production' : 'development';
  const dotenv = getClientEnv(target);
  let conf = {
    mode: IS_DEV ? 'development' : 'production',
    // Set webpack context to the current command's directory
    context: process.cwd(),
    // Specify target (either 'node' or 'web')
    target,
    plugins: [],
    optimization: {},
    module: {
      strictExportPresence: true,
      rules: [],
    },
    // We need to tell webpack how to resolve both APP's node_modules and
    // the users', so we use resolve and resolveLoader.
    resolve: {
      modules: ['node_modules', paths.appNodeModules].concat(
        // It is guaranteed to exist because we tweak it in `env.js`
        nodePath.split(path.delimiter).filter(Boolean)
      ),
      extensions: ['.mjs', '.jsx', '.js', '.json'],
      alias: {
        // This is required so symlinks work during development.
        'webpack/hot/poll': require.resolve('webpack/hot/poll'),
        // Support React Native Web
        // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
        'react-native': 'react-native-web',
      },
    },
    // Turn off performance processing because we utilize
    // our own hints via the FileSizeReporter
    performance: false,
  };

  if (IS_PROD) conf.bail = true;

  if (IS_DEV) {
    // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
    // See the discussion in https://github.com/facebook/create-react-app/issues/343
    // conf.devtool = 'cheap-module-source-map';
  } else {
    // Don't attempt to continue if there are any errors.
    // We generate sourcemaps in production. This is slow but gives good results.
    // You can exclude the *.map files from the build during deployment.
    // conf.devtool = shouldUseSourceMap ? 'source-map' : false;
  }

  // const optimization = require('./plugs/optimization'); // eslint-disable-line
  // =============================================
  // conf.optimization = optimization(conf); // eslint-disable-line
  // =============================================
  conf.resolveLoader = {
    modules: [paths.appNodeModules, paths.ownNodeModules],
  };

  // =============================================
  // Disable require.ensure as it's not a standard language feature.
  conf.module.rules.push({ parser: { requireEnsure: false } });
  const optionConf = { target, env, dev: IS_DEV, ...paths };

  conf = require('../plugs/rule-eslint')(conf, optionConf); // eslint-disable-line
  conf = require('../plugs/rule-url')(conf, optionConf); // eslint-disable-line
  conf = require('../plugs/rule-babel')(conf, optionConf); // eslint-disable-line
  conf = require('../plugs/rule-css')(conf, optionConf); // eslint-disable-line
  conf = require('../plugs/rule-file')(conf, optionConf); // eslint-disable-line

  // We define environment variables that can be accessed globally in our
  conf.plugins.push(new webpack.DefinePlugin(dotenv.stringified));

  const devServerPort = parseInt(dotenv.raw.PORT, 10) + 1;
  if (IS_NODE) {
    conf.entry = [paths.appServerIndexJs];
    conf.node = {
      __console: false,
      __dirname: false,
      __filename: false,
    };
    // We need to tell webpack what to bundle into our Node bundle.
    conf.externals = [
      nodeExternals({
        whitelist: [
          IS_DEV ? 'webpack/hot/poll?300' : null,
          /\.(eot|woff|woff2|ttf|otf)$/,
          /\.(svg|png|jpg|jpeg|gif|ico)$/,
          /\.(mp4|mp3|ogg|swf|webp)$/,
          /\.(css|scss|sass|sss|less)$/,
        ].filter(x => x),
      }),
    ];

    // Specify webpack Node.js output path and filename
    conf.output = {
      path: paths.appBuildDist,
      publicPath: IS_DEV ? `http://${dotenv.raw.HOST}:${devServerPort}/` : '/',
      filename: 'server.js',
      libraryTarget: 'commonjs2',
    };
    // Prevent creating multiple chunks for the server
    conf.plugins.push(new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }));
    if (IS_DEV) {
      // Use watch mode
      conf.watch = true;
      // https://github.com/webpack/docs/issues/45#issuecomment-149793458
      // Use webpack/hot/poll or webpack/hot/signal
      // The first polls the fs for updates(easy to use)
      // The second listens for a process event to check for updates(you need a way to send the signal)
      conf.entry.unshift('webpack/hot/poll?300');
      // Add hot module replacement
      conf.plugins.push(new webpack.HotModuleReplacementPlugin());
      conf.plugins.push(new StartServerPlugin({
        name: 'server.js',
      }));

      // Ignore assets.json to avoid infinite recompile bug
      conf.plugins.push(new webpack.WatchIgnorePlugin([paths.appManifest]));
    }
  }

  if (IS_WEB) {
    // Output our JS and CSS files in a manifest file called assets.json
    // in the build directory.
    conf.plugins.push(new AssetsPlugin({
      path: paths.appBuildDist,
      filename: 'assets.json',
    }));

    if (IS_DEV) {
      // Setup Webpack Dev Server on port 3001 and
      // specify our client entry point /client/index.js
      conf.entry = {
        client: [
          require.resolve('webpack-hot-dev-clients/webpackHotDevClient'),
          paths.appClientIndexJs,
        ].filter(Boolean),
      };
      // Configure our client bundles output. Not the public path is to 3001.
      conf.output = {
        path: paths.appBuildPublic,
        publicPath: `http://${dotenv.raw.HOST}:${devServerPort}/`,
        pathinfo: true,
        libraryTarget: 'var',
        filename: 'static/js/bundle.js',
        chunkFilename: 'static/js/[name].chunk.js',
        devtoolModuleFilenameTemplate: info => path.resolve(info.resourcePath).replace(/\\/g, '/'),
      };
      conf.plugins.push(new webpack.HotModuleReplacementPlugin({ multiStep: true }));
      conf.plugins.push(new FriendlyErrorsWebpackPlugin());
      // Configure webpack-dev-server to serve our client-side bundle from
      // http://${dotenv.raw.HOST}:3001
      conf.devServer = devServer(dotenv);
    } else {
      // Specify production entry point (/client/index.js)
      conf.entry = {
        client: [paths.appClientIndexJs].filter(Boolean),
      };
      // Specify the client output directory and paths. Notice that we have
      // changed the publiPath to just '/' from http://localhost:3001. This is because
      // we will only be using one port in production.
      conf.output = {
        path: paths.appBuildPublic,
        publicPath: dotenv.raw.PUBLIC_PATH || '/',
        filename: 'static/js/bundle.[chunkhash:8].js',
        chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
        libraryTarget: 'var',
      };
      conf.plugins.push(new webpack.HashedModuleIdsPlugin());
      conf.plugins.push(new webpack.optimize.AggressiveMergingPlugin());
      conf.plugins.push(new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'static/css/[name].[hash].css',
        chunkFilename: 'static/css/[id].[hash].css',
      }));
    }
  }

  conf.plugins.push(new SimpleProgressWebpackPlugin({
    format: 'compact',
    name: target === 'web' ? 'Client' : 'Server',
  }));

  conf.plugins.filter(Boolean);
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  conf.node = {
    ...conf.node,
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  };
  // Load private .kkt.conf.js config file.
  conf = require('../utils/loadConfig')(conf, optionConf, webpack); // eslint-disable-line
  return conf;
};
