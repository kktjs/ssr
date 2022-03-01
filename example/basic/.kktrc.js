import KKTPluginSSR from "@kkt/plugin-ssr"
import path from "path"

export default (config) => {
  config.output = {
    ...(config.output || {}),
    path: path.resolve(process.cwd(), 'build'),
    filename: "main.js",
    publicPath: "/public/"
  }
  config.plugins.push(new KKTPluginSSR({
    entry: path.join(process.cwd(), "src/serverIndex.js")
  }))
  return config
}