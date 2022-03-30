#!/usr/bin/env node
process.env.FAST_REFRESH = 'false';
process.env.BUILD_PATH = "dist"

import minimist from 'minimist';
import { BuildArgs } from 'kkt';
import { OptionsProps } from "./interface"

function help() {
  const { version } = require('../package.json');
  console.log('\n  Usage: \x1b[34;1mkkt-ssr\x1b[0m [build|start] [--help|h]');
  console.log('\n  Displays help information.');
  console.log('\n  Options:\n');
  console.log('   --version, -v        ', 'Show version number');
  console.log('   --help, -h           ', 'Displays help information.');
  console.log('   --s-ne, --s-nodeExternals         ', 'server use webpack-node-external .');
  console.log('   --c-ne, --c-nodeExternals         ', 'client use webpack-node-external .');
  console.log('   --s-st, --s-split         ', 'server Split code .');
  console.log('   --c-st, --c-split         ', 'client Split code .');
  console.log('   -o, --original         ', 'Use original react-scripts config .');
  console.log('   -m, --minify         ', 'All Minify output.');
  console.log('   --s-m, --s-minify         ', 'server Minify output.');
  console.log('   --c-m, --c-minify         ', 'clinet Minify output.');

  console.log('\n  Example:\n');
  console.log('   $ \x1b[35mkkt-ssr\x1b[0m build');
  console.log('   $ \x1b[35mkkt-ssr\x1b[0m start');
  console.log('   $ \x1b[35mkkt-ssr\x1b[0m build --s-ne');
  console.log('   $ \x1b[35mkkt-ssr\x1b[0m start --s-ne');
  console.log('   $ \x1b[35mkkt-ssr\x1b[0m build --s-st');
  console.log('   $ \x1b[35mkkt-ssr\x1b[0m start --s-st');
  console.log('   $ \x1b[35mkkt-ssr\x1b[0m start -o');
  console.log(`\n  \x1b[34;1m@kkt/ssr\x1b[0m \x1b[32;1mv${version || ''}\x1b[0m\n`);
}

interface SSRNCCArgs extends BuildArgs {
  "s-ne"?: boolean;
  "s-m"?: boolean;
  "s-minify"?: boolean;
  "s-nodeExternals"?: boolean,
  "s-st"?: boolean,
  "s-split"?: boolean,
  "c-ne"?: boolean;
  "c-nodeExternals"?: boolean,
  "c-st"?: boolean,
  "c-split"?: boolean,
  "c-m"?: boolean;
  "c-minify"?: boolean;
  "o"?: boolean,
  "original"?: boolean,
  "m"?: boolean;
  "minify"?: boolean,
}

(async () => {

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

    type BoolenValue = boolean | undefined | "false" | "true"

    const getBoolean = (one: BoolenValue, two: BoolenValue, defaultValue: boolean = false) => {
      let value = defaultValue
      if (typeof one === "boolean") {
        value = one
      } else if (typeof two === "boolean") {
        value = two
      }

      if ((typeof one === "string" && one === "true") || (typeof two === "string" && two === "true")) {
        value = true
      }

      if ((typeof one === "string" && one === "false") || (typeof two === "string" && two === "false")) {
        value = false
      }

      return value
    }

    const scriptName = argvs._[0];

    const clientNodeExternals = getBoolean(argvs["c-ne"], argvs['c-nodeExternals'])
    const serverNodeExternals = getBoolean(argvs["s-ne"], argvs['s-nodeExternals'])

    const clientIsChunk = getBoolean(argvs["c-st"], argvs['c-split'])
    const serverIsChunk = getBoolean(argvs["s-st"], argvs['s-split'])

    // 使用原始 react-scripts 
    const original = getBoolean(argvs["o"], argvs["original"])

    const mini = getBoolean(argvs["m"], argvs["minify"], true)

    const miniServer = getBoolean(argvs["s-m"], argvs["s-minify"], mini)
    const miniClient = getBoolean(argvs["c-m"], argvs["c-minify"], mini)

    const options: OptionsProps = {
      clientNodeExternals,
      serverNodeExternals,
      clientIsChunk,
      serverIsChunk,
      original,
      mini,
      miniServer,
      miniClient
    }
    // 解决 使用 react-scripts 原始情况下 PUBLIC_URL 报错
    if (!Reflect.has(process.env || {}, "PUBLIC_URL")) {
      process.env.PUBLIC_URL = '';
    }

    const setEnv = (NODE_ENV: "production" | "development") => {
      process.env.BABEL_ENV = NODE_ENV;
      process.env.NODE_ENV = NODE_ENV;
    }

    if (scriptName === 'build') {
      setEnv("production")

      const build = await import("./script/build")
      await build.default(options)

    } else if (scriptName === 'start') {

      setEnv("development")
      const start = await import("./script/start")
      await start.default(options)

    }
  } catch (error) {
    console.log('\x1b[31m KKT:SSR:ERROR:\x1b[0m', error);
  }
})();
