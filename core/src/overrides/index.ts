// 获取 根目录下 自己定义的配置
import fs from 'fs';
import { resolveModule, resolveApp, } from "./pathUtils"
import { restENV } from "./env"
import { OverridesProps } from "./../interface"
import paths from "./path"


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

let overrides: OverridesProps = {
  env: {},
  // 服务端打包入口
  server_path: resolveModule(resolveApp, 'src/server'),
  // 客户端打包入口
  client_path: resolveModule(resolveApp, 'src/client'),
  /** 输出文件地址 */
  output_path: resolveApp("dist"),
  /** 是否使用原始 react-script 下的配置, 📢注意：这个不控制 server 配置， **/
  isUseOriginalConfig: false,
  /** 是否使用 server 配置 **/
  isUseServerConfig: true,
  // paths 地址
  paths: {},
  // 自定义 client 配置设置
  overridesClientWebpack: undefined,
  // 自定义 server 配置设置
  overridesServerWebpack: undefined,
  /** 公共覆盖配置 */
  overridesCommonWebpack: undefined,
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
    overrides.paths = path
    return overrides;
  } catch (error) {
    const message = error && error.message ? error.message : '';
    console.log('Invalid \x1b[31;1m .kktssrrc.js \x1b[0m file.\n', error);
    new Error(`Invalid .kktssrrc.js file. \n ${message}`);
    process.exit(1);
  }
}
