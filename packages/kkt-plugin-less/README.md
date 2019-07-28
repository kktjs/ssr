@kkt/plugin-less
---

This package contains a plugin for using [Less](https://github.com/less/less.js) with [@kkt/ssr](https://github.com/kktjs/kkt-ssr).


## Usage in @kkt/ssr Projects

```bash
npm add @kkt/plugin-less --dev
```

### With the default options

```js
// .kktrc.js
module.exports = {
  plugins: [
    require.resolve('@kkt/plugin-less'),
  ],
};
```
