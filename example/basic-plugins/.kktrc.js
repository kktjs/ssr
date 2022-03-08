import { SSRWebpackRunPlugin, getRemoveHtmlTemp } from '@kkt/ssr/lib/plugins';
process.env.FAST_REFRESH = 'false';
export default (conf, evn) => {
  conf.plugins.push(new SSRWebpackRunPlugin());
  conf.plugins = getRemoveHtmlTemp(conf.plugins)
  conf.module.exprContextCritical = false;
  return conf;
};
