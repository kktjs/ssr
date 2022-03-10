
import { restWebpackManifestPlugin } from '@kkt/ssr/lib/plugins';
import webpack from "webpack"
export default (conf, evn, options) => {
  if (!options.bundle) {
    conf = restWebpackManifestPlugin(conf);
    // conf.resolve.fallback = {
    //   "http": false,
    //   "tty": false,
    //   "https": false,
    //   "zlib": false,
    //   "tty": false,
    //   "util": false,
    //   "stream": false,
    //   "assert": false,
    //   "crypto": false,
    //   "stream": false,
    //   "os": false
    // }
  }
  if (options.bundle) {
    // 暂时使用这种方式 解决 server 没有 window 问题
    conf.plugins.push(new webpack.DefinePlugin({
      window: JSON.stringify(false)
    }))
  }
  return conf;
};
