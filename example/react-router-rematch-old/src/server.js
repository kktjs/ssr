
import http from 'http';
import app from './serverIndex';

const logs = console.log; // eslint-disable-line
const server = http.createServer(app);
let currentApp = app;

const PORT = parseInt(process.env.PORT || 3000);

server.listen(PORT + 1, (error) => {
  if (error) {
    logs(error);
  }
  logs('🚀 started!', `PORT: http://localhost:${PORT + 1}`);
});

// if (module.hot) {
//   logs('✅  Server-side HMR Enabled!');
//   module.hot.accept('./server', () => {
//     logs('🔁  HMR Reloading `./server`...');
//     server.removeListener('request', currentApp);
//     const newApp = require('./server').default; // eslint-disable-line
//     server.on('request', newApp);
//     currentApp = newApp;
//   });
// }
