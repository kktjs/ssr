
import createCompiler from "./utils"
import { reactScripts } from "../overrides/pathUtils"
const chalk = require('react-dev-utils/chalk');

export default async () => {
  try {
    // const webpackConfigPath = `${reactScripts}/config/webpack.config`;
    const { config, compiler } = createCompiler("production")
    // 暂时先使用这种方式
    compiler.run((err, stats) => {
      if (err) {
        console.log(err)
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
        console.log(stats.toString())
      }
    })
    // 使用 这个会报错   Cannot read properties of undefined (reading 'publicPath')
    // require.cache[require.resolve(webpackConfigPath)].exports = (env: string) => config;
    // await require(`${reactScripts}/scripts/build`);
  }
  catch (error) {
    const message = error && error.message ? error.message : '';
    console.log('\x1b[31;1m KKT:BUILD:ERROR: \x1b[0m\n', error);
    new Error(`KKT:BUILD:ERROR: \n ${message}`);
    process.exit(1);
  }
}