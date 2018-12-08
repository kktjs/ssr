const execa = require('execa');
const registries = require('./registries');

const taobaoDistURL = 'https://npm.taobao.org/dist';

async function addRegistryToArgs(command, args, cliRegistry) {
  if (command === 'yarn' && cliRegistry) {
    throw new Error(
      'Inline registry is not supported when using yarn. ' +
      `Please run \`yarn config set registry ${cliRegistry}\` before running kkt`
    );
  }
  if (cliRegistry) {
    args.push(`--registry=${cliRegistry}`);
    if (cliRegistry === registries.taobao) {
      args.push(`--disturl=${taobaoDistURL}`);
    }
  }
}

function executeCommand(command, args, targetDir) {
  return new Promise((resolve, reject) => {
    const child = execa(command, args, {
      cwd: targetDir,
      stdio: ['inherit', 'inherit', command === 'yarn' ? 'pipe' : 'inherit'],
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`command failed: ${command} ${args.join(' ')}`));
        return;
      }
      resolve();
    });
  });
}


exports.installDeps = async function installDeps(targetDir, command, cliRegistry) {
  const args = [];
  if (command === 'npm') {
    args.push('install', '--loglevel', 'error');
  } else {
    throw new Error(`Unknown package manager: ${command}`);
  }

  await addRegistryToArgs(command, args, cliRegistry);
  await executeCommand(command, args, targetDir);
};

