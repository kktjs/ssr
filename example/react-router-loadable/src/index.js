import http from 'http';
import app from './server';

const server = http.createServer(app);

let currentApp = app;
const PORT = process.env.PORT || 3000;

server.listen(PORT, (error) => {
  if (error) {
    console.log(error);
  }
  console.log('🚀 started!', `PORT: ${PORT}`);
});

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');
  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');
    server.removeListener('request', currentApp);
    const newApp = require('./server').default; // eslint-disable-line
    server.on('request', newApp);
    currentApp = newApp;
  });
}
