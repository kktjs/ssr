import express from 'express';
import cookieParser from 'cookie-parser';
import proxy from 'http-proxy-middleware';
import { render } from '@kkt/react-ssr-enhanced';
import { getRouterData } from './routes';
import Path from 'path';
import FS from 'fs';
import { createStore } from './store';

// require 方式 打包报错
const assetsMainifest = new Function(`return ${FS.readFileSync(`${OUTPUT_PUBLIC_PATH}/asset-client-manifest.json`, "utf-8")}`)()
// const assetsMainifest = new Function(`return ${FS.readFileSync(`${Path.join(process.cwd(), "build/asset-manifest.json")}`, "utf-8")}`)()

const appDirectory = FS.realpathSync(process.cwd());
const resolveApp = (relativePath) => Path.resolve(appDirectory, relativePath);

const routes = getRouterData();
const server = express();

server.disable('x-powered-by');
// API request to pass cookies
// `getInitialProps` gets the required value via `req.cookies.token`
server.use(cookieParser());
// server.use(express.static(resolveApp('dist')));
server.use(express.static("http://localhost:3000/"));
server.use('/api', proxy({
  target: `http://${process.env.HOST}:3000`,
  changeOrigin: true,
}));
server.get('/*', async (req, res) => {
  if (req.url === "/favicon.ico/") {
    return;
  }
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
