<p align="center">
  <h1>@kkt/ssr</h1>
</p>

<p align="center">
  <a href="https://github.com/kktjs/kkt-ssr/actions">
    <img alt="Build SSR & Example" src="https://img.shields.io/github/issues/kktjs/kkt-ssr.svg">
  </a>
  <a href="https://github.com/kktjs/kkt-ssr/issues">
    <img alt="Issue" src="https://img.shields.io/github/issues/kktjs/kkt-ssr.svg">
  </a>
  <a href="https://github.com/kktjs/kkt-ssr/network">
    <img alt="Forks" src="https://img.shields.io/github/forks/kktjs/kkt-ssr.svg">
  </a>
  <a href="https://github.com/kktjs/kkt-ssr/stargazers">
    <img alt="Stars" src="https://img.shields.io/github/stars/kktjs/kkt-ssr.svg">
  </a>
  <a href="https://uiwjs.github.io/npm-unpkg/#/pkg/@kkt/ssr/file/README.md">
    <img src="https://img.shields.io/badge/Open%20in-unpkg-blue" alt="Open in unpkg">
  </a>
  <a href="https://www.npmjs.com/package/@kkt/ssr">
    <img alt="npm version" src="https://img.shields.io/npm/v/@kkt/ssr.svg">
  </a>
</p>

Create [React](https://github.com/facebook/react) server-side rendering universal JavaScript applications with no configuration. If you don't need server-side rendering you can use [kkt](https://github.com/jaywcjlove/kkt) tools.

### Installation

```bash
yarn add --dev @kkt/ssr
# or use npm if you don't have yarn yet
npm install --save-dev @kkt/ssr
```

### Usage

In the `.kktrc.js` or `.kktrc.ts` you created for `kkt` add this code:

```js
import path from 'path';
import ssr from '@kkt/ssr';

export default (conf, evn, options) => {
  return ssr(conf, evn, options);
}
```

In `package.json`, add a separate npm script to build library

```js
{
  "scripts": {
    ...
    "build": "kkt build",
    "start": "kkt start",
    ...
  }
}
```

### License

Licensed under the MIT License