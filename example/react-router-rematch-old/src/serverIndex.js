import express from 'express';
import cookieParser from 'cookie-parser';
import proxy from 'http-proxy-middleware';
import { render } from '@kkt/react-ssr-enhanced';
import { getRouterData } from './routes';
import Path from 'path';
import FS from 'fs';
import { createStore } from './store';

const assetPath = `${OUTPUT_PUBLIC_PATH}/asset-client-manifest.json`

// require 方式 打包报错
let assetsMainifest = {}
// if (FS.existsSync(assetPath)) {
assetsMainifest = new Function(`return ${FS.readFileSync(`${assetPath}`, "utf-8")}`)()
// }

const appDirectory = FS.realpathSync(process.cwd());
const resolveApp = (relativePath) => Path.resolve(appDirectory, relativePath);

const isDev = process.env.NODE_ENV === "development" && Dev_Server

// const target = `http://${process.env.HOST}:${process.env.PORT}`
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
