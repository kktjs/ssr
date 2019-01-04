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

program
  .command('test')
  .description('Runs the app in development mode.')
  .option('-e, --env', 'If you know that none of your tests depend on jsdom, you can safely set --env=node, and your tests will run faster')
  .option('-c, --coverage', 'coverage reporter that works well with ES6 and requires no configuration.')
  .on('--help', () => {
    logs();
    logs('  Examples:');
    logs();
    logs(`    $ ${'react-ssr test --env=jsdom'.green}`);
    logs(`    $ ${'react-ssr test --env=jsdom --coverage'.green}`);
    logs();
  })
  .action((env, coverage, cmd) => {
    const cmdp = cmd || coverage;
    const args = [];
    if (cmdp.env) {
      args.push(`--env=${env}`);
    }
    if (cmdp.coverage) {
      args.push('--coverage');
    } else if (!process.env.CI) {
      args.push('--watch');
    }
    require('../script/test')(args, cmdp); // eslint-disable-line
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
