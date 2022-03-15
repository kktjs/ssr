
import createCompiler from "./utils"
import paths from "../overrides/path"
import fs from "fs-extra";
import FileSizeReporter from "react-dev-utils/FileSizeReporter";

const { checkBrowsers } = require('react-dev-utils/browsersHelper');
const chalk = require('react-dev-utils/chalk');
const measureFileSizesBeforeBuild =
  FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;

const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

const isInteractive = process.stdout.isTTY;

export interface OpaqueFileSizes {
  root: string;
  sizes: Record<string, number>;
}

export default async () => {
  checkBrowsers(paths.appPath, isInteractive)
    .then(() => {
      // First, read the current file sizes in build directory.
      // This lets us display how much they changed later.
      return measureFileSizesBeforeBuild(paths.appBuild);
    })
    .then((previousFileSizes: OpaqueFileSizes) => {
      // Remove all content but keep the directory so that
      // if you're in it, you don't end up in Trash
      fs.emptyDirSync(paths.appBuild);
      // Merge with the public folder
      copyPublicFolder();
      // Start the webpack build
      return build(previousFileSizes);
    }).then(({ stats, previousFileSizes, }: { stats: any, previousFileSizes: OpaqueFileSizes }) => {

      console.log(chalk.green('Compiled successfully.\n'));

      console.log('File sizes after gzip:\n');

      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        paths.appBuild,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE
      );

      console.log();

    }).catch((error: any) => {
      const message = error && error.message ? error.message : '';
      console.log('\x1b[31;1m KKT-SSR:BUILD:ERROR: \x1b[0m\n', error);
      new Error(`KKT:BUILD:ERROR: \n ${message}`);
      process.exit(1);
    })
}

const build = (previousFileSizes: OpaqueFileSizes) => {
  console.log('Creating an optimized production build...');
  const { compiler } = createCompiler("production")

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }
      const resolveArgs = {
        stats,
        previousFileSizes,
      };
      return resolve(resolveArgs);
    });
  });
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: (file: string) => file !== paths.appHtml,
  });
}