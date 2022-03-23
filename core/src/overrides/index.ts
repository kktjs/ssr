// 获取 根目录下 自己定义的配置

import fs from 'fs';
import { resolveModule, resolveApp, Paths } from "./pathUtils"

import webpack from "webpack"
import { restENV } from "./env"
import paths from "./path"
import { overridePaths } from 'kkt/lib/overrides/paths';
import { Application } from 'express';

import { MockerOption } from "mocker-api"

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

export type WebpackConfigFunction = (conf: webpack.Configuration[] | webpack.Configuration, env: "development" | "production", options: any) => webpack.Configuration[] | webpack.Configuration;

export interface OverridesProps {
  /** 环境变变量 */
  GENERATE_SOURCEMAP?: string,
  INLINE_RUNTIME_CHUNK?: string,
  ESLINT_NO_DEV_ERRORS?: string,
  DISABLE_ESLINT_PLUGIN?: string,
  /** paths 脚本中webpack配置 使用的地址  */
  paths?: Partial<Paths>;

  /** 最终覆写 webpack  配置 **/
  /** 客户端配置  */
  overridesClientWebpack?: (conf: webpack.Configuration, env: "development" | "production", options: any) => webpack.Configuration,
  /** 服务端配置  */
  overridesServerWebpack?: (conf: webpack.Configuration, env: "development" | "production", options: any) => webpack.Configuration;
  // 最终的配置
  overridesWebpack?: WebpackConfigFunction

  /** 服务端打包入口 */
  server_path?: string,
  /** 客户端打包入口 */
  client_path?: string,
  /** 输出文件地址 */
  output_path?: string;
  /**  watch 配置 */
  watchOptions?: webpack.Configuration["watchOptions"];
  proxySetup?: (app: Application) => {
    path: string | string[],
    options?: MockerOption
  }
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
  // 自定义 client 配置设置
  overridesClientWebpack: undefined,
  // 自定义 server 配置设置
  overridesServerWebpack: undefined,
  // 最终自定义配置设置
  overridesWebpack: undefined,
  // 监听配置
  watchOptions: {},
  // 代理配置 
  proxySetup: undefined
};

export async function loaderConf(): Promise<OverridesProps> {
  let kktssrrc: OverridesProps = {};
  try {
    if (fs.existsSync(confPath) && /.ts$/.test(confPath)) {
      require('ts-node').register(tsOptions);
      const config = await import(confPath);
      kktssrrc = config.default || kktssrrc
    } else if (fs.existsSync(confPath) && /.js$/.test(confPath)) {
      require('@babel/register')({
        presets: [[require.resolve('babel-preset-react-app'), { runtime: 'classic', useESModules: false }]],
      });
      const config = await import(confPath);
      kktssrrc = config.default || kktssrrc
    }
    overrides = {
      ...overrides,
      ...kktssrrc,
    }

    // 重写环境变量
    restENV(overrides)

    // 重写 paths 值
    const path = paths(overrides)
    if (!fs.existsSync(path.appIndexJs)) {
      path.appIndexJs = overrides.client_path
    }
    overrides.paths = path
    // 覆盖配置 里面的地址
    overridePaths(undefined, {
      ...(path as unknown as Record<string, string>)
    });
    return overrides;
  } catch (error) {
    const message = error && error.message ? error.message : '';
    console.log('Invalid \x1b[31;1m .kktssrrc.js \x1b[0m file.\n', error);
    new Error(`Invalid .kktssrrc.js file. \n ${message}`);
    process.exit(1);
  }
}
