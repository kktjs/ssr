<p align="center">
  <a href="https://kktjs.github.io/ssr">
    <img src="https://user-images.githubusercontent.com/1680273/157196191-9e56f20a-8991-487a-a78d-35352a2c1222.png">
  </a>
</p>

<p align="center">
  <a href="https://github.com/kktjs/ssr/issues">
    <img src="https://img.shields.io/github/issues/kktjs/ssr.svg">
  </a>
  <a href="https://github.com/kktjs/ssr/network">
    <img src="https://img.shields.io/github/forks/kktjs/ssr.svg">
  </a>
  <a href="https://github.com/kktjs/ssr/stargazers">
    <img src="https://img.shields.io/github/stars/kktjs/ssr.svg">
  </a>
  <a href="https://github.com/kktjs/ssr/releases">
    <img src="https://img.shields.io/github/release/kktjs/ssr.svg">
  </a>
  <a href="https://www.npmjs.com/package/@kkt/ssr">
    <img src="https://img.shields.io/npm/v/@kkt/ssr.svg">
  </a>
</p>

Create [React](https://github.com/facebook/react) server-side rendering universal JavaScript applications with no configuration. If you don't need server-side rendering you can use [kkt](https://github.com/jaywcjlove/kkt) tools.

<p align="center">
  <a href="https://github.com/kktjs/ssr/tree/master/example/react-router%2Brematch">
    <img src="https://github.com/kktjs/ssr/raw/847e32d0f04c30da9f7b3bd637be9fa6b1eee22b/assets/ssr.png?sanitize=true">
  </a>
</p>

[Quick Start](#quick-start) · [Using Plugins](#using-plugins) · [Writing Plugins](#writing-plugins) · [CSS Modules](#css-modules) · [KKT Config](#kkt-config) · [Example](#example)

[![Let's fund issues in this repository](https://issuehunt.io/static/embed/issuehunt-button-v1.svg)](https://issuehunt.io/repos/159655834)

## Usage

You will need [`Node.js`](https://nodejs.org) installed on your system.

## Quick Start

```bash
npx create-kkt-ssr my-app
cd my-app
npm start
```

You can also initialize a project from one of the examples. Example from [kktjs/ssr](./example) example-path. 

```bash
# Using the template method
# `npx create-kkt-ssr my-app [-e example name]`
npx create-kkt-ssr my-app -e react-router+rematch
```

or

```bash
npm install -g create-kkt-ssr
# Create project, Using the template method
create-kkt-ssr my-app -e react-router+rematch
cd my-app # Enter the directory
npm start # Start service
```

> ⚠️ A perfect example [`react-router+rematch`](example/react-router+rematch) is recommended for production environments, This example is similar to [`Next.js`](https://github.com/zeit/next.js).

**development**

Runs the project in development mode.  

```bash
npm run start
```

**production**

Builds the app for production to the build folder.

```bash
npm run build
```

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

```bash
# Runs the compiled app in production.
npm run server
```

To debug the node server, you can use `react-ssr start --inspect-brk`. This will start the node server, enable the inspector agent and Break before user code starts. For more information, see [this](https://nodejs.org/en/docs/inspector/).

### Using Plugins

You can use KKT plugins by installing in your project and adding them to your `.kktrc.js`. See the README.md of the specific plugin, Just like the following:

```bash
npm install kkt-plugin-xxxx
```

```js

export default (conf, evn) => {
  conf.plugins.push(require.resolve('kkt-plugin-xxxx'),)
  return conf;
};

```

**Reset WebpackManifestPlugin**

```js

import { restWebpackManifestPlugin } from '@kkt/ssr/lib/plugins';

export default (conf, evn) => {
  // client ， In order to adapt to the old version
  if (!options.bundle) {
    conf = restWebpackManifestPlugin(conf);
  }
  return conf;
};

```

[See All Plugins](https://www.npmjs.com/search?q=kkt-plugin)

### Writing Plugins

Plugins are simply functions that modify and return KKT's webpack config.

```js
export default  (conf, env, options) => {
  // client only
  if (!options.bundle) {}
  // server only
  if (options.bundle) {}

  if (env==="development") {
    // dev only
  } else {
    // prod only
  }
  // conf: Webpack config
  return conf;
}
```

### CSS Modules

KKT supports [CSS Modules](https://github.com/css-modules/css-modules) using Webpack's [css-loader](https://github.com/webpack-contrib/css-loader). Simply import your CSS file with the extension `.module.css` and will process the file using `css-loader`.

```jsx
import React from 'react';
import styles from './style.module.css';

const Component = () => <div className={styles.className} />;

export default Component;
```

**Use Less**

Install the less plugin.

```bash
npm install @kkt/plugin-less --save-dev
```

Modify the `.kktrc.js` config and add plugins.

```js

export default (conf, evn) => {
  conf.plugins.push(require.resolve('@kkt/plugin-less'),)
  return conf;
};

```

Use [`@kkt/plugin-less`](./packages/kkt-plugin-less) support Less.

```jsx
import React from 'react';
import styles from './style.module.less';

const Component = () => <div className={styles.className} />;

export default Component;
```

## KKT Config

The root directory creates the `.kktrc.js` file.

```js
 // Modify the webpack config
export default (conf, evn, options) => {
  return conf;
};

```

## Example

A complete [`react + react-router + rematch(redux)`](example/react-router+rematch) example is recommended for production projects, similar to [next.js](https://github.com/zeit/next.js). Initialize the project from one of the examples: 

```bash
npx create-kkt-ssr my-app -e react-router+rematch
```

- [**`basic`**](example/basic) - Server-side rendering of the [react](https://github.com/facebook/react) base application.
- [**`react-router`**](example/react-router) - React uses server-side rendering of the [react-router](https://github.com/ReactTraining/react-router).
- [**`react-router+rematch`**](example/react-router-rematch-old) - This is a sophisticated example, similar to [next.js](https://github.com/zeit/next.js).

## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/kktjs/ssr/graphs/contributors">
  <img src="https://kktjs.github.io/ssr/CONTRIBUTORS.svg" />
</a>

Made with [github-action-contributors](https://github.com/jaywcjlove/github-action-contributors).

## License

Licensed under the MIT License
