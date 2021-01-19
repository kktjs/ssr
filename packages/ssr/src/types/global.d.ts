declare module 'react-dev-utils/WebpackDevServerUtils' {
  import WebpackDevServer from 'webpack-dev-server';
  import webpack from 'webpack';
  export interface Urls {
    lanUrlForConfig?: string;
    lanUrlForTerminal?: string;
    localUrlForTerminal: string;
    localUrlForBrowser: string;
  }
  export function prepareProxy(
    proxySetting: string | undefined,
    appPublicFolder: string,
    servedPathname: string,
  ): WebpackDevServer.ProxyConfigArray;
  export function prepareProxy(): void;
  export function prepareUrls(protocol: string, host: string, port: number, publicUrlOrPath: string): Urls;

  export interface CreateCompilerOptions {
    /**
     * The name that will be printed to the terminal.
     */
    appName: string;
    /**
     * The webpack configuration options to be provided to the webpack constructor.
     */
    config: webpack.Configuration;
    /**
     * To provide the `urls` argument, use `prepareUrls()` described below.
     */
    urls: Urls;
    /**
     * If `true`; yarn instructions will be emitted in the terminal instead of npm.
     */
    useYarn?: boolean;
    /**
     * Takes the `require('webpack')` entry point.
     */
    webpack: typeof webpack;
  }
  export interface CreateCompilerOptionsTypescript extends CreateCompilerOptions {
    /**
     * Required if useTypeScript is `true`.
     * This is useful when running fork-ts-checker-webpack-plugin with `async: true` to
     * report errors that are emitted after the webpack build is complete.
     */
    devSocket: {
      /**
       * Called when there are build errors.
       */
      errors: (errors: string[]) => void;
      /**
       * Called when there are build warnings.
       */
      warnings: (warnings: string[]) => void;
    };
    /**
     * If `true`, TypeScript type checking will be enabled.
     * Be sure to provide the `devSocket` argument above if this is set to `true`.
     */
    useTypeScript: boolean;
    tscCompileOnError: boolean;
  }
  /**
   * Creates a Webpack compiler instance for WebpackDevServer with built-in
   * helpful messages.
   */
  // export function createCompiler(opts: CreateCompilerOptions): webpack.Compiler;
  // if the signatures are merged, TS will not enforce that both useTypeScript and devSocket are provided
  // tslint:disable-next-line:unified-signatures
  export function createCompiler(opts: CreateCompilerOptionsTypescript): webpack.Compiler;
}
