@kkt/react-ssr-enhanced
---

This is an enhancement to [@kkt/ssr](https://github.com/kktjs/ssr), used with [react-router 4](https://github.com/ReactTraining/react-router). 
`React Router 4` supports all routes to `@kkt/react-ssr-enhanced`. You can use any and all parts of `React Router 4`.

[`React`](https://github.com/facebook/react) + [`React Router`](https://github.com/ReactTraining/react-router) + [`Rematch`](https://github.com/rematch/rematch) + [`Express`](https://expressjs.com/)


## Quick Start

> ⚠️ A perfect example [`react-router-rematch`](https://github.com/kktjs/ssr/tree/master/example/react-router-rematch-old) is recommended for production environments.

```bash
npx create-kkt-app my-app -e react-router-rematch
cd my-app
npm start
```

### `getInitialProps: (ctx) => Data`

Within `getInitialProps`, you have access to all you need to fetch data on both the client and the server:

```js

const Home =(props)=> {

  return (
      <div>
        <h1>Home</h1>
        {props.whatever ? this.props.whatever : 'Loading...'}
      </div>
    );
}

Home.getInitialProps= async ({ req, res, match, store, history, location, ...ctx }) =>{
  store.dispatch.global.verify();
  return { whatever: 'Home stuff' };
}

```

### `Client`

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ensureReady, RoutersController } from '@kkt/react-ssr-enhanced';
import history from './utils/history';
import { getRouterData } from './routes';
import { createStore } from './store';

const routes = getRouterData();
(async () => {
  const store = await createStore(window._KKT_STORE);
  // Initialize store
  ensureReady(routes).then(async (data) => {
    window._history = history;
    ReactDOM.hydrate(
      <Provider store={store}>
        <BrowserRouter  >
          <RoutersController store={store} routes={routes} data={data} history={history} />
        </BrowserRouter>
      </Provider>,
      document.getElementById('root')
    );
  });
})();
```

### `Server`

```js
// serverIndex.js
import express from 'express';
import cookieParser from 'cookie-parser';
import proxy from 'http-proxy-middleware';
import { render } from '@kkt/react-ssr-enhanced';
import { getRouterData } from './routes';
import Path from 'path';
import FS from 'fs';
import { createStore } from './store';

const assetsMainifest = new Function(`return ${FS.readFileSync(`${OUTPUT_PUBLIC_PATH}/asset-client-manifest.json`, "utf-8")}`)()
const appDirectory = FS.realpathSync(process.cwd());
const resolveApp = (relativePath) => Path.resolve(appDirectory, relativePath);
const isDev = process.env.NODE_ENV === "development"
const target = `http://${process.env.HOST || "localhost"}:${process.env.PORT || 3000}`
const routes = getRouterData();
const server = express();
server.disable('x-powered-by');
// API request to pass cookies
// `getInitialProps` gets the required value via `req.cookies.token`
server.use(cookieParser());
server.use(express.static(isDev ? target : resolveApp('dist')));
server.use('/api', proxy({
  target,
  changeOrigin: true,
}));
server.get('/*', async (req, res) => {
  try {
    const store = await createStore();
    const html = await render({
      req,
      res,
      routes,
      assets: assetsMainifest,
      store, // This Redux
    });
    res.send(html);
  } catch (error) {
    // eslint-disable-next-line
    console.log('html---server--error>>>>:', error);
    res.json(error);
  }
});

export default server;

```

```js
// server.js
import http from 'http';
import app from './serverIndex';

const logs = console.log; // eslint-disable-line
const server = http.createServer(app);
let currentApp = app;

const PORT = parseInt(process.env.PORT || 3000) + 1;

server.listen(PORT, (error) => {
  if (error) {
    logs(error);
  }
  console.log(process.env.GENERATE_SOURCEMAP)
  logs('🚀 started!', `PORT: http://localhost:${PORT}`);
});

if (module.hot) {
  logs('✅  Server-side HMR Enabled!');
  module.hot.accept('./serverIndex', () => {
    logs('🔁  HMR Reloading `./serverIndex`...');
    server.removeListener('request', currentApp);
    const newApp = require('./serverIndex').default; // eslint-disable-line
    server.on('request', newApp);
    currentApp = newApp;
  });
}

```

Within getInitialProps, you have access to all you need to fetch data on both the client and the server:

- `req?: Request`: (server-only) A [`Express`](https://expressjs.com/) request object
- `res?: Request`: (server-only) An [`Express`](https://expressjs.com/) response object
- `store`: A [`Rematch`](https://github.com/rematch/rematch) store request object
- `match`: React Router 6's `match` object.

## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/kktjs/ssr/graphs/contributors">
  <img src="https://kktjs.github.io/ssr/CONTRIBUTORS.svg" />
</a>

Made with [github-action-contributors](https://github.com/jaywcjlove/github-action-contributors).

## License

Licensed under the MIT License
