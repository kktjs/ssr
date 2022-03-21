

import createCompiler from "./utils"
import { OptionsProps } from "../interface"
import { devServerConfigPath, webpackConfigPath, reactScripts, reactDevUtils } from "./../overrides/pathUtils"
import webpackDevServer from "webpack-dev-server"
import { Application } from 'express';
import MockerApi from "mocker-api"

const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const redirectServedPath = require('react-dev-utils/redirectServedPathMiddleware');

export default async (options: OptionsProps) => {
  try {
    const { overrides, config } = await createCompiler("development", options, false)

    const openBrowserPath = `${reactDevUtils}/openBrowser`;

    require(openBrowserPath);

    // override config in memory
    require.cache[require.resolve(openBrowserPath)].exports = () => { };

    require.cache[require.resolve(webpackConfigPath)].exports = (env: string) => config;

    const webpackdDevServerConfigPath = require(`${devServerConfigPath}`)

    require.cache[require.resolve(devServerConfigPath)].exports = (proxy: webpackDevServer.Configuration['proxy'], allowedHost: string) => {

      const webpackdDevServerConfig = webpackdDevServerConfigPath(proxy, allowedHost)

      delete webpackdDevServerConfig.onAfterSetupMiddleware;
      delete webpackdDevServerConfig.onBeforeSetupMiddleware;

      webpackdDevServerConfig.setupMiddlewares = (middlewares: webpackDevServer.Middleware[], devServer: webpackDevServer) => {
        process.env.HOST = devServer.options.host ? `${devServer.options.host}` : 'localhost';
        process.env.PORT = devServer.options.port ? `${devServer.options.port}` : "3000"

        // Keep `evalSourceMapMiddleware`
        // middlewares before `redirectServedPath` otherwise will not have any effect
        // This lets us fetch source contents from webpack for the error overlay
        devServer.app.use(evalSourceMapMiddleware(devServer));

        if (overrides.proxySetup && typeof overrides.proxySetup === "function") {
          // This registers user provided middleware for proxy reasons
          const result = overrides.proxySetup(devServer.app);
          if (result.path) {
            MockerApi(devServer.app, result.path, result.options)
          }
        }

        // Redirect to `PUBLIC_URL` or `homepage` from `package.json` if url not match
        devServer.app.use(redirectServedPath(overrides.paths.publicUrlOrPath));

        // This service worker file is effectively a 'no-op' that will reset any
        // previous service worker registered for the same host:port combination.
        // We do this in development to avoid hitting the production cache if
        // it used the same host and port.
        // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
        devServer.app.use(noopServiceWorkerMiddleware(overrides.paths.publicUrlOrPath));

        return middlewares
      }

      return webpackdDevServerConfig

    }

    require(`${reactScripts}/scripts/start`);

  }
  catch (error) {
    const message = error && error.message ? error.message : '';
    console.log('\x1b[31;1m KKT-SSR:START:ERROR: \x1b[0m\n', error);
    new Error(`KKT-SSR:START:ERROR: \n ${message}`);
    process.exit(1);
  }

}