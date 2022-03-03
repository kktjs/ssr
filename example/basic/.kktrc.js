import SSRWebpackPlugin from "@kkt/plugin-ssr"
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
  // config.plugins.push(new SSRWebpackPlugin())
  const plugins = [new SSRWebpackPlugin({
    "entry": path.join(process.cwd(), "src/serverIndex"),
    "target": "node",
    "output": {
      "path": path.join(process.cwd(), 'build'),
      "filename": 'server.js',
      "library": {
        "type": "commonjs2",
      },
    },
  })]
  config.plugins.forEach((plugin) => {
    if (!(plugin && plugin.constructor && ["HtmlWebpackPlugin"].includes(plugin.constructor.name))) {
      plugins.push(plugin)
    }
  })
  config.plugins = plugins
  return config
}