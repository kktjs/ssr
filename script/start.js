// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

require('colors-cli/toxic');
const fs = require('fs-extra');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const detect = require('detect-port');
const createConfig = require('../conf/webpack.config');
const paths = require('../conf');

process.noDeprecation = true; // turns off that loadQuery clutter.

// Capture any --inspect or --inspect-brk flags (with optional values) so that we
// can pass them when we invoke nodejs
process.env.INSPECT_BRK =
  process.argv.find(arg => arg.match(/--inspect-brk(=|$)/)) || '';
process.env.INSPECT =
  process.argv.find(arg => arg.match(/--inspect(=|$)/)) || '';

// Webpack compile in a try-catch
function compile(config) {
  let compiler;
  try {
    compiler = webpack(config);
  } catch (e) {
    console.log('Failed to compile: ', [e]); // eslint-disable-line
    process.exit(1);
  }
  return compiler;
}

module.exports = async () => {
  let DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3723;
  const PORT = await detect(DEFAULT_PORT);

  if (DEFAULT_PORT !== PORT) {
    DEFAULT_PORT = PORT;
  }
  process.env.PORT = DEFAULT_PORT;

  // Delete assets.json to always have a manifest up to date
  fs.removeSync(paths.appManifest);

  const clientConfig = createConfig('web', 'dev');
  const serverConfig = createConfig('node', 'dev');

  // Compile our assets with webpack
  const clientCompiler = compile(clientConfig);
  const serverCompiler = compile(serverConfig);

  serverCompiler.hooks.failed.tap('failed', (error) => {
    if (error && error.compilation) {
      if (error.compilation.errors && error.compilation.errors.length > 0) {
        console.log('error:', error.compilation.errors); // eslint-disable-line
      }
      if (error.compilation.warnings && error.compilation.warnings.length > 0) {
        console.log('error:', error.compilation.warnings); // eslint-disable-line
      }
    }
  });

  // Instatiate a variable to track server watching
  let watching;

  // Start our server webpack instance in watch mode after assets compile
  clientCompiler.hooks.done.tap('done', () => {
    if (watching) {
      return;
    }
    watching = serverCompiler.watch(
      {
        quiet: true,
        stats: 'none',
      },
      /* eslint-disable no-unused-vars */
      (stats) => {
        if (stats) {
          // You ran Webpack twice. Each instance only supports a single concurrent compilation at a time.
          // console.log('stats==>', stats);
        }
      },
    );
  });
  // Create a new instance of Webpack-dev-server for our client assets.
  // This will actually run on a different port than the users app.
  const clientDevServer = new WebpackDevServer(clientCompiler, clientConfig.devServer);

  // Start Webpack-dev-server
  clientDevServer.listen(DEFAULT_PORT + 1, (err) => {
    if (err) {
      console.log('clientDevServerError:', err); // eslint-disable-line
    }
  });
};
