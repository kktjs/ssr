// Monitor server script startup and reload. Should be added at the end of entries
const monitorFn = () => {
  // Handle hot updates, copied with slight adjustments from webpack/hot/signal.js
  if (module.hot) {
    const log = (type: keyof Console, msg: string) => {
      if (type === 'info') {
        return console[type](`\x1b[1;34m[SSWP]> \x1b[0m ${msg}`);
      }
      if (type === 'warn') {
        return console[type](`\x1b[1;33m[SSWP]> \x1b[0m ${msg}`);
      }
      return console[type](`[SSWP]> ${msg}`);
    };
    // TODO don't show this when sending signal instead of message
    log('log', 'Handling Hot Module Reloading');
    const checkForUpdate = function checkForUpdate(fromUpdate?: boolean) {
      module.hot
        .check()
        .then(function (updatedModules) {
          if (!updatedModules) {
            if (fromUpdate) log('info', 'Update applied.');
            else log('warn', 'Cannot find update.');
            return;
          }

          return module.hot
            .apply({
              ignoreUnaccepted: true,
              // TODO probably restart
              onUnaccepted: (data: __WebpackModuleApi.HotNotifierInfo) => {
                log('warn', '\u0007Ignored an update to unaccepted module ' + data.chain.join(' -> '));
              },
            })
            .then(function (renewedModules) {
              require('webpack/hot/log-apply-result')(updatedModules, renewedModules);

              checkForUpdate(true);
              return null;
            });
        })
        .catch(function (err) {
          var status = module.hot.status();
          if (['abort', 'fail'].indexOf(status) >= 0) {
            if (process.send) {
              process.send('SSWP_HMR_FAIL');
            }
            log('warn', 'Cannot apply update.');
            log('warn', '' + err.stack || err.message);
            log('error', 'Quitting process - will reload on next file change\u0007\n\u0007\n\u0007');
            process.exit(222);
          } else {
            log('warn', 'Update failed: ' + err.stack || err.message);
          }
        });
    };
    process.on('message', (message) => {
      if (message !== 'SSWP_HMR') return;
      console.log('module.hot.status():>>>>', module.hot.status());
      if (module.hot.status() !== 'idle') {
        log('warn', 'Got signal but currently in ' + module.hot.status() + ' state.');
        log('warn', 'Need to be in idle state to start hot update.');
        return;
      }

      checkForUpdate();
    });
  }

  // Tell our plugin we loaded all the code without initially crashing
  if (process.send) {
    process.send('SSWP_LOADED');
  }
};

export default monitorFn;
