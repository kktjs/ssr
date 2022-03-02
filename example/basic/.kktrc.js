import KKTPluginSSR from "@kkt/plugin-ssr"
import path from "path"

export default (config) => {
  config.entry = {
    main: path.join(process.cwd(), "src/index.js")
  }
  config.output = {
    ...(config.output || {}),
    path: path.join(process.cwd(), 'build'),
    filename: "[name].js",
  }
  config.plugins.push(new KKTPluginSSR())
  return config
}