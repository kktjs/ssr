<p align="center">
  <h1>@kkt/start-server-webpack-plugin</h1>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@kkt/start-server-webpack-plugin">
    <img src="https://img.shields.io/npm/v/@kkt/start-server-webpack-plugin.svg" alt="npm version">
  </a>
</p>

Automatically start your server once Webpack's build completes + handle hot reloading (HMR).

### Installation

```bash
npm install @kkt/start-server-webpack-plugin
```

### Usage

In `webpack.config.server.babel.js`:

```js
import StartServerPlugin from "start-server-webpack-plugin";

export default {
  ...
  plugins: [
    ...
    // Only use this in DEVELOPMENT
    new StartServerPlugin({
      // print server logs
      verbose: true,
      // print plugin/server errors
      debug: false,
      // name of the entry to run, defaults to 'main'
      entryName: 'server',
      // any arguments to nodejs when running the entry, this one allows debugging
      nodeArgs: ['--inspect-brk'],
      // any arguments to pass to the script
      scriptArgs: ['scriptArgument1', 'scriptArgument2'],
      // Allow typing 'rs' to restart the server. default: only if NODE_ENV is 'development'
      restartable: true | false,
      // Only run the server once (default: false)
      once: false | true,
    }),
    ...
  ],
  ...
}
```

### License

Licensed under the MIT License