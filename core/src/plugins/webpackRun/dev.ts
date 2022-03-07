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
      clearConsole();
      console.log(`❌ WEBPACK-SSR:\x1b[31;1mERR\x1b[0m: \x1b[35;1m${today()}\x1b[0m\n`, stats.toString());
      return;
    }
    clearConsole();
    console.log(`🚀 started! \x1b[35;1m${today()}\x1b[0m`);
    if (err) {
      return;
    }
  });
  // 开发模式下 生成文件 js 文件，
  compilation.hooks.processAssets.tapAsync(
    {
      name: 'SSRWebpackRunPlugin',
    },
    (_assets, callback) => {
      // 自己生成一个 资产 结构 的数据
      const asset: { entrypoints: string[] } = { entrypoints: [] }
      Object.entries(_assets).forEach(([name, value]) => {
        const pathArr = `${output.path}/${name}`.split("/")
        pathArr.pop()
        if (!FS.existsSync(pathArr.join("/"))) {
          FS.ensureDirSync(pathArr.join("/"));
        }
        if (!name.endsWith('.map')) {
          asset.entrypoints.push(name)
        }
        childCompiler.outputFileSystem.writeFile(`${output.path}/${name}`, value.buffer(), (err) => {
          if (err) {
            console.log(`create asset：${name}`, err)
            callback(err)
          }
        })
      })
      // 资产数据 
      childCompiler.outputFileSystem.writeFile(`${output.path}/asset-manifest.json`, JSON.stringify(asset), (err) => {
        if (err) {
          console.log(`create asset-manifest.json`, err)
          callback(err)
        }
      })
      callback(null)
    },
  );
}