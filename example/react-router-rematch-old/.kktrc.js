
import { restWebpackManifestPlugin } from '@kkt/ssr/lib/plugins';
export default (conf, evn, options) => {
  if (!options.bundle) {
    conf = restWebpackManifestPlugin(conf);
  }
  return conf;
};
