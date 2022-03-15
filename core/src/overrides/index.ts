// 获取 根目录下 自己定义的配置

import fs from 'fs';
import { resolveModule, resolveApp } from "./pathUtils"
import webpack from "webpack"
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

if (fs.existsSync(confPath)) {
  const config = require(confPath);
  const configDefault = require(confPath).default;
  if (configDefault) {
    overrides = {
      ...overrides,
      ...configDefault,
    };
  } else if (config) {
    overrides = {
      ...overrides,
      ...config,
    };
  }
}

export default overrides
