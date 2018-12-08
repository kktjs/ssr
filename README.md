kkt-ssr
---

[![](https://img.shields.io/github/release/jaywcjlove/kkt-ssr.svg)](https://github.com/jaywcjlove/kkt-ssr/releases)

Create [React](https://github.com/facebook/react) server-side rendering universal JavaScript applications with no configuration.

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
npx create-kkt-app my-app -e reach-router-loadable
```

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

Runs the compiled app in production.

```bash
npm run server
```

### Plugins

you can add your plugins to modify your `.kktrc.js` setup.

```js
module.exports = {
  plugins: [
    require.resolve('@kkt/plugin-stylus'),
  ],
};
```

- [@kkt/plugin-less](packages/kkt-plugin-less)
- [@kkt/plugin-stylus](packages/kkt-plugin-stylus)
- [@kkt/plugin-scss](packages/kkt-plugin-scss)

## Example

> A complete [`react + react-router + rematch(redux)`](example/react-router+rematch) example is recommended for production projects.

- [**`basic`**](example/basic) - Server-side rendering of the [react](https://github.com/facebook/react) base application.
- [**`dynamic-loadable`**](example/dynamic-loadable) - A [react-loadable](https://github.com/jamiebuilds/react-loadable) for server side rendering for your [react](https://github.com/facebook/react) application.
- [**`less`**](example/less) - React uses the server side rendering of the [Less](https://github.com/less/less.js) based application.
- [**`mock-api`**](example/mock-api) - Server-side rendering [mock api](https://github.com/jaywcjlove/webpack-api-mocker) of the React base application.
- [**`reach-router + loadable-components`**](example/reach-router-loadable) - A [reach-router](https://github.com/reach/router) loadable for server side rendering for your react application.
- [**`react-router`**](example/react-router) - React uses server-side rendering of the [react-router](https://github.com/ReactTraining/react-router).
- [**`react-router + loadable-components`**](example/react-router-loadable) - A react-router [loadable-components](https://github.com/smooth-code/loadable-components) for server side rendering.
- [**`react-router + rematch + loadable-component`**](example/react-router-rematch-loadable-component) - A react-router [loadable-components](https://github.com/smooth-code/loadable-components) for server side rendering.
- [**`react-router+rematch`**](example/react-router+rematch) - This is a sophisticated example of server-side rendering.
- [**`scss`**](example/scss) - React uses the server side rendering of the [sass](https://github.com/sass/node-sass) based application.
- [**`styled-components`**](example/styled-components) - Server-side rendering of the react [styled-components](https://github.com/styled-components/styled-components) base application.
- [**`stylus`**](example/stylus) - React uses the server side rendering of the [stylus](https://github.com/stylus/stylus/) based application.
- [**`unstated`**](example/unstated) - React uses the server side rendering of the [unstated](https://github.com/jamiebuilds/unstated) based application.

## License

[MIT © Kenny Wong](./LICENSE)
