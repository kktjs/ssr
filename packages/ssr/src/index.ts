import path from 'path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import StartServerPlugin from '@kkt/webpack-plugin-start-server';
import WebpackHookPlugin from '@kkt/webpack-plugin-hooks';
import AssetsPlugin from 'assets-webpack-plugin';
import { LoaderConfOptions, WebpackConfiguration } from 'kkt';
import { reactScripts } from 'kkt/lib/utils/path';
import removeRuleReactRefresh from './removeRuleReactRefresh';
import removePlugins from './removePlugins';
import manifestPlugin from './manifestPlugin';
import modifyRuleStyle from './modifyRuleStyle';
import { compile } from './utils';

process.env.KKT_CLEAR_CONSOLE = 'true';
process.env.KKT_OPEN_BROWSER = 'true';

// Capture any --inspect or --inspect-brk flags (with optional values) so that we
// can pass them when we invoke nodejs
process.env.INSPECT_BRK = process.argv.find((arg) => arg.match(/--inspect-brk(=|$)/)) || '';
process.env.INSPECT = process.argv.find((arg) => arg.match(/--inspect(=|$)/)) || '';
process.env.WDS_SOCKET_PORT = '3000';

// Tools like Cloud9 rely on this.
// https://github.com/facebook/create-react-app/blob/0f6fc2bc71d78f0dcae67f3f08ce98a42fc0a57c/packages/react-scripts/scripts/start.js#L63-L65
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || 'localhost' || '0.0.0.0';

export type SSROptions = LoaderConfOptions & {
  host?: string;
  port?: number;
};

export default async (
  conf: WebpackConfiguration,
  env: 'production' | 'development',
  options = {} as SSROptions,
): Promise<WebpackConfiguration> => {
  if (!conf) {
    throw Error('\x1b[1;31m KKT:Config:Paths:\x1b[0m there is no config file found');
  }
  const serverConfig = Object.assign({ ...conf }, {});
  let { paths, port, host } = options;

  port = port || DEFAULT_PORT;
  host = host || HOST;

  const { choosePort } = require('react-dev-utils/WebpackDevServerUtils');
  const clientPort = await choosePort(HOST, port);
  const serverPort = await choosePort(HOST, clientPort + 1);

  const webpackDevClientEntry = require.resolve('react-dev-utils/webpackHotDevClient');
  const getClientEnvironment = require(`${reactScripts}/config/env.js`);
  const dotenv = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));
  const IS_DEV = env === 'development';

  // VMs, Docker containers might not be available at localhost:3001. CLIENT_PUBLIC_PATH can override.
  const clientPublicPath = dotenv.raw.CLIENT_PUBLIC_PATH || (IS_DEV ? `http://${host}:${clientPort}/` : '/');
  const serverPublicPath = IS_DEV ? `http://${host}:${serverPort}/` : '/';
  console.log('\x1b[1;37mClient: \x1b[0m', `${clientPublicPath}`, `\x1b[1;37m Client PORT: \x1b[0m ${clientPort}`);
  console.log('\x1b[1;37mServer: \x1b[0m', `${serverPublicPath}`, `\x1b[1;37m Server PORT: \x1b[0m ${serverPort}`);

  conf.entry = IS_DEV
    ? [webpackDevClientEntry, path.resolve(paths.appSrc, 'client.js')]
    : [path.resolve(paths.appSrc, 'client.js')];

  conf.target = 'web';
  conf.output.publicPath = clientPublicPath;
  conf.plugins = removePlugins(conf.plugins, /(InterpolateHtmlPlugin)/);
  conf.plugins.push(
    manifestPlugin({ fileName: path.join(paths.appBuild, 'chunks.json'), publicUrlOrPath: paths.publicUrlOrPath }),
  );
  conf.plugins.push(new AssetsPlugin({ path: paths.appBuild, filename: 'assets.json' }));

  serverConfig.target = 'node';
  serverConfig.entry = { server: [paths.appSrc] };
  // Specify webpack Node.js output path and filename
  serverConfig.output = {
    path: paths.appBuild,
    publicPath: clientPublicPath,
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  };
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
  const appChunks = path.resolve(paths.appBuild, 'chunks.json');
  serverConfig.plugins.push(
    new webpack.DefinePlugin({
      KKT_PUBLIC_DIR: `"${paths.appPublic}"`,
      KKT_ASSETS_MANIFEST: `"${appAssetsManifest}"`,
      KKT_CHUNKS: `"${appChunks}"`,
      KKT_SSR_CLIENT_PORT: `${clientPort}`,
      KKT_SSR_SERVER_PORT: `${serverPort}`,
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
      onDonePromise(stats, count) {
        return new Promise((resolve, reject) => {
          if (count > 1) return resolve(stats);
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
          // console.log('\x1b[1;32m:dev:server:conf:1:\x1b[0m', serverConfig)
          // console.log('\x1b[1;32m:dev:client:conf:2:\x1b[0m', conf)
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
              resolve(stats);
              if (stats) {
                // You ran Webpack twice. Each instance only supports a single concurrent compilation at a time.
                console.log('stats=>', stats);
              }
            },
          );
        });
      },
    }),
  );
  return conf;
};
