import webpack from "webpack"
import { Application } from 'express';

import { MockerOption } from "mocker-api"

export type Paths = {
  dotenv: string;
  appPath: string;
  appBuild: string;
  appPublic: string;
  appHtml: string;
  appIndexJs: string;
  appPackageJson: string;
  /** App Root Path */
  appSrc: string;
  appTsConfig: string;
  appJsConfig: string;
  yarnLockFile: string;
  testsSetup: string;
  proxySetup: string;
  appNodeModules: string;
  swSrc: string;
  publicUrlOrPath: string;
  // These properties only exist before ejecting:
  ownPath: string;
  ownNodeModules: string;
  appTypeDeclarations: string;
  ownTypeDeclarations: string;
  moduleFileExtensions?: string[]
};

export type Options = Omit<OverridesProps, "overridesClientWebpack" | "overridesServerWebpack" | "overridesCommonWebpack" | "overridesWebpack"> & OptionsProps

export type WebpackConfigFunction = (conf: webpack.Configuration[], env: "development" | "production", options: Options) => webpack.Configuration[] | webpack.Configuration;

export interface OverridesProps {
  env?: Record<string, string>,
  /** 是否使用原始 react-script 下的配置 **/
  isUseOriginalConfig?: boolean;
  /** 是否使用 server 配置 **/
  isUseServerConfig?: boolean;
  /** paths 脚本中webpack配置 使用的地址  */
  paths?: Partial<Paths>;

  /** 最终覆写 webpack  配置 **/
  /** 客户端配置  */
  overridesClientWebpack?: (conf: webpack.Configuration, env: "development" | "production", options: Options) => webpack.Configuration,
  /** 服务端配置  */
  overridesServerWebpack?: (conf: webpack.Configuration, env: "development" | "production", options: Options) => webpack.Configuration;
  /** 公共覆盖配置 */
  overridesCommonWebpack?: (conf: webpack.Configuration, env: "development" | "production", options: Options) => webpack.Configuration;
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
  /** 代理 */
  proxySetup?: (app: Application) => {
    path: string | string[],
    options?: MockerOption
  }
}

export interface OptionsProps {
  /** client 使用  NodeExternals  **/
  clientNodeExternals: boolean;
  /** server 使用  NodeExternals  **/
  serverNodeExternals: boolean;
  /** server 进行代码拆分  **/
  serverIsChunk: boolean;
  /** client 进行代码拆分  **/
  clientIsChunk: boolean;
  /** 是否使用原始 react-script 下的配置  **/
  original: boolean,
  /** 是否压缩代码  mini > miniServer/miniClient  **/
  mini: boolean
  /** server 是否压缩代码 **/
  miniServer: boolean
  /** client 是否压缩代码 **/
  miniClient: boolean
}