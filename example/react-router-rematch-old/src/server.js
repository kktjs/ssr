
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
