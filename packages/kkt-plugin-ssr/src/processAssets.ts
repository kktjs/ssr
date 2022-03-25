
import webpack from "webpack"

export default (childCompiler: webpack.Compiler, compilation: webpack.Compilation) => {
  // 生产模式下 把文件提交到父级 ，这样就有打印文件提示了
  // 把文件提交到父级 生产下对文件进行提交到父级，不提交也可以 自己写 log 提示
  childCompiler.hooks.thisCompilation.tap('WebpackPluginSSR', (childCompilation) => {
    childCompilation.hooks.processAssets.tap('WebpackPluginSSR', (compilationAssets) => {
      Object.entries(compilationAssets || {}).forEach(([name, so]) => {
        compilation.emitAsset(name, so);
      });
    });
  });

  compilation.hooks.processAssets.tapAsync(
    {
      name: 'WebpackPluginSSR',
    },
    (_assets, callback) => {
      childCompiler.run((error) => {
        if (error) {
          callback(error);
          return;
        }
        callback(null);
      });
    },
  );
}