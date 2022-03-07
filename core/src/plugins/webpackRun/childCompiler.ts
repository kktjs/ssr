import webpack from 'webpack';
import path from 'path';
import nodeExternals from 'webpack-node-externals';
import { getModuleCSSRules } from '../utils/module';
import { getWebpackRunPlugins, getCSSPlugins } from '../utils/plugins';

export const getCreateChildCompiler = (compilation: webpack.Compilation, options: any) => {

  const NODE_ENV = process.env.NODE_ENV as webpack.Configuration['mode'];
  const isEnvDevelopment = NODE_ENV === 'development';

  const output = {
    // path: path.resolve(process.cwd(), './dist'),
    path: compilation.options.output.path,
    filename: 'server.js',
    libraryTarget: 'commonjs2',
    library: {
      type: 'commonjs2',
    },
    ...(options.output || {}),
  };

  const fileName = path.basename(output.filename as string).replace(/.(js|jsx?|cjs|mjs|tsx?)$/, '');

  // 起一个服务, 处理 server 服务文件
  const childCompiler = webpack({
    mode: NODE_ENV,
    target: 'node',
    devtool: false,
    bail: NODE_ENV === 'production',
    entry: path.resolve(process.cwd(), './src/server.js'),
    externals: [nodeExternals()],
    infrastructureLogging: {
      level: 'none',
    },
    ...options,
    output,
    context: process.cwd(),
    module: {
      strictExportPresence: true,
      rules: getModuleCSSRules(compilation.options.module.rules, isEnvDevelopment),
    },
    // 从父级继承 需要做处理
    optimization: {},
    resolve: {
      modules: ['node_modules'],
      ...compilation.options.resolve,
      alias: {
        ...compilation.options.resolve.alias,
        ...(options.resolve?.alias || {}),
      },
      // 这个造成的 打包后运行报错
      byDependency: {},
      // plugins: []
    },
    // 继承父级的 plugins 进行处理，过滤不用的 plugins
    plugins: getCSSPlugins(getWebpackRunPlugins(compilation.options.plugins), isEnvDevelopment, fileName),
    // Turn off performance processing because we utilize
    // our own hints via the FileSizeReporter
    performance: false,
  });

  return {
    childCompiler,
    fileName,
    isEnvDevelopment,
    output
  }
}
export default getCreateChildCompiler