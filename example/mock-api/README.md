mock-api
---

Server-side rendering of the React base application, Mock the API in development mode.

[`React`](https://github.com/facebook/react) + [`Express`](https://expressjs.com/) + [`webpack-api-mocker`](https://github.com/jaywcjlove/webpack-api-mocker) + [`http-proxy-middleware`](https://www.npmjs.com/package/http-proxy-middleware)

- [`webpack-api-mocker`](https://github.com/jaywcjlove/webpack-api-mocker) is a webpack-dev-server middleware that creates mocks for REST APIs. It will be helpful when you try to test your application without the actual REST API server.
- [`http-proxy-middleware`](https://www.npmjs.com/package/http-proxy-middleware) Configure proxy middleware with ease for connect, express, browser-sync and many more.

### development

Runs the project in development mode.  

```bash
npm run start
```

### production

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

### description

⚠️ Server rendering proxy file: [`src/server.js`](src/server.js).  

```js
import React from 'react';
import express from 'express';
import proxy from 'http-proxy-middleware';

const server = express();
server
  .disable('x-powered-by')
  .use('/api', proxy({ target: 'http://127.0.0.1:3724', changeOrigin: true }))
  .use('/repos/*', proxy({ target: 'https://api.github.com/', changeOrigin: true }))
  .get('/*', (req, res) => {
    // ......
  })
```

⚠️ [`webpack-api-mocker`](https://github.com/jaywcjlove/webpack-api-mocker) mock configured in [`mocker/index.js`](mocker/index.js).

```js
const delay = require('webpack-api-mocker/utils/delay');

// Whether to disable the proxy
const noProxy = process.env.NO_PROXY === 'true';
const proxy = {
  // Priority processing.
  _proxy: {
    proxy: {
      '/repos/*': 'https://api.github.com/',
    },
    changeHost: true,
  },
  'GET /api/user/:id': (req, res) => {
    return res.json({
      id: req.params.id,
      username: 'kenny',
      sex: 'male',
    });
  },
};

module.exports = (noProxy ? {} : delay(proxy, 1000));
```
