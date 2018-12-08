const fs = require('fs');
const path = require('path');
const color = require('colors-cli/safe');
const loadExample = require('./loadExample');

module.exports = function createKKTApp({ example, projectName }) {
  const projectPath = path.join(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    // eslint-disable-next-line
    console.log(`
    Uh oh! Looks like there's already a directory called ${color.red(projectName)}.
    ${color.yellow('Please try a different name or delete that folder.')}
    Path: ${projectPath}
    `);
    process.exit(1);
  }
  loadExample({ example, projectName, projectPath })
    // .then()
    .catch((err) => {
      throw err;
    });
};
