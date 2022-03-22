

import createCompiler from "./utils"
import { OptionsProps } from "../interface"
import { webpackConfigPath, reactScripts, reactDevUtils } from "./../overrides/pathUtils"
import overridesDevServer from "./utils/overridesDevServer"
const { choosePort } = require('react-dev-utils/WebpackDevServerUtils');

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || 'localhost';

export default async (options: OptionsProps) => {

  const PORT = await choosePort(HOST, DEFAULT_PORT);
  process.env.PORT = PORT
  process.env.HOST = HOST;

  try {
    const { overrides, config } = await createCompiler("development", options, true)

    require.cache[require.resolve(webpackConfigPath)].exports = (env: string) => config;

    await overridesDevServer(overrides)

    require(`${reactScripts}/scripts/start`);

  }
  catch (error) {
    const message = error && error.message ? error.message : '';
    console.log('\x1b[31;1m KKT-SSR:START:ERROR: \x1b[0m\n', error);
    new Error(`KKT-SSR:START:ERROR: \n ${message}`);
    process.exit(1);
  }

}