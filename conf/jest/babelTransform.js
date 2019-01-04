const babelJest = require('babel-jest');
const fs = require('fs-extra');
const paths = require('../');

const hasBabelRc = fs.existsSync(paths.appBabelRc);

const config = {
  presets: !hasBabelRc && [require.resolve('babel-preset-kkt')],
  babelrc: !!hasBabelRc,
};

module.exports = babelJest.createTransformer(config);
