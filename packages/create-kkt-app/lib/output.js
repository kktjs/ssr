const { eraseLine } = require('ansi-escapes');
const color = require('colors-cli/safe');
const ora = require('ora');
const ms = require('ms');

exports.info = (msg) => {
  // eslint-disable-next-line
  console.log(`${color.black('>')} ${msg}`);
};

exports.error = (msg) => {
  if (msg instanceof Error) {
    msg = msg.message;
  }

  // eslint-disable-next-line
  console.error(`${color.red('> Error!')} ${msg}`);
};

exports.success = (msg) => {
  // eslint-disable-next-line
  console.log(`${color.green('> Success!')} ${msg}`);
};

exports.time = () => {
  const start = new Date();
  return color.black(`[${ms(new Date() - start)}]`);
};

exports.wait = (msg) => {
  const spinner = ora(color.green(msg));
  spinner.color = 'blue';
  spinner.start();

  return () => {
    spinner.stop();
    process.stdout.write(eraseLine);
  };
};

exports.prompt = (opts) => {
  return new Promise((resolve, reject) => {
    opts.forEach((val, i) => {
      const text = val[1];
      // eslint-disable-next-line
      console.log(`${color.black('>')} [${color.bold(i + 1)}] ${text}`);
    });

    const ondata = (v) => {
      const s = v.toString();

      function cleanup() {
        process.stdin.setRawMode(false);
        process.stdin.removeListener('data', ondata);
      }

      if (s === '\u0003') {
        cleanup();
        reject(new Error('Aborted'));
        return;
      }

      const n = Number(s);
      if (opts[n - 1]) {
        cleanup();
        resolve(opts[n - 1][0]);
      }
    };

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', ondata);
  });
};

exports.cmd = (cmd) => {
  return color.bold(color.cyan(cmd));
};

exports.code = (cmd) => {
  return `${color.black('`')}${color.bold(cmd)}${color.black('`')}`;
};

exports.param = (param) => {
  return color.bold(`${color.black('{')}${color.bold(param)}${color.black('}')}`);
};
