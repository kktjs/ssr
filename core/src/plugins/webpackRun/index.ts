process.env.GENERATE_SOURCEMAP = 'false';
process.env.FAST_REFRESH = 'false';
// 直接做一个 webpack run ， 占时可以打包代码了，自己做一个代码打包后提示就哦了
import webpack from 'webpack';
import getchildCompiler from "./childCompiler"
import processAssets from "./processAssets"
import devServer from "./dev"

class SSRWebpackRunPlugin {
  options: webpack.Configuration = {};

  constructor(options: webpack.Configuration) {
    if (options) {
      this.options = this.options;
    }
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.thisCompilation.tap('SSRWebpackRunPlugin', (compilation) => {

      // 创建 webpack 程序
      const { childCompiler, isEnvDevelopment, output } = getchildCompiler(compilation, this.options)

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

export default SSRWebpackRunPlugin;
