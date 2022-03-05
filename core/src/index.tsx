#!/usr/bin/env node

/**
 * 1. 开关 控制  /@babel(?:\/|\\{1,2})runtime/
 * 2. kkt-ssr
 * */

process.env.FAST_REFRESH = 'false';
process.env.GENERATE_SOURCEMAP = "false"

import minimist from 'minimist';
import path from 'path';
import fs from 'fs-extra';
import { BuildArgs } from 'kkt';
import nodeExternals from 'webpack-node-externals';
import './overrides';

function help() {
  const { version } = require('../package.json');
  console.log('\n  Usage: \x1b[34;1mkkt-ssr\x1b[0m [build|watch|start] [input-file] [--help|h]');
  console.log('\n  Displays help information.');
  console.log('\n  Options:\n');
  console.log('   --version, -v        ', 'Show version number');
  console.log('   --help, -h           ', 'Displays help information.');
  console.log('   -o, --out [dir]      ', 'Output directory for build (defaults to \x1b[35mdist\x1b[0m).');
  console.log(
    '   -t, --target         ',
    'Instructs webpack to target a specific environment (defaults to \x1b[35mnode14\x1b[0m).',
  );
  console.log('   -e, --external [mod] ', "Skip bundling 'mod'. Can be used many times.");
  console.log('   --filename           ', 'output file name.');
  console.log('\n  Example:\n');
  console.log('   $ \x1b[35mkkt-ssr\x1b[0m build');
  console.log('   $ \x1b[35mkkt-ssr\x1b[0m build --out ./dist');
  console.log('   $ \x1b[35mkkt-ssr\x1b[0m build src/app.ts');
  console.log(`\n  \x1b[34;1m@kkt/ssr\x1b[0m \x1b[32;1mv${version || ''}\x1b[0m\n`);
}

interface SSRArgs extends BuildArgs {
  out?: string;
  target?: string;
  filename?: string;
  minify?: boolean;
  external?: string[];
  sourceMap?: boolean;
}

(async () => {
  try {
    const args = process.argv.slice(2);
    const argvs: SSRArgs = minimist(args);
    if (argvs.h || argvs.help) {
      return help();
    }
    if (argvs.v || argvs.version) {
      const { version } = require('../package.json');
      console.log(`\n \x1b[34;1m@kkt/ssr\x1b[0m \x1b[32;1mv${version || ''}\x1b[0m\n`);
      return;
    }

    const outDir = argvs.out = argvs.o = path.resolve(process.cwd(), argvs.out || argvs.o || 'build');
    argvs.minify = true

    const scriptName = argvs._[0];
    const inputFileTS = path.resolve(process.cwd(), argvs._[1] || 'src/index.ts');
    const inputFileJS = path.resolve(process.cwd(), argvs._[1] || 'src/index.js');
    let inputFile = inputFileTS
    if (fs.existsSync(inputFileJS) && !fs.existsSync(inputFileTS)) {
      inputFile = inputFileJS
    }

    if (!fs.existsSync(inputFile)) {
      throw Error(`KKT:SSR: Example "build <input-file> [opts]".`);
    }

    const fileName = argvs.filename || path.basename(inputFileTS || inputFileJS).replace(/.(js|jsx?|cjs|mjs|tsx?)$/, '');
    const filename = `${fileName}.js`;

    const publicFolder = path.join(process.cwd(), 'node_modules', '.cache', 'kkt', '.~public');
    fs.ensureDirSync(publicFolder);

    const oPaths = { appBuild: outDir, appIndexJs: inputFile, appPublic: publicFolder };
    const target = "node";

    fs.ensureDirSync(outDir);

    argvs.overridesWebpack = (conf, env, options) => {
      // overridePaths(undefined, { ...oPaths });
      conf.entry = inputFile;
      conf.devtool = argvs.sourceMap = false;
      conf.module!.exprContextCritical = false;
      conf.amd = false;
      conf.externalsPresets = { node: true, web: false }// in order to ignore built-in modules like path, fs, etc.
      conf.target = target;
      conf.mode = ["watch", "start"].includes(scriptName) ? 'development' : 'production';
      conf.output = {};
      conf.externals = [];
      // conf.externals = [nodeExternals()].concat(argvs.external).filter(Boolean);
      conf.output.libraryTarget = 'commonjs2';
      conf.output.library = argvs.library = "commonjs2";
      conf.output.path = outDir;
      // conf.output.filename = filename;
      return conf;
    };
    if (scriptName === 'build') {
      await (
        await import('kkt/lib/scripts/build')
      ).default({
        ...argvs,
        bundle: true,
        isNotCheckHTML: true,
        // overridePaths: { ...oPaths },
      });
    } else if (["watch", "start"].includes(scriptName)) {
      await (
        await import('kkt/lib/scripts/start')
      ).default({
        ...argvs,
        watch: true,
        bundle: true,
        isNotCheckHTML: true,
        // overridePaths: { ...oPaths },
      });
    }
  } catch (error) {
    console.log('\x1b[31m KKT:SSR:ERROR:\x1b[0m', error);
  }
})();
