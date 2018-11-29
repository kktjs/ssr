import express from 'express';
import routes from './routes';
import render from './utils/Render';

const assets = require(process.env.KKT_ASSETS_MANIFEST); // eslint-disable-line

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.KKT_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    try {
      const html = await render({
        req,
        res,
        routes,
        assets,
      });

      res.send(html);
    } catch (error) {
      res.json(error);
    }
  });

export default server;
