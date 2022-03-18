import pluginLess from "@kkt/plugin-less"
export default {
  overridesWebpack: (confArr, env, options) => {
    const arr = []
    confArr.forEach((conf,) => {
      const newConfig = pluginLess(conf, {
        target: conf.target,
        env,
        paths: options.paths
      })
      arr.push({
        ...newConfig,
        module: {
          ...newConfig.module,
        },
        resolve: {
          ...newConfig.resolve,
          fallback: newConfig.target !== "node" && {
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
          } || {},
        }
      })
    })
    return arr
  }
}