const fs = require('fs-extra');
require('colors-cli/toxic');

module.exports = (conf, options, webpack) => {
  // Check for .kkt.conf.js file
  if (fs.existsSync(options.appKKTRC)) {
    try {
      const kktrc = require(options.appKKTRC); // eslint-disable-line
      if (kktrc && kktrc.config && typeof kktrc.config === 'function') {
        conf = kktrc.config(conf, options, webpack);
      } else if (kktrc && kktrc.config) {
        console.log('Check for .kkt.conf.js file, kktrc.config is not a function.'.yellow); // eslint-disable-line
      }
    } catch (error) {
      console.log('Invalid .kkt.conf.js file.'.red, error); // eslint-disable-line
    }
  }
  return conf;
};
