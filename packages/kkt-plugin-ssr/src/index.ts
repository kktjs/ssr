process.env.GENERATE_SOURCEMAP = 'false';
process.env.FAST_REFRESH = 'false';
import webpack from "webpack"
import getchildCompiler from "./childCompiler"
import processAssets from "./processAssets"
import devServer from "./dev"
import path from "path"
export * from "./utils/plugins"
export * from "./utils/module"

export interface WebpackPluginSSRProps extends webpack.Configuration {
  overridesWebpack?: (conf: webpack.Configuration) => webpack.Configuration
}
export const reactDevUtils = path.join(require.resolve('react-dev-utils/package.json'), '..');

class WebpackPluginSSR {

  options: WebpackPluginSSRProps = {};

  constructor(options?: WebpackPluginSSRProps) {

    if (options) {
      this.options = this.options;
    }

    delete require.cache[require.resolve(`${reactDevUtils}/openBrowser`)];
    const openBrowserPath = `${reactDevUtils}/openBrowser`;
    require(openBrowserPath);
    require.cache[require.resolve(openBrowserPath)].exports = () => { };

  }

  apply(compiler: webpack.Compiler) {

    compiler.hooks.thisCompilation.tap('WebpackPluginSSR', (compilation) => {
      // 创建 webpack 程序
      const { childCompiler, isEnvDevelopment, output } = getchildCompiler(compilation, this.options, compiler)
      // 开发模式 下 使用 监听
      if (isEnvDevelopment) {
        devServer(childCompiler, compilation, output)
      }
      // 生产模式下 进行 文件生成提交
      if (!isEnvDevelopment) {
        processAssets(childCompiler, compilation)
      }
    });
  }

}

export default WebpackPluginSSR;