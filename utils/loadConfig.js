const color = require('colors-cli/safe');

module.exports = (conf, { kktrc, ...optionConf }, webpack) => {
  if (kktrc && kktrc.config && typeof kktrc.config === 'function') {
    conf = kktrc.config(conf, optionConf, webpack) || conf;
  } else if (kktrc && kktrc.config) {
    console.log(color.yellow('Check for .kkt.conf.js file, kktrc.config is not a function.')); // eslint-disable-line
  }
  if (kktrc && kktrc.plugins && kktrc.plugins.length > 0) {
    kktrc.plugins.forEach((item) => {
      const plugin = require(item); // eslint-disable-line
      conf = plugin(conf, optionConf, webpack) || conf;
    });
  }
  return conf;
};
