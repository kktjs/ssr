import webpack from "webpack"
import FS from 'fs-extra';
import clearConsole from 'react-dev-utils/clearConsole';
const today = () => new Date().toISOString().split('.')[0].replace('T', ' ');

export default (childCompiler: webpack.Compiler, compilation: webpack.Compilation, output: webpack.Configuration["output"]) => {
  // 开发模式 下 使用 监听
  childCompiler.watch({ ...compilation.options.watchOptions }, (err, stats) => {
    if (err) {
      console.log('❌ WEBPACK-SSR:\x1b[31;1mERR\x1b[0m:', err);
      return;
    }
    if (stats.hasErrors()) {
      // clearConsole();
      console.log(`❌ WEBPACK-SSR:\x1b[31;1mERR\x1b[0m: \x1b[35;1m${today()}\x1b[0m\n`, stats.toString());
      return;
    }
    // clearConsole();
    console.log(`🚀 started! \x1b[35;1m${today()}\x1b[0m`);
    if (err) {
      return;
    }
  });
}