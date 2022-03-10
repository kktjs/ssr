
import { restWebpackManifestPlugin } from '@kkt/ssr/lib/plugins';
import webpack from "webpack"
export default (conf, evn, options) => {
  if (!options.bundle) {
    conf = restWebpackManifestPlugin(conf);
  }
  if (options.bundle) {
    // 暂时使用这种方式 解决 server 没有 window 问题
    conf.plugins.push(new webpack.DefinePlugin({
      window: JSON.stringify(false)
    }))
  }
  return conf;
};
