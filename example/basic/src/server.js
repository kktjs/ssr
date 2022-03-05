
import http from 'http';
import app from './serverIndex';

const logs = console.log; // eslint-disable-line

const server = http.createServer(app);
let currentApp = app;
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

server.listen(PORT, (error) => {
  if (error) {
    logs(error);
  }
  logs('🚀 started!', `PORT: http://${HOST}:${PORT}`);
});

if (module.hot) {
  logs('✅  Server-side HMR Enabled!');
  // module.hot.accept('./serverIndex', () => {
  //   logs('🔁  HMR Reloading `./serverIndex`...');
  //   server.removeListener('request', currentApp);
  //   const newApp = require('./serverIndex').default; // eslint-disable-line
  //   server.on('request', newApp);
  //   currentApp = newApp;
  // });
}
