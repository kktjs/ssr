import pluginLess from "@kkt/plugin-less"
import { Options } from "@kkt/ssr/lib/interface"
import webpack from "webpack"
import { Application } from "express"

export default {
  GENERATE_SOURCEMAP: JSON.stringify(false),
  proxySetup: (app: Application) => ({
    path: "./mocker/index.js",
  }),
  overridesServerWebpack: (conf: webpack.Configuration) => {
    conf.plugins?.push(new webpack.DefinePlugin({
      window: JSON.stringify(undefined)
    }))
    return conf
  },
  overridesClientWebpack: (conf: webpack.Configuration, env: "production" | "development", options: Options): webpack.Configuration => {
    return {
      ...conf,
      resolve: {
        ...conf.resolve,
        fallback: {
          "util": require.resolve("util/"),
          "crypto": require.resolve("crypto-browserify"),
          "stream": require.resolve("stream-browserify"),
          "http": require.resolve("stream-http"),
          "https": require.resolve("https-browserify"),
          "url": require.resolve("url/"),
          "zlib": require.resolve("browserify-zlib"),
          "tty": require.resolve("tty-browserify"),
          "assert": require.resolve("assert/"),
          "path": require.resolve("path-browserify"),
          "os": require.resolve("os-browserify/browser"),
          "buffer": require.resolve("buffer/")
        },
      }
    }
  },
  overridesCommonWebpack: (conf: webpack.Configuration, env: "production" | "development", options: Options): webpack.Configuration => {
    const newConfig = pluginLess(conf, {
      target: conf.target === "node14" ? "node" : "web",
      env,
      paths: options.paths
    })
    return newConfig
  },

}