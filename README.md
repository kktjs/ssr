<p align="center">
  <a href="https://github.com/jaywcjlove/kkt-ssr">
    <img src="./assets/kkt.ssr.svg?sanitize=true">
  </a>
</p>

<p align="center">
  <a href="https://github.com/jaywcjlove/kkt-ssr/issues">
    <img src="https://img.shields.io/github/issues/jaywcjlove/kkt-ssr.svg">
  </a>
  <a href="https://github.com/jaywcjlove/kkt-ssr/network">
    <img src="https://img.shields.io/github/forks/jaywcjlove/kkt-ssr.svg">
  </a>
  <a href="https://github.com/jaywcjlove/kkt-ssr/stargazers">
    <img src="https://img.shields.io/github/stars/jaywcjlove/kkt-ssr.svg">
  </a>
  <a href="https://github.com/jaywcjlove/kkt-ssr/releases">
    <img src="https://img.shields.io/github/release/jaywcjlove/kkt-ssr.svg">
  </a>
  <a href="https://www.npmjs.com/package/@kkt/ssr">
    <img src="https://img.shields.io/npm/v/@kkt/ssr.svg">
  </a>
</p>

Create [React](https://github.com/facebook/react) server-side rendering universal JavaScript applications with no configuration.

<p align="center">
  <a href="https://github.com/jaywcjlove/kkt-ssr/tree/master/example/react-router%2Brematch">
    <img src="./assets/ssr.png?sanitize=true">
  </a>
</p>

## Usage

You will need [`Node.js`](https://nodejs.org) installed on your system.

## Quick Start

```bash
npx create-kkt-app my-app
cd my-app
npm start
```

You can also initialize a project from one of the examples. Example from [jaywcjlove/kkt-ssr](./example) example-path. 

```bash
# Using the template method
# `npx create-kkt-app my-app [-e example name]`
npx create-kkt-app my-app -e react-router+rematch
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

### Using Plugins

You can use KKT plugins by installing in your project and adding them to your `.kktrc.js`. See the README.md of the specific plugin, Just like the following:

```bash
npm install kkt-plugin-xxxx
```

```js
module.exports = {
  plugins: [
    require.resolve('kkt-plugin-xxxx'),
  ],
};
```

[See All Plugins](https://www.npmjs.com/search?q=kkt-plugin)

### Writing Plugins

Plugins are simply functions that modify and return KKT's webpack config.

```js
module.exports = (conf, { target, dev, env, ...other }, webpack) => {
  // client only
  if (target === 'web') {}
  // server only
  if (target === 'node') {}

  if (dev) {
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
module.exports = {
  plugins: [
    require.resolve('@kkt/plugin-less'),
  ],
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
module.exports = {
  // Using plugins
  plugins: [],
  // Modify the babel config
  babel: (conf, option) => {
    return conf;
  },
  // Modify the webpack config
  config: (conf, { target, dev, env, ...otherOptions }, webpack) => {
    return conf;
  }
};
```

## Example

> A complete [`react + react-router + rematch(redux)`](example/react-router+rematch) example is recommended for production projects, similar to [next.js](https://github.com/zeit/next.js).

- [**`basic`**](example/basic) - Server-side rendering of the [react](https://github.com/facebook/react) base application.
- [**`dynamic-loadable`**](example/dynamic-loadable) - A [react-loadable](https://github.com/jamiebuilds/react-loadable) for server side rendering for your [react](https://github.com/facebook/react) application.
- [**`less`**](example/less) - React uses the server side rendering of the [Less](https://github.com/less/less.js) based application.
- [**`mock-api`**](example/mock-api) - Server-side rendering [mock api](https://github.com/jaywcjlove/webpack-api-mocker) of the React base application.
- [**`reach-router + loadable-components`**](example/reach-router-loadable) - A [reach-router](https://github.com/reach/router) loadable for server side rendering for your react application.
- [**`react-router`**](example/react-router) - React uses server-side rendering of the [react-router](https://github.com/ReactTraining/react-router).
- [**`react-router + loadable-components`**](example/react-router-loadable) - A react-router [loadable-components](https://github.com/smooth-code/loadable-components) for server side rendering.
- [**`react-router + rematch + loadable-component`**](example/react-router-rematch-loadable-component) - A react-router [loadable-components](https://github.com/smooth-code/loadable-components) for server side rendering.
- [**`react-router+rematch`**](example/react-router+rematch) - This is a sophisticated example, similar to [next.js](https://github.com/zeit/next.js).
- [**`scss`**](example/scss) - React uses the server side rendering of the [sass](https://github.com/sass/node-sass) based application.
- [**`styled-components`**](example/styled-components) - Server-side rendering of the react [styled-components](https://github.com/styled-components/styled-components) base application.
- [**`stylus`**](example/stylus) - React uses the server side rendering of the [stylus](https://github.com/stylus/stylus/) based application.
- [**`unstated`**](example/unstated) - React uses the server side rendering of the [unstated](https://github.com/jamiebuilds/unstated) based application.

## License

[MIT © Kenny Wong](./LICENSE)
