# @kkt/ssr

用于编译服务端渲染文件简单的`CI`，把js文件打包到一个文件中，基于`kkt`和`create-react-app`创建的工具

## 安装

```bash
npm i  @kkt/ssr # yarn add @kkt/ssr
```

## 使用

```bash
$ kkt-ssr <cmd> [input-file] [opts]
# input-file default value: src/server.ts or src/server.js
```

## 示例:

```bash
$ kkt-ssr build 
```
把`src/server.js`文件输出到 `dist/server.js`中

## 命令

```bash

  Usage: kkt-ssr [build|watch] [input-file] [--help|h]

  Displays help information.

  Options:

   --version, -v         Show version number
   --help, -h            Displays help information.
   -o, --out [dir]       Output directory for build (defaults to dist).
   -m, --minify          Minify output.
   -t, --target          Instructs webpack to target a specific environment (defaults to node14).
   -l, --library         Output a library exposing the exports of your entry point. The parameter "--target=web" works.
   -ne, --nodeExternals          use webpack-node-external .
   -lt, --libraryTarget          Output library type .
   -s, --source-map      Generate source map.
   -e, --external [mod]  Skip bundling 'mod'. Can be used many times.
   --filename            output file name.

  Example:

   $ kkt-ssr build
   $ kkt-ssr build --out ./dist
   $ kkt-ssr build --minify
   $ kkt-ssr watch --minify
   $ kkt-ssr build src/app.ts
   $ kkt-ssr build --target web --library MyLibrary
   $ kkt-ssr build --source-map
   $ kkt-ssr build --nodeExternals
   $ kkt-ssr build --libraryTarget commonjs2

```

## 配置文件

Supports `.kktrc.js` and `.kktrc.ts`. Configuration [Example](https://github.com/uiwjs/react-codemirror/blob/880754a18ace17f40571330985d85e7eca770351/.kktrc.ts#L11-L74):

```typescript

import webpack, { Configuration } from 'webpack';
import { LoaderConfOptions } from 'kkt';
import lessModules from '@kkt/less-modules';

export default (conf: Configuration, env: 'development' | 'production', options: LoaderConfOptions) => {
  conf = lessModules(conf, env, options);
  if (options.bundle) {
    conf.output!.library = '@uiw/codemirror';
    conf.output!.filename = `codemirror${options.minify ? '.min.js' : '.js'}`;
    conf.externals = {
      '@codemirror/basic-setup': {
        root: ['CM', '@codemirror/basic-setup'],
        commonjs: '@codemirror/basic-setup',
        commonjs2: '@codemirror/basic-setup',
      },
      oneDark: {
        root: ['CM', '@codemirror/theme-one-dark', 'oneDark'],
      },
      StateEffect: {
        root: ['CM', '@codemirror/state', 'StateEffect'],
      },
      EditorState: {
        root: ['CM', '@codemirror/basic-setup', 'EditorState'],
      },
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom',
      },
    };
  } else {
    // ......
  }
  return conf;
};

```

### License

Licensed under the MIT License
