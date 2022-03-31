

import createCompiler from "../utils/getWebpackConfig"
import { OptionsProps } from "../interface"
import { webpackConfigPath, reactScripts, reactDevUtils } from "./../overrides/pathUtils"
import overridesDevServer from "../overrides/overridesDevServer"
export default async (options: OptionsProps) => {
  // 修复 运行 start 停止之后，再次运行 watch 报错
  delete require.cache[require.resolve(webpackConfigPath)];
  delete require.cache[require.resolve(`${reactDevUtils}/openBrowser`)];

  try {
    const { overrides, config } = await createCompiler("development", options)

    require.cache[require.resolve(webpackConfigPath)].exports = (env: string) => config;

    await overridesDevServer(overrides, options.original)

    require(`${reactScripts}/scripts/start`);

  }
  catch (error) {
    const message = error && error.message ? error.message : '';
    console.log('\x1b[31;1m KKT-SSR:START:ERROR: \x1b[0m\n', error);
    new Error(`KKT-SSR:START:ERROR: \n ${message}`);
    process.exit(1);
  }

}