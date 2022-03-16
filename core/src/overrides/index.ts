// 获取 根目录下 自己定义的配置

import fs from 'fs';
import { resolveModule, resolveApp } from "./pathUtils"
import webpack from "webpack"

const tsOptions = {
  compilerOptions: {
    sourceMap: false,
    target: 'es6',
    module: 'commonjs',
    moduleResolution: 'node',
    allowJs: false,
    declaration: true,
    strict: true,
    noUnusedLocals: true,
    experimentalDecorators: true,
    resolveJsonModule: true,
    esModuleInterop: true,
    removeComments: false,
  },
};

const confPath = resolveModule(resolveApp, '.kktssrrc');

export type WebpackConfigFunction = (conf: webpack.Configuration[] | webpack.Configuration, env: "development" | "production") => webpack.Configuration[] | webpack.Configuration;

export interface OverridesProps {
  /** 环境变变量 */
  GENERATE_SOURCEMAP?: string,
  INLINE_RUNTIME_CHUNK?: string,
  ESLINT_NO_DEV_ERRORS?: string,
  DISABLE_ESLINT_PLUGIN?: string,
  /** paths 脚本中webpack配置 使用的地址  */
  paths?: Record<string, string>;

  /** 最终覆写 webpack  配置 **/
  /** 客户端配置  */
  overridesClientWebpack?: (conf: webpack.Configuration, env: "development" | "production") => webpack.Configuration,
  /** 服务端配置  */
  overridesServerWebpack?: (conf: webpack.Configuration, env: "development" | "production") => webpack.Configuration;
  // 最终的配置
  overridesWebpack?: WebpackConfigFunction

  /** 服务端打包入口 */
  server_path?: string,
  /** 客户端打包入口 */
  client_path?: string,
  /** 输出文件地址 */
  output_path?: string;
  /**  watch 配置 */
  watchOptions?: webpack.Configuration["watchOptions"]
}

let overrides: OverridesProps = {
  // 服务端打包入口
  server_path: resolveModule(resolveApp, 'src/server'),
  // 客户端打包入口
  client_path: resolveModule(resolveApp, 'src/client'),
  /** 输出文件地址 */
  output_path: resolveApp("dist"),

  // paths 地址
  paths: {},
  // 最终自定义配置设置
  overridesClientWebpack: undefined,
  overridesServerWebpack: undefined,
  overridesWebpack: undefined,
  watchOptions: {}

};

export async function loaderConf(): Promise<OverridesProps> {
  let kktssrrc: OverridesProps = {};
  try {
    if (fs.existsSync(confPath) && /.ts$/.test(confPath)) {
      require('ts-node').register(tsOptions);
      kktssrrc = await import(confPath);
    } else if (fs.existsSync(confPath) && /.js$/.test(confPath)) {
      require('@babel/register')({
        presets: [[require.resolve('babel-preset-react-app'), { runtime: 'classic', useESModules: false }]],
      });
      kktssrrc = await import(confPath);
    }
    overrides = {
      ...overrides,
      ...kktssrrc,
    }
    return overrides;
  } catch (error) {
    const message = error && error.message ? error.message : '';
    console.log('Invalid \x1b[31;1m .kktssrrc.js \x1b[0m file.\n', error);
    new Error(`Invalid .kktssrrc.js file. \n ${message}`);
    process.exit(1);
  }
}

export default overrides
