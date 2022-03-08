@kkt/plugin-scss
---

This package contains a plugin for using [SCSS/SASS](https://sass-lang.com/) with [@kkt/ssr](https://github.com/kktjs/ssr).

## Usage in @kkt/ssr Projects

```bash
npm add @kkt/plugin-scss --dev
```

### With the default options

```js
// .kktrc.js
module.exports = {
  plugins: [
    require.resolve('@kkt/plugin-scss'),
  ],
};
```
