const fs = require('fs-extra');
const color = require('colors-cli/safe');

module.exports = (kktrcPath) => {
  let kktrc = null;
  // Check for .kkt.conf.js file
  if (fs.existsSync(kktrcPath)) {
    try {
      kktrc = require(kktrcPath); // eslint-disable-line
    } catch (error) {
      console.log(color.red('Invalid .kkt.conf.js file.'), error); // eslint-disable-line
    }
  }
  return kktrc;
};
