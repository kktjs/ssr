/* eslint-disable no-console, global-require */

import http from 'http';
import app from './server';

const server = http.createServer(app);
let currentApp = app;

const PORT = process.env.PORT || 3000;

server.listen(PORT, (error) => {
  if (error) {
    console.log(error);
  }
  console.log('🚀 started!', `http://localhost:${PORT}`);
  console.log('🚀 started');
});

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');
  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');
    try {
      app = require('./server').default;
      server.removeListener('request', currentApp);
      server.on('request', app);
      currentApp = app;
    } catch (error) {
      console.error(error);
    }
  });
}
