#! /usr/bin/env node

// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

// Ensure environment variables are read.
require('../conf/env');

const webpack = require('webpack');
const fs = require('fs-extra');
require('colors-cli/toxic');

const createConfig = require('../conf/webpack.config');
const paths = require('../conf');

// Helper function to copy public directory to build/public
function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuildPublic, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}

// Wrap webpack compile in a try catch.
function compile(config) {
  return new Promise((resolve, reject) => {
    let compiler;
    try {
      compiler = webpack(config);
    } catch (e) {
      console.log('compile errors:', [e]); // eslint-disable-line
      reject(e);
      process.exit(1);
    }
    compiler.run((err, stats) => {
      err ? reject(err) : resolve(stats);
    });
  });
}

module.exports = async () => {
  fs.emptyDirSync(paths.appBuildDist);
  // Merge with the public folder
  copyPublicFolder();

  const clientConfig = createConfig('web', 'prod');
  const serverConfig = createConfig('node', 'prod');

  process.noDeprecation = true; // turns off that loadQuery clutter.
  try {
    const clientResult = await compile(clientConfig);
    let message;
    if (clientResult) {
      message = clientResult.toString({
        colors: true,
        children: false,
        chunks: false,
        modules: false,
        moduleTrace: false,
        warningsFilter: () => true,
      });
      console.log(message); // eslint-disable-line
    }
    const serverResult = await compile(serverConfig);
    if (serverResult) {
      message = serverResult.toString({
        colors: true,
        children: false,
        chunks: false,
        modules: false,
        moduleTrace: false,
        warningsFilter: () => true,
      });
      console.log(message); // eslint-disable-line
    }
  } catch (error) {
    console.log('--->', error); // eslint-disable-line
  }
};

