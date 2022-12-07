<p align="center">
  <a href="https://kktjs.github.io/ssr">
    <img src="https://user-images.githubusercontent.com/1680273/157196191-9e56f20a-8991-487a-a78d-35352a2c1222.png">
  </a>
</p>

<p align="center">
  <a href="https://github.com/kktjs/ssr/issues">
    <img src="https://img.shields.io/github/issues/kktjs/ssr.svg">
  </a>
  <a href="https://github.com/kktjs/ssr/network">
    <img src="https://img.shields.io/github/forks/kktjs/ssr.svg">
  </a>
  <a href="https://github.com/kktjs/ssr/stargazers">
    <img src="https://img.shields.io/github/stars/kktjs/ssr.svg">
  </a>
  <a href="https://github.com/kktjs/ssr/releases">
    <img src="https://img.shields.io/github/release/kktjs/ssr.svg">
  </a>
  <a href="https://www.npmjs.com/package/@kkt/ssr">
    <img src="https://img.shields.io/npm/v/@kkt/ssr.svg">
  </a>
</p>

Create [React](https://github.com/facebook/react) server-side rendering universal JavaScript applications with no configuration. If you don't need server-side rendering you can use [kkt](https://github.com/jaywcjlove/kkt) tools.

<p align="center">
  <a href="https://github.com/kktjs/ssr/tree/master/example/react-router%2Brematch">
    <img src="https://github.com/kktjs/ssr/raw/847e32d0f04c30da9f7b3bd637be9fa6b1eee22b/assets/ssr.png?sanitize=true">
  </a>
</p>

[Quick Start](#quick-start) · [Using Plugins](#using-plugins) · [Rewrite Config](#rewrite-config) · [KKTSSR Config](#kktssr-config) · [Example](#example)

[![Let's fund issues in this repository](https://issuehunt.io/static/embed/issuehunt-button-v1.svg)](https://issuehunt.io/repos/159655834)

## Usage

You will need [`Node.js`](https://nodejs.org) installed on your system.
Support multiple webpack configurations to execute together.

## Command Help

```bash

  Usage: kkt-ssr [build|start] [--help|h]

  Displays help information.

  Options:

   --version, -v         Show version number
   --help, -h            Displays help information.
   --s-ne, --s-nodeExternals          server use webpack-node-external .
   --c-ne, --c-nodeExternals          client use webpack-node-external .
   --s-st, --s-split          server Split code .
   --c-st, --c-split          client Split code .
   -o, --original          Use original react-scripts config .
   -m, --minify          All Minify output.
   --s-m, --s-minify          server Minify output.
   --c-m, --c-minify          clinet Minify output.
   --target                   clent or server or all.

  Example:

   $ kkt-ssr build
   $ kkt-ssr start
   $ kkt-ssr build --s-ne
   $ kkt-ssr start --s-ne
   $ kkt-ssr build --s-st
   $ kkt-ssr start --s-st
   $ kkt-ssr start -o

```

## Quick Start

```bash
npx create-kkt-ssr my-app
cd my-app
npm install
npm run start
```

You can also initialize a project from one of the examples. Example from [kktjs/ssr](./example) example-path. 

```bash
# Using the template method
# `npx create-kkt-ssr my-app [-e example name]`
npx create-kkt-ssr my-app -e react-router-rematch
```

or

```bash
npm install -g create-kkt-ssr
# Create project, Using the template method
create-kkt-ssr my-app -e react-router-rematch
cd my-app # Enter the directory
npm install # Watch file
npm run start # Start service
```

> ⚠️ A perfect example [`react-router-rematch`](example/react-router-rematch) is recommended for production environments, This example is similar to [`Next.js`](https://github.com/zeit/next.js).

**development**

Runs the project in development mode.  

```bash
npm run start
```

**production**

Builds the app for production to the build folder.

```bash
npm run build
```

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

```bash
# Runs the compiled app in production.
npm run server
```

### Using Plugins

Add `.kktssrrc.js` to the root directory of your project

```ts
import pluginLess from "@kkt/plugin-less"
import { Options } from "@kkt/ssr/lib/interface"

export default {

  overridesCommonWebpack: (conf:webpack.Configuration,env:"development" | "production",options:Options) => {

    const newConfig = pluginLess(conf, {
      target: conf.target==="node14"?"node":"web",
      env,
      paths: options.paths
    })

    return newConfig
  },

};

```

[See All Plugins](https://www.npmjs.com/search?q=kkt-plugin)

### Rewrite Config

Add `.kktssrrc.js` to the root directory of your project

**Rewrite Client Config**

```ts
import { Options } from "@kkt/ssr/lib/interface"

export default {

  overridesClientWebpack:(conf:webpack.Configuration,env:"development" | "production",options:Options)=>{

    return conf

  }

}
```

**Rewrite Server Config**

1. `devtool`: The default is `false`,
2. `target`: The default is `node`,
3. `output.library.type`: The default is `commonjs`,

```ts
import { Options } from "@kkt/ssr/lib/interface"

export default {

  overridesServerWebpack:(conf:webpack.Configuration,env:"development" | "production",options:Options)=>{

    return conf

  }

}
```

**More Webpack Config**

```ts
import { Options } from "@kkt/ssr/lib/interface"

export default {

  overridesWebpack:(conf:webpack.Configuration[],env:"development" | "production",options:Options)=>{

    return conf

  }

}
```

**Rewrite Env**

```js
export default {
  
  /** 环境变变量/Environmental variable */
  env:{
    GENERATE_SOURCEMAP: "false",
    INLINE_RUNTIME_CHUNK: "false",
    ESLINT_NO_DEV_ERRORS: "false",
    DISABLE_ESLINT_PLUGIN: "false",
  },
 
}
```

**Rewrite Paths**

[other paths](https://github.com/kktjs/ssr/blob/4376baf1b5c365709addb313c4dd3ee314734baa/core/src/interface.ts#L6-L30)

```js
export default {

  paths:{

    appBuild: path.join(process.cwd(),"dist")

  }

}
```

**Rewrite build output path**

1. server_path: The default is `src/server.js`.
2. client_path: The default is `src/client.js`.
3. output_path: The default is `dist`.

```ts

export default {

  /** 服务端打包入口/Server packaging entry  */
  server_path: path.join(process.cwd(),"src/server.js"),
  /** 客户端打包入口/Client packaging entry */
  client_path: path.join(process.cwd(),"src/client.js"),
  /** 输出文件地址/Output address */
  output_path: path.join(process.cwd(),"dist");

}

```

**proxySetup**

Reference [mocker-api](https://github.com/jaywcjlove/mocker-api) 

```js

export default {

  proxySetup: (app) => ({
    path: "./mocker/index.js",
    options:{
      changeHost: true,
      proxy:{

      }
    }
  }),

}

```

### DefinePlugin 

1. OUTPUT_PUBLIC_PATH: The default is `path.join(process.cwd(),"dist")` 
2. KKT_PUBLIC_DIR: The default is `process.env.KKT_PUBLIC_DIR` or `OUTPUT_PUBLIC_PATH` 
3. HOST: The default is `process.env.HOST` or `localhost`
4. PORT: The default is `process.env.PORT` or `3000`
5. HOSTAPI: The default is `undefined` ， 当运行`start`命令时值为`http://${HOST}:${PORT}`
6. process.env.PORT: 默认值 `3000`
7. process.env.HOSTAPI: The default is `undefined` ， 当运行`start`命令时值为`http://${HOST}:${PORT}`
8. process.env.HOST: The default is `localhost`

## KKTSSR Config

The root directory creates the `.kktssrrc.js` file.

|   参数    |   类型    |       默认值     |   说明    |
| -------- | -------- | --------------- | --------- |
| overridesClientWebpack | `(conf: webpack.Configuration, env: "development" \| "production", options: Options) => webpack.Configuration`  | `undefined` | 覆写客户端配置  |
| overridesServerWebpack | `(conf: webpack.Configuration, env: "development" \| "production", options: Options) => webpack.Configuration` | `undefined` | 覆写服务端配置 |
| overridesCommonWebpack | `(conf: webpack.Configuration, env: "development" \| "production", options: Options) => webpack.Configuration`| `undefined` | 公共覆盖配置 |
| overridesWebpack| `(conf: webpack.Configuration[], env: "development" \| "production", options: Options) => webpack.Configuration[] \| webpack.Configuration` | `undefined`| 最终的配置 |
| server_path | `string`  | `src/server.js` | 服务端打包入口 |
| client_path | `string`| `src/client.js` | 客户端打包入口 |
| output_path| `string` | `dist` | 输出文件地址 |
| isUseOriginalConfig| `boolean` | `false` | 是否使用原始 react-script 下的配置    |
| isUseServerConfig | `boolean` | `true` | 是否需要 server 配置 |
| paths | `Partial<Paths>` | `{}` | [paths 脚本中webpack配置 使用的地址](https://github.com/kktjs/ssr/blob/4376baf1b5c365709addb313c4dd3ee314734baa/core/src/interface.ts#L6-L30) |
| proxySetup | `(app:Application)=>({path:stirng\|string[],options:MockerOption})` | `undefined`| [mock 代理配置](https://github.com/jaywcjlove/mocker-api) |

```js
 // Modify the webpack config
export default {
  
};

```

## Example

A complete [`react + react-router + rematch(redux)`](example/react-router-rematch-old) example is recommended for production projects, similar to [next.js](https://github.com/zeit/next.js). Initialize the project from one of the examples: 

```bash
npx create-kkt-ssr my-app -e react-router-rematch
```

- [**`basic`**](example/basic) - Server-side rendering of the [react](https://github.com/facebook/react) base application.
- [**`react-router`**](example/basic-routes) - React uses server-side rendering of the [react-router](https://github.com/ReactTraining/react-router).
- [**`react-router-rematch`**](example/react-router-rematch-old) - This is a sophisticated example, similar to [next.js](https://github.com/zeit/next.js).

## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/kktjs/ssr/graphs/contributors">
  <img src="https://kktjs.github.io/ssr/CONTRIBUTORS.svg" />
</a>

Made with [github-action-contributors](https://github.com/jaywcjlove/github-action-contributors).

## License

Licensed under the MIT License
