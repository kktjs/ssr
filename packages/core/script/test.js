
const jest = require('jest');
const path = require('path');
// const execSync = require('child_process').execSync;
const createJestConfig = require('../conf/jest.config');
const paths = require('../conf');

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

// Ensure environment variables are read.
require('../conf/env');

module.exports = async (args) => {
  args.push(
    '--config',
    JSON.stringify(
      createJestConfig(
        relativePath => path.resolve(__dirname, '..', relativePath),
        path.resolve(paths.appSrc, '..')
      )
    )
  );
  jest.run(args);
};
