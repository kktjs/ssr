
import WebpackPluginSSRProps, { clearHtmlTemp, createNewWebpackManifestPlugin } from '@kkt/plugin-ssr';
import { WebpackConfiguration } from "kkt"
export default (conf: WebpackConfiguration, env: "development" | "production") => {
  const paths = require("react-scripts/config/paths")
  conf.plugins?.push(new WebpackPluginSSRProps());
  conf.plugins?.push(createNewWebpackManifestPlugin(paths, "client", env === "development"));
  conf = clearHtmlTemp(conf)
  if (conf.module) {
    conf.module.exprContextCritical = false;
  }
  return conf;
};
