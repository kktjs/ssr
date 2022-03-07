import path from 'path';
import { SSRWebpackRunPlugin, SSRWebpackPlugin, getRemoveHtmlTemp } from '@kkt/ssr/lib/plugins';
process.env.FAST_REFRESH = 'false';
process.env.GENERATE_SOURCEMAP = 'false';
export default (conf, evn) => {
  conf.plugins.push(new SSRWebpackRunPlugin());
  conf.plugins = getRemoveHtmlTemp(conf.plugins)
  conf.stats = {
    children: true,
    errorDetails: true,
  };
  conf.module.exprContextCritical = false;
  conf.devtool = false;
  return conf;
};
