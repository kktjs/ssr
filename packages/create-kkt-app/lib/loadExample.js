const fs = require('fs');
const path = require('path');
const exec = require('execa');
const axios = require('axios');
const color = require('colors-cli/safe');
const output = require('./output');
const { installDeps } = require('./installDeps');

module.exports = function loadExample({ example, projectName, projectPath }) {
  const cmds = [
    `mkdir -p ${projectName}`,
    `curl https://codeload.github.com/jaywcjlove/kkt-ssr/tar.gz/master | tar -xz -C ${projectName} --strip=3 kkt-ssr-master/example/${example}`,
  ];

  const stopExampleSpinner = output.wait(
    `Downloading files for ${output.cmd(example)} example`
  );

  const cmdPromises = cmds.map((cmd) => {
    return exec.shell(cmd);
  });

  return Promise.all(cmdPromises).then(async () => {
    stopExampleSpinner();
    output.success(
      `Downloaded ${output.cmd(example)} files for ${output.cmd(projectName)}`
    );
    // settings dependencies on the '@kkt/ssr' version.
    const dependName = '@kkt/ssr';
    const stopKKTVersionSpinner = await output.wait(`settings dependencies on the ${output.cmd(dependName)} version.`);
    const pkg = await axios.get('https://raw.githubusercontent.com/jaywcjlove/kkt-ssr/master/package.json');
    stopKKTVersionSpinner();
    if (pkg && pkg.data) {
      const appPkgPath = path.join(projectPath, 'package.json');
      const appPkg = require(`${appPkgPath}`); // eslint-disable-line
      if (appPkg) {
        if (appPkg.dependencies && appPkg.dependencies[dependName]) {
          appPkg.dependencies[dependName] = `^${pkg.data.version}`;
        }
        if (appPkg.devDependencies && appPkg.devDependencies[dependName]) {
          appPkg.devDependencies[dependName] = `^${pkg.data.version}`;
        }
        fs.writeFileSync(appPkgPath, JSON.stringify(appPkg, null, 2));
      }
      output.success(
        `Dependent on ${output.cmd(dependName)} version has been set.`
      );
    }
    await installDeps(projectPath, 'npm');
    // eslint-disable-next-line
    console.log(`🎉  ${color.green('✔')} successfully installed ${color.cyan(projectName)} dependencies..`);
    // eslint-disable-next-line
    console.log(
      '👉  Get started with the following commands:\n\n' +
      `${projectPath === process.cwd() ? '' : color.cyan(`   ${color.white('$')} cd ${projectName}\n`)}` +
      `   ${color.cyan(`${color.white('$')} npm run start\n\n`)}`
    );
  }).catch((err) => {
    stopExampleSpinner();
    throw err;
  });
};
