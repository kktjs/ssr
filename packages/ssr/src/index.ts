import path from 'path';
import webpack, { Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import StartServerPlugin from '@kkt/start-server-webpack-plugin';
import AssetsPlugin from 'assets-webpack-plugin';
import { LoaderConfOptions } from 'kkt';
import { reactScripts } from 'kkt/lib/utils/path';
import removeRuleReactRefresh from './removeRuleReactRefresh';
import removePlugins from './removePlugins';
import manifestPlugin from './manifestPlugin';
import modifyRuleStyle from './modifyRuleStyle';
import WebpackHookPlugin from './WebpackHookPlugin';

// Capture any --inspect or --inspect-brk flags (with optional values) so that we
// can pass them when we invoke nodejs
process.env.INSPECT_BRK = process.argv.find((arg) => arg.match(/--inspect-brk(=|$)/)) || '';
process.env.INSPECT = process.argv.find((arg) => arg.match(/--inspect(=|$)/)) || '';

export type SSROptions = LoaderConfOptions & {
  host?: string;
  port?: number;
};

export type ResultConfig = Configuration;

export default (conf: Configuration, env: string, options = {} as SSROptions): ResultConfig => {
  if (!conf) {
    throw Error('KKT:ConfigPaths: there is no config file found');
  }

  const serverConfig = { ...conf };
  let { paths, port, host } = options;

  port = port || parseInt(process.env.PORT) || 3000;
  host = host || process.env.HOST || 'localhost';

  const getClientEnvironment = require(`${reactScripts}/config/env.js`);
  const dotenv = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));
  const IS_PROD = env === 'production';
  const IS_DEV = env === 'development';

  // VMs, Docker containers might not be available at localhost:3001. CLIENT_PUBLIC_PATH can override.
  const clientPublicPath = dotenv.raw.CLIENT_PUBLIC_PATH || (IS_DEV ? `http://${host}:${port}/` : '/');
  const serverPublicPath = dotenv.raw.CLIENT_PUBLIC_PATH || (IS_DEV ? `http://${host}:${port + 1}/` : '/');
  console.log('\x1b[1;37mServer: \x1b[0m', `${serverPublicPath}`);
  console.log('\x1b[1;37mClient: \x1b[0m', `${clientPublicPath}`);
  console.log('\x1b[1;37m PORT: \x1b[0m', process.env.PORT);

  conf.entry = path.resolve(paths.appSrc, 'client.js');

  conf.output.publicPath = serverPublicPath;

  // Specify webpack Node.js output path and filename
  serverConfig.output = {
    path: paths.appBuild,
    publicPath: serverPublicPath,
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  };

  serverConfig.entry = { server: [paths.appSrc] };
  delete serverConfig.bail;
  // delete serverConfig.resolve.plugins;
  serverConfig.resolve = {
    ...serverConfig.resolve,
    mainFields: ['main', 'module'],
  };

  // We want to uphold node's __filename, and __dirname.
  serverConfig.target = 'node';
  serverConfig.node = {
    __console: false,
    __dirname: false,
    __filename: false,
  };
  // We need to tell webpack what to bundle into our Node bundle.
  serverConfig.externals = [
    nodeExternals({
      allowlist: [
        IS_DEV ? 'webpack/hot/poll?300' : null,
        /\.(eot|woff|woff2|ttf|otf)$/,
        /\.(svg|png|jpg|jpeg|gif|ico)$/,
        /\.(mp4|mp3|ogg|swf|webp)$/,
        /\.(css|scss|sass|sss|less)$/,
      ].filter((x) => x),
    }),
  ];

  serverConfig.module.rules = removeRuleReactRefresh(serverConfig.module.rules);
  serverConfig.module.rules = modifyRuleStyle(serverConfig.module.rules);
  const regexp = /(HtmlWebpackPlugin|ManifestPlugin|ReactRefreshWebpackPlugin|InterpolateHtmlPlugin|ModuleNotFoundPlugin|ReactRefreshPlugin|LimitChunkCountPlugin|WatchMissingNodeModulesPlugin)/;
  serverConfig.plugins = removePlugins(serverConfig.plugins, regexp);
  // in dev mode emitting one huge server file on every save is very slow
  serverConfig.plugins.push(
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  );
  const appAssetsManifest = path.resolve(paths.appBuild, 'assets.json');
  serverConfig.plugins.push(
    new webpack.DefinePlugin({
      KKT_PUBLIC_DIR: `"${paths.appPublic}"`,
      KKT_ASSETS_MANIFEST: `"${appAssetsManifest}"`,
    }),
  );

  serverConfig.optimization = {
    splitChunks: {
      // Chunk splitting optimiztion
      chunks: 'all',
      // Switch off name generation, otherwise files would be invalidated
      // when more chunks with the same vendors are added
      name: false,
    },
  };

  console.log('serverConfig.output>>>>', serverConfig.output);
  console.log('conf.output>>>>', conf.output);

  conf.plugins.push(manifestPlugin({ fileName: path.join(paths.appBuild, 'chunks.json'), config: conf }));
  conf.plugins.push(
    new AssetsPlugin({
      path: paths.appBuild,
      filename: 'assets.json',
    }),
  );

  if (IS_DEV) {
    // Use watch mode
    serverConfig.watch = true;
    if (Array.isArray(serverConfig.entry.server)) {
      serverConfig.entry.server.unshift(`${require.resolve('webpack/hot/poll')}?300`);
    }
    // Add hot module replacement
    serverConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    // const appChunksManifest = resolveApp('build/chunks.json');
    // Ignore `assets.json` to avoid infinite recompile bug
    serverConfig.plugins.push(new webpack.WatchIgnorePlugin([appAssetsManifest]));
  }
  conf.plugins.push(
    new WebpackHookPlugin({
      onAfterEmit(count) {
        if (count === 1) {
          const nodeArgs = ['-r', 'source-map-support/register'];
          // Passthrough --inspect and --inspect-brk flags (with optional [host:port] value) to node
          if (process.env.INSPECT_BRK) {
            nodeArgs.push(process.env.INSPECT_BRK);
          } else if (process.env.INSPECT) {
            nodeArgs.push(process.env.INSPECT);
          }
          // Automatically start your server once Webpack's build completes.
          serverConfig.plugins.push(
            new StartServerPlugin({
              entryName: 'server',
              nodeArgs,
            }),
          );

          const serverCompiler = compile(serverConfig);
          serverCompiler.watch(
            {
              /**
               * For some systems, watching many file systems can result in a lot of CPU or memory usage.
               * It is possible to exclude a huge folder like node_modules.
               * It is also possible to use anymatch patterns.
               */
              ignored: [paths.appNodeModules, paths.appBuild, 'node_modules'],
            },
            (stats) => {
              if (stats) {
                // You ran Webpack twice. Each instance only supports a single concurrent compilation at a time.
                console.log('stats==>', stats);
              }
            },
          );
        }
      },
    }),
  );
  return conf;
};

// Webpack compile in a try-catch
function compile(config: Configuration): webpack.Compiler {
  let compiler = undefined;
  try {
    compiler = webpack(config);
  } catch (e) {
    console.log('\x1b[31m Failed to compile.\x1b[0m', [e], '-- verbose --');
    process.exit(1);
  }
  return compiler;
}
