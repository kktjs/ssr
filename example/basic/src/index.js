import express from 'express';
let app = require('./server').default;

if (module.hot) {
  module.hot.accept('./server', function () {
    console.log('🔁  HMR Reloading `./server`...');
    try {
      app = require('./server').default;
    } catch (error) {
      console.error(error);
    }
  });
  console.info('✅  Server-side HMR Enabled!');
}

const port = process.env.PORT || 3001;

export default express()
  .use((req, res) => app.handle(req, res))
  .listen(KKT_SSR_SERVER_PORT, function (err) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`> Started on port \x1b[1;37m${KKT_SSR_SERVER_PORT}\x1b[0m`);
    console.log(`> You can now view project in the browser. http://localhost:\x1b[1;37m${KKT_SSR_SERVER_PORT}\x1b[0m`);
  });
