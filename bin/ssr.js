#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');
require('colors-cli/toxic');

const logs = console.log; // eslint-disable-line

program
  .description('A baseline for server side rendering for your React application.')
  .version(pkg.version, '-v, --version')
  .usage('<command> [options]');


program
  .command('build')
  .description('Builds the app for production to the dist folder.')
  .on('--help', () => {
    logs();
    logs('  Examples:');
    logs();
    logs(`    $ ${'react-ssr build'.green}`);
    logs();
  })
  .action((cmd) => {
    require('../script/build')(cmd); // eslint-disable-line
  });

program
  .command('start')
  .description('Runs the app in development mode.')
  .on('--help', () => {
    logs();
    logs('  Examples:');
    logs();
    logs(`    $ ${'react-ssr start'.green}`);
    logs();
  })
  .action((cmd) => {
    require('../script/start')(cmd); // eslint-disable-line
  });

program.on('--help', () => {
  logs('\n  Examples:');
  logs();
  logs(`    $ ${'react-ssr start'.green}`);
  logs(`    $ ${'react-ssr build'.green}`);
  logs();
  logs();
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
