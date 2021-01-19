<p align="center">
  <h1>@kkt/ssr</h1>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@kkt/ssr">
    <img src="https://img.shields.io/npm/v/@kkt/ssr.svg" alt="npm version">
  </a>
</p>

Makes it easy to use the webpack raw-loader

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