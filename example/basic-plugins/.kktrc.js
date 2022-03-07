import path from 'path';
import { SSRWebpackRunPlugin, SSRWebpackPlugin } from '@kkt/ssr/lib/plugins';
process.env.FAST_REFRESH = 'false';
process.env.GENERATE_SOURCEMAP = 'false';
export default (conf) => {
  conf.plugins.push(new SSRWebpackRunPlugin());
  conf.stats = {
    children: true,
    errorDetails: true
  }
  conf.module.exprContextCritical = false;
  conf.devtool = false
  return conf;
};
