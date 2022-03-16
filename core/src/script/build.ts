
import createCompiler from "./utils"
import fs from "fs-extra";
import FileSizeReporter from "react-dev-utils/FileSizeReporter";
import { Paths } from "./../overrides/pathUtils"
const chalk = require('react-dev-utils/chalk');

const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;

const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

export interface OpaqueFileSizes {
  root: string;
  sizes: Record<string, number>;
}

const build = async () => {

  const { compiler, overrides } = await createCompiler("production")

  console.log('Creating an optimized production build...');

  fs.emptyDirSync(overrides.paths.appBuild);

  copyPublicFolder(overrides.paths);

  compiler.run((error, stats: any) => {
    if (!error) {
      console.log(chalk.green('Compiled successfully.\n'));
      console.log('File sizes after gzip:\n');
      printFileSizesAfterBuild(
        stats,
        { root: overrides.paths.appBuild, sizes: {} },
        overrides.paths.appBuild,
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

function copyPublicFolder(paths: Partial<Paths>) {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: (file: string) => file !== paths.appHtml,
  });
}

export default build