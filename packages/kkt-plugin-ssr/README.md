@kkt/plugin-ssr
---

### Install

```bash

npm install @kkt/plugin-ssr -D

```

### Using Plugins

You can use plug-ins, taking KKT as an example
Add `.kktrc.js` to the root directory of your project

**use WebpackPluginSSR**

***Example one***

```js
import WebpackPluginSSRProps, { clearHtmlTemp, createNewWebpackManifestPlugin } from '@kkt/plugin-ssr';

export default (conf, env) => {
  const paths = require("react-scripts/config/paths")
  conf.plugins.push(new WebpackPluginSSRProps());
  conf.plugins.push(createNewWebpackManifestPlugin(paths, "client", env === "development"));
  conf = clearHtmlTemp(conf)
  conf.module.exprContextCritical = false;
  return conf;
};

```

***Example two***

```js
import WebpackPluginSSRProps, { clearHtmlTemp, createNewWebpackManifestPlugin } from '@kkt/plugin-ssr';

export default (conf, env) => {
  const paths = require("react-scripts/config/paths")
  conf.plugins.push(new WebpackPluginSSRProps({
    // ... 其他参数 参照:https://webpack.docschina.org/configuration
    /** 最终配置  */ 
    overridesWebpack:(conf)=>{
      return conf
    }
  }));
  conf.plugins.push(createNewWebpackManifestPlugin(paths, "client", env === "development"));
  conf = clearHtmlTemp(conf)
  conf.module.exprContextCritical = false;
  return conf;
};

```
 `WebpackPluginSSRProps` plugin 部分参数参照[webpack](https://webpack.docschina.org/configuration)

**clearHtmlTemp**

清理 html 模板 相关的 plugin 

**createNewWebpackManifestPlugin**

重置 `Webpack-Manifest-Plugin` 

**removeSourceMapLoader**

去除 source-map-loader 

**AddWbpackBarPlugins** 

新增 进度条 ,相关[api](https://www.npmjs.com/package/webpackbar)


**getModuleCSSRules** 

对 css方面的规则进行处理，去除 `style-loader|mini-css-extract-plugin` ,修改 `css-loader` 用以适配 server 端 

## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/kktjs/ssr/graphs/contributors">
  <img src="https://kktjs.github.io/ssr/CONTRIBUTORS.svg" />
</a>

Made with [github-action-contributors](https://github.com/jaywcjlove/github-action-contributors).

## License

Licensed under the MIT License
