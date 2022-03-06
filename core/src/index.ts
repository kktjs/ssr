#!/usr/bin/env node

process.env.FAST_REFRESH = 'false';

import minimist from 'minimist';
import path from 'path';
import fs from 'fs-extra';
import { BuildArgs } from 'kkt';
import { overridePaths } from 'kkt/lib/overrides/paths';
import { sync as gzipSize } from 'gzip-size';
import filesize from 'filesize';
import './overrides';
import { filterPluginsServer, filterPluginsClient } from './utils';

import ExternalsNode from 'webpack-node-externals';

// const file = fs.createWriteStream('./outPut.txt');
// let logger = new console.Console(file, file);

function help() {
  const { version } = require('../package.json');
  console.log('\n  Usage: \x1b[34;1mreact-ssr\x1b[0m [build|watch] [input-file] [--help|h]');
  console.log('\n  Displays help information.');
  console.log('\n  Options:\n');
  console.log('   --version, -v        ', 'Show version number');
  console.log('   --help, -h           ', 'Displays help information.');
  console.log('   -o, --out [dir]      ', 'Output directory for build (defaults to \x1b[35mdist\x1b[0m).');
  console.log('   -m, --minify         ', 'Minify output.');
  console.log(
    '   -t, --target         ',
    'Instructs webpack to target a specific environment (defaults to \x1b[35mnode14\x1b[0m).',
  );
  console.log(
    '   -l, --library        ',
    'Output a library exposing the exports of your entry point. The parameter "--target=web" works.',
  );
  console.log('   -ne, --nodeExternals         ', 'use webpack-node-external .');
  console.log('   -lt, --libraryTarget         ', 'Output library type .');

  console.log('   -s, --source-map     ', 'Generate source map.');
  console.log('   -e, --external [mod] ', "Skip bundling 'mod'. Can be used many times.");
  console.log('   --filename           ', 'output file name.');
  console.log('\n  Example:\n');
  console.log('   $ \x1b[35mreact-ssr\x1b[0m build');
  console.log('   $ \x1b[35mreact-ssr\x1b[0m build --out ./dist');
  console.log('   $ \x1b[35mreact-ssr\x1b[0m build --minify');
  console.log('   $ \x1b[35mreact-ssr\x1b[0m watch --minify');
  console.log('   $ \x1b[35mreact-ssr\x1b[0m build src/app.ts');
  console.log(`   $ \x1b[35mreact-ssr\x1b[0m build --target web --library MyLibrary`);
  console.log(`   $ \x1b[35mreact-ssr\x1b[0m build --source-map`);
  console.log(`   $ \x1b[35mreact-ssr\x1b[0m build --nodeExternals`);
  console.log(`   $ \x1b[35mreact-ssr\x1b[0m build --libraryTarget commonjs2`);
  console.log(`\n  \x1b[34;1m@kkt/ssr\x1b[0m \x1b[32;1mv${version || ''}\x1b[0m\n`);
}

interface SSRNCCArgs extends BuildArgs {
  out?: string;
  target?: string;
  filename?: string;
  minify?: boolean;
  external?: string[];
  sourceMap?: boolean;
  nodeExternals?: boolean;
  libraryTarget?: string;
}

const data = {
  nolog: false,
  minify: false,
  filename: '',
  // .js file
  file: '',
  filePath: '',
  fileMin: '',
  fileMinPath: '',
  // .js.map file
  mapFile: '',
  mapMinFile: '',
  mapMinFilePath: '',
  mapFilePath: '',
  // .css file
  cssFile: '',
  cssFilePath: '',
  cssMinFile: '',
  cssMinFilePath: '',
};

process.on('beforeExit', () => {
  if (data.nolog) {
    return;
  }
  if (fs.existsSync(data.fileMinPath)) {
    data.fileMin = fs.readFileSync(data.fileMinPath).toString();
  }
  if (fs.existsSync(data.filePath)) {
    data.file = fs.readFileSync(data.filePath).toString();
  }
  if (fs.existsSync(data.mapMinFilePath)) {
    data.mapMinFile = fs.readFileSync(data.mapMinFilePath).toString();
  }
  if (fs.existsSync(data.mapFilePath)) {
    data.mapFile = fs.readFileSync(data.mapFilePath).toString();
  }
  if (fs.existsSync(data.cssFilePath)) {
    data.cssFile = fs.readFileSync(data.cssFilePath).toString();
  }
  if (fs.existsSync(data.cssMinFilePath)) {
    data.cssMinFile = fs.readFileSync(data.cssMinFilePath).toString();
  }
});

process.on('exit', (code) => {
  if (code === 1 || data.nolog) {
    return;
  }
  const outputDir = path.relative(process.cwd(), path.dirname(data.filePath));
  if (!!data.file) {
    fs.writeFileSync(data.filePath, data.file);
    !data.minify &&
      console.log(
        `   ${filesize(gzipSize(data.file))}  \x1b[30;1m${outputDir}/\x1b[0m\x1b[32m${data.filename}\x1b[0m.`,
      );
  }
  if (!!data.fileMin) {
    fs.writeFileSync(data.fileMinPath, data.fileMin);
    data.minify &&
      console.log(
        `   ${filesize(gzipSize(data.fileMin))}  \x1b[30;1m${outputDir}/\x1b[0m\x1b[32m${data.filename}\x1b[0m.`,
      );
  }
  if (!!data.mapMinFile) {
    fs.writeFileSync(data.mapMinFilePath, data.mapMinFile);
  }
  if (!!data.mapFile) {
    fs.writeFileSync(data.mapFilePath, data.mapFile);
  }

  if (!!data.cssFile) {
    fs.writeFileSync(data.cssFilePath, data.cssFile);
    !data.minify &&
      console.log(
        `   ${filesize(gzipSize(data.cssFile))}  \x1b[30;1m${outputDir}/\x1b[0m\x1b[32m${path.basename(
          data.cssFilePath,
        )}\x1b[0m.`,
      );
  }
  if (!!data.cssMinFile) {
    fs.writeFileSync(data.cssMinFilePath, data.cssMinFile);
    data.minify &&
      console.log(
        `   ${filesize(gzipSize(data.cssMinFile))}  \x1b[30;1m${outputDir}/\x1b[0m\x1b[32m${path.basename(
          data.cssMinFilePath,
        )}\x1b[0m.`,
      );
  }
  console.log(`\n`);
});

(async () => {
  /**
   *   --- 目标
   * 1. 入口文件
   * 2. 出口文件
   * 3. 输出文件夹
   * 4. ts 还是 js
   * 5. sourceMap = false
   * 6. 进行 全量打包 还是使用 require 引入
   * css 文件抽离不需要打包到 server.js 中 ,或者使用 [isomorphic-style-loader](https://www.npmjs.com/package/isomorphic-style-loader) 进行转换
   * */

  try {
    const args = process.argv.slice(2);
    const argvs: SSRNCCArgs = minimist(args);
    if (argvs.h || argvs.help) {
      data.nolog = true;
      return help();
    }
    if (argvs.v || argvs.version) {
      data.nolog = true;
      const { version } = require('../package.json');
      console.log(`\n \x1b[34;1m@kkt/ssr-ncc\x1b[0m \x1b[32;1mv${version || ''}\x1b[0m\n`);
      return;
    }

    argvs.out = argvs.o = path.resolve(argvs.out || argvs.o || 'dist');
    argvs.minify = argvs.m = argvs.minify || argvs.m || false;
    const scriptName = argvs._[0];
    const isWeb = /^(web|browserslist)$/.test(argvs.target);

    argvs.libraryTarget = argvs.libraryTarget || argvs.lt || isWeb ? 'umd' : 'commonjs2';
    argvs.nodeExternals = argvs.nodeExternals || argvs.ne || false;

    const inputFileTS = path.resolve(process.cwd(), argvs._[1] || isWeb ? 'src/index.tsx' : 'src/server.ts');
    const inputFileJS = path.resolve(process.cwd(), argvs._[1] || isWeb ? 'src/index.js' : 'src/server.js');
    let inputFile = inputFileTS;
    if (fs.existsSync(inputFileJS) && !fs.existsSync(inputFileTS)) {
      inputFile = inputFileJS;
    }

    if (!fs.existsSync(inputFile)) {
      throw Error(`KKT:SSR: Example "build <input-file> [opts]".`);
    }

    const fileName = argvs.filename || path.basename(inputFile).replace(/.(js|jsx?|cjs|mjs|tsx?)$/, '');
    const outDir = argvs.out;

    data.filename = `${fileName}${argvs.minify ? '.min.js' : '.js'}`;

    data.filePath = path.resolve(argvs.out, `${fileName}.js`);
    data.fileMinPath = path.resolve(argvs.out, `${fileName}.min.js`);
    data.mapMinFilePath = path.resolve(argvs.out, `${fileName}.js.map`);
    data.mapFilePath = path.resolve(argvs.out, `${fileName}.min.js.map`);
    data.cssFilePath = path.resolve(argvs.out, `${fileName}.css`);
    data.cssMinFilePath = path.resolve(argvs.out, `${fileName}.min.css`);

    if (fs.existsSync(data.fileMinPath)) {
      data.fileMin = fs.readFileSync(data.fileMinPath).toString();
    }
    if (fs.existsSync(data.filePath)) {
      data.file = fs.readFileSync(data.filePath).toString();
    }
    if (fs.existsSync(data.mapFilePath)) {
      data.mapFile = fs.readFileSync(data.mapFilePath).toString();
    }
    if (fs.existsSync(data.mapMinFilePath)) {
      data.mapMinFile = fs.readFileSync(data.mapMinFilePath).toString();
    }
    if (fs.existsSync(data.cssFilePath)) {
      data.cssFile = fs.readFileSync(data.cssFilePath).toString();
    }
    if (fs.existsSync(data.cssMinFilePath)) {
      data.cssMinFile = fs.readFileSync(data.cssMinFilePath).toString();
    }

    const publicFolder = path.join(process.cwd(), 'node_modules', '.cache', 'kkt', '.~public');
    fs.ensureDirSync(publicFolder);

    const oPaths = { appBuild: outDir, appIndexJs: inputFile, appPublic: publicFolder };
    const target = isWeb ? argvs.target : argvs.target ? ['node14', argvs.target] : 'node14';
    fs.ensureDirSync(outDir);
    overridePaths(undefined, { ...oPaths });
    // 调用日志打印
    // logger.log(require.cache);
    argvs.overridesWebpack = (conf, env, options) => {
      // 为了 覆盖 默认输出的地址
      overridePaths(undefined, { ...oPaths });
      if (!isWeb) {
        // server  端 css 代码可以可以 isomorphic-style-loader 进行打包 或者 直接分离出
        // 处理 module rules 和 plugin 里面的 原始 css loader，是使用  isomorphic-style-loader 还是直接分离做判断
        conf = filterPluginsServer(conf, fileName, argvs.minify);
      } else {
        // 去除 index.html 模板
        conf = filterPluginsClient(conf, argvs.minify);
      }
      // conf = removeLoaders(conf)
      conf.entry = inputFile;
      if (argvs.sourceMap) {
        conf.devtool = typeof argvs.sourceMap === 'boolean' ? 'source-map' : argvs.sourceMap;
      } else {
        conf.devtool = false;
      }
      if (!argvs.nodeExternals && !isWeb) {
        conf.externals = [ExternalsNode()];
      }

      conf.module!.exprContextCritical = false;

      conf.amd = false;
      if (!isWeb) {
        conf.target = target;
      }
      conf.mode = scriptName === 'watch' ? 'development' : 'production';
      conf.output = {};
      if (argvs.external) conf.externals = argvs.external;
      conf.output.libraryTarget = argvs.libraryTarget;
      conf.output.path = outDir;
      conf.output.filename = data.filename;
      if (argvs.library) {
        conf.output.library = argvs.library;
      }
      return conf;
    };

    data.minify = argvs.minify;
    if (scriptName === 'build') {
      await (
        await import('kkt/lib/scripts/build')
      ).default({
        ...argvs,
        bundle: !isWeb,
        isNotCheckHTML: !isWeb,
        overridePaths: { ...oPaths },
      });
    } else if (scriptName === 'watch') {
      await (
        await import('kkt/lib/scripts/start')
      ).default({
        ...argvs,
        watch: true,
        bundle: !isWeb,
        isNotCheckHTML: !isWeb,
        overridePaths: { ...oPaths },
      });
    }
  } catch (error) {
    console.log('\x1b[31m KKT:SSR:ERROR:\x1b[0m', error);
  }
})();
