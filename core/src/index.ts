#!/usr/bin/env node
process.env.FAST_REFRESH = 'false';
process.env.BUILD_PATH = "dist"


import minimist from 'minimist';
import { BuildArgs } from 'kkt';

function help() {
  const { version } = require('../package.json');
  console.log('\n  Usage: \x1b[34;1mkkt-ssr\x1b[0m [build|watch|start] [--help|h]');
  console.log('\n  Displays help information.');
  console.log('\n  Options:\n');
  console.log('   --version, -v        ', 'Show version number');
  console.log('   --help, -h           ', 'Displays help information.');
  console.log('   --s-ne, --s-nodeExternals         ', 'server use webpack-node-external .');
  console.log('   --c-ne, --c-nodeExternals         ', 'client use webpack-node-external .');
  console.log('   --s-st, --s-split         ', 'server Split code .');
  console.log('   --c-st, --c-split         ', 'client Split code .');
  console.log('   -o, --original         ', 'Use original react-scripts .');

  console.log('\n  Example:\n');
  console.log('   $ \x1b[35mkkt-ssr\x1b[0m build');
  console.log('   $ \x1b[35mkkt-ssr\x1b[0m watch');
  console.log('   $ \x1b[35mkkt-ssr\x1b[0m start');
  console.log('   $ \x1b[35mkkt-ssr\x1b[0m build --s-ne');
  console.log('   $ \x1b[35mkkt-ssr\x1b[0m watch --s-ne');
  console.log('   $ \x1b[35mkkt-ssr\x1b[0m build --s-st');
  console.log('   $ \x1b[35mkkt-ssr\x1b[0m watch --s-st');
  console.log('   $ \x1b[35mkkt-ssr\x1b[0m start -o');
  console.log(`\n  \x1b[34;1m@kkt/ssr\x1b[0m \x1b[32;1mv${version || ''}\x1b[0m\n`);
}

interface SSRNCCArgs extends BuildArgs {
  "s-ne"?: boolean;
  "s-nodeExternals"?: boolean,
  "s-st"?: boolean,
  "s-split"?: boolean,
  "c-ne"?: boolean;
  "c-nodeExternals"?: boolean,
  "c-st"?: boolean,
  "c-split"?: boolean,
  "o"?: boolean,
  "original"?: boolean,
}

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

  /** 二次改造
   * 1. 支持多配置一起执行
   * 2. 只保留 build 和 watch 功能，
   * 3. 简化代码 和 配置
   * **/

  try {
    const args = process.argv.slice(2);
    const argvs: SSRNCCArgs = minimist(args);
    if (argvs.h || argvs.help) {
      return help();
    }
    if (argvs.v || argvs.version) {
      const { version } = require('../package.json');
      console.log(`\n \x1b[34;1m@kkt/ssr\x1b[0m \x1b[32;1mv${version || ''}\x1b[0m\n`);
      return;
    }
    const scriptName = argvs._[0];

    const clientNodeExternals = argvs["c-ne"] || argvs['c-nodeExternals']
    const serverNodeExternals = argvs["s-ne"] || argvs['s-nodeExternals']

    const clientIsChunk = argvs["c-st"] || argvs['c-split']
    const serverIsChunk = argvs["s-st"] || argvs['s-split']

    // 使用原始 react-scripts 
    const original = argvs["o"] || argvs["original"]

    const options = {
      clientNodeExternals,
      serverNodeExternals,
      clientIsChunk,
      serverIsChunk,
      original
    }
    // 解决 原始情况下 PUBLIC_URL 报错
    if (argvs["PUBLIC_URL"]) {
      process.env.PUBLIC_URL = argvs["PUBLIC_URL"];
    } else {
      process.env.PUBLIC_URL = '';
    }

    if (scriptName === 'build') {
      process.env.BABEL_ENV = 'production';
      process.env.NODE_ENV = 'production';

      const build = await import("./script/build")
      await build.default(options)
    } else if (scriptName === 'watch') {

      process.env.BABEL_ENV = 'development';
      process.env.NODE_ENV = 'development';

      const watch = await import("./script/watch")
      await watch.default(options)
    } else if (scriptName === 'start') {
      process.env.BABEL_ENV = 'development';
      process.env.NODE_ENV = 'development';

      const start = await import("./script/start")
      await start.default(options)
    }
  } catch (error) {
    console.log('\x1b[31m KKT:SSR:ERROR:\x1b[0m', error);
  }
})();
