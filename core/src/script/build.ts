

import createCompiler from "./utils"
import paths from "../overrides/path"
import fs from "fs-extra";
import FileSizeReporter from "react-dev-utils/FileSizeReporter";

const chalk = require('react-dev-utils/chalk');

const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;

const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

export interface OpaqueFileSizes {
  root: string;
  sizes: Record<string, number>;
}

const build = () => {
  console.log('Creating an optimized production build...');
  const { compiler } = createCompiler("production")

  fs.emptyDirSync(paths.appBuild);

  copyPublicFolder();

  compiler.run((error, stats: any) => {
    if (!error) {
      console.log(chalk.green('Compiled successfully.\n'));
      console.log('File sizes after gzip:\n');
      printFileSizesAfterBuild(
        stats,
        { root: paths.appBuild, sizes: {} },
        paths.appBuild,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE
      );
      console.log();
    } else {
      const message = error && error.message ? error.message : '';
      console.log('\x1b[31;1m KKT-SSR:BUILD:ERROR: \x1b[0m\n', error);
      new Error(`KKT:BUILD:ERROR: \n ${message}`);
      process.exit(1);
    }
  });
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: (file: string) => file !== paths.appHtml,
  });
}

export default build