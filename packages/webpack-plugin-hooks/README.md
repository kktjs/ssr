<p align="center">
  <h1>@kkt/webpack-plugin-hooks</h1>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@kkt/webpack-plugin-hooks">
    <img src="https://img.shields.io/npm/v/@kkt/webpack-plugin-hooks.svg" alt="npm version">
  </a>
</p>

Event hooks webpack plugin.

### Installation

```bash
npm install @kkt/webpack-plugin-hooks
```

### Usage

In `webpack.config.js`:

```js
import WebpackHookPlugin from "webpack-plugin-hooks";

export default {
  ...
  plugins: [
    ...
    new WebpackHookPlugin({
      onAfterEmit: (count, callback) => {};
      onDonePromise: (stats) => {};
    }),
    ...
  ],
  ...
}
```

### License

Licensed under the MIT License