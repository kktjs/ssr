import minimist from 'minimist';
import { create } from 'create-kkt';

export async function run(): Promise<void> {
  const argvs = minimist(process.argv.slice(2), {
    alias: {
      output: 'o',
      version: 'v',
      force: 'f',
      path: 'p',
      example: 'e',
    },
    default: {
      path: 'https://kktjs.github.io/ssr/zip/',
      output: '.',
      force: false,
      example: 'basic',
    },
  });
  if (argvs.h || argvs.help) {
    console.log(helpCli);
    return;
  }
  const { version } = require('../package.json');
  if (argvs.v || argvs.version) {
    console.log(`\n create-kkt-ssr v${version}\n`);
    return;
  }
  argvs.appName = argvs._[0];
  argvs.example = argvs.e = String(argvs.example).toLocaleLowerCase();
  await create(argvs, helpExample);
}

export const helpExample: string = `Example:

    \x1b[35myarn\x1b[0m create kkt-ssr \x1b[33mappName\x1b[0m
    \x1b[35mnpx\x1b[0m create-kkt-ssr \x1b[33mmy-app\x1b[0m
    \x1b[35mnpm\x1b[0m create kkt-ssr \x1b[33mmy-app\x1b[0m
    \x1b[35mnpm\x1b[0m create kkt-ssr \x1b[33mmy-app\x1b[0m -f
    \x1b[35mnpm\x1b[0m create kkt-ssr \x1b[33mmy-app\x1b[0m -p \x1b[34mhttps://kktjs.github.io/ssr/zip/\x1b[0m
`;

export const helpCli: string = `
  Usage: create-kkt-ssr <app-name> [options] [--help|h]

  Options:

    --version, -v   Show version number
    --help, -h      Displays help information.
    --output, -o    Output directory.
    --example, -e   Example from: \x1b[34mhttps://kktjs.github.io/ssr/zip/\x1b[0m, default: "basic"
    --path, -p      Specify the download target git address.
                      default: "\x1b[34mhttps://kktjs.github.io/ssr/zip/\x1b[0m"
  
  ${helpExample}
  
  Copyright 2022

`;
