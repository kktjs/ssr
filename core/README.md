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
npm run watch # Watch file
npm run server # Start service
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

To debug the node server, you can use `react-ssr start --inspect-brk`. This will start the node server, enable the inspector agent and Break before user code starts. For more information, see [this](https://nodejs.org/en/docs/inspector/).

### Using Plugins

You can use plug-ins, taking KKT as an example
Add `.kktrc.js` to the root directory of your project

**use SSRWebpackRunPlugin**

```js
import { restWebpackManifestPlugin, getRemoveHtmlTemp, SSRWebpackRunPlugin } from '@kkt/ssr/lib/plugins';

export default (conf, evn) => {
   // client ，
  if (!options.bundle) {
    conf.plugins.push(new SSRWebpackRunPlugin());
    conf.plugins = getRemoveHtmlTemp(conf.plugins)
    conf = restWebpackManifestPlugin(conf);
  }
  conf.module.exprContextCritical = false;
  return conf;
};

```

[See All Plugins](https://www.npmjs.com/search?q=kkt-plugin)


### Rewrite Config

Add `.kktssrrc.js` to the root directory of your project

**Rewrite Client Config**

```js
export default {
  overridesClientWebpack:(conf,env)=>{
    return conf
  }
}
```

**Rewrite Server Config**

> Default devtool value `false`, Default target value `node`, Default output.library.type value `commonjs`,

```js
export default {
  overridesServerWebpack:(conf,env)=>{
    return conf
  }
}
```

**More Webpack Config**

```js
export default {
  overridesWebpack:(conf,env)=>{
    return conf
  }
}
```

**Rewrite Env**

```js
export default {
   /** 环境变变量 */
  GENERATE_SOURCEMAP: "false",
  INLINE_RUNTIME_CHUNK: "false",
  ESLINT_NO_DEV_ERRORS: "false",
  DISABLE_ESLINT_PLUGIN: "false",
}
```

**Rewrite Paths**

```js
export default {
  paths:{
    appBuild: path.join(process.cwd(),"dist")
  }
}
```

**Rewrite build output path**

> server_path: Default value `src/server.js`.
> client_path: Default value `src/client.js`.
> output_path: Default value `dist`.

```js
export default {
    /** 服务端打包入口 */
  server_path: path.join(process.cwd(),"src/server.js"),
  /** 客户端打包入口 */
  client_path: path.join(process.cwd(),"src/client.js"),
  /** 输出文件地址 */
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

**Rewrite watchOptions**

```js
export default {
  watchOptions:{}
}
```

### DefinePlugin 

OUTPUT_PUBLIC_PATH：Default value `path.join(process.cwd(),"dist")`

## KKTSSR Config

The root directory creates the `.kktssrrc.js` file.

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
