import { WebpackConfiguration } from 'kkt';
import webpack from "webpack"

const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const lessModuleRegex = /\.module\.less$/;
const lessRegex = /\.less$/;

const getToString = (rule: RegExp) => {
  return rule.toString();
};

// loader source-map-loader
export const removeSourceMapLoader = (conf: WebpackConfiguration): WebpackConfiguration => {
  return {
    ...conf,
    module: {
      ...conf.module,
      rules: conf.module.rules.filter((rule) => !(rule !== "..." && /source-map-loader/.test(rule.loader) && /\.(js|mjs|jsx|ts|tsx|css)$/.toString() === rule.test.toString()))
    }
  }
}

// node 环境  把 css 进行处理
export const restDevModuleRuleCss = (conf: WebpackConfiguration,): WebpackConfiguration => {
  return {
    ...conf,
    plugins: conf.plugins.filter(plugin => plugin && plugin.constructor && plugin.constructor.name !== "MiniCssExtractPlugin"),
    module: {
      ...conf.module,
      rules: getModuleCSSRules(conf.module.rules,)
    },
  }
}

/**
 * 1. 去除  style-loader|mini-css-extract-plugin
 * 2. 修改 css-loader 配置
 * */
export const getModuleCSSRules = (rules: (webpack.RuleSetRule | '...')[], shouldUseSourceMap: boolean = false) => {
  const newRules: any = [];

  const cssModuleOption = (mode: "icss" | "local") => ({
    importLoaders: 3,
    sourceMap: shouldUseSourceMap,
    modules: {
      mode,
      getLocalIdent: getCSSModuleLocalIdent,
      exportOnlyLocals: true
    },
  });


  rules.forEach((rule) => {
    if (typeof rule === 'string') {
      newRules.push(rule);
      return;
    }

    if (/(style-loader|mini-css-extract-plugin)/.test(rule.loader)) {

    } else if (rule && typeof rule === 'object' && rule.test && /css-loader/.test(rule.loader) && !/postcss-loader/.test(rule.loader)) {
      const isModule = [getToString(cssModuleRegex), getToString(sassModuleRegex), getToString(lessModuleRegex),].includes(rule.test.toString())
      newRules.push({
        loader: require.resolve("css-loader"),
        options: cssModuleOption(isModule ? "local" : "icss")
      })
    } else if (rule.oneOf) {
      const newOneOf = rule.oneOf.map((item) => {
        if (
          item.test &&
          [
            getToString(cssRegex),
            getToString(cssModuleRegex),
            getToString(sassRegex),
            getToString(sassModuleRegex),
            getToString(lessModuleRegex),
            getToString(lessRegex),
          ].includes(item.test.toString())
        ) {
          const isModule = [getToString(cssModuleRegex), getToString(sassModuleRegex), getToString(lessModuleRegex),].includes(item.test.toString())
          let newUse;
          if (Array.isArray(item.use)) {
            newUse = item.use.map((ite) => {
              if (typeof ite === 'string' && /(style-loader|mini-css-extract-plugin)/.test(ite)) {
                return false
              } else if (typeof ite === 'string' && /css-loader/.test(ite) && !/postcss-loader/.test(ite)) {
                return {
                  loader: require.resolve("css-loader"),
                  options: cssModuleOption(isModule ? "local" : "icss")
                }
              } else if (typeof ite === 'object' && /(style-loader|mini-css-extract-plugin)/.test(ite.loader)) {
                return false
              } else if (typeof ite === 'object' && /css-loader/.test(ite.loader) && !/postcss-loader/.test(ite.loader)) {
                return {
                  loader: require.resolve("css-loader"),
                  options: cssModuleOption(isModule ? "local" : "icss")
                }
              }
              return ite;
            }).filter(Boolean);
          }
          return {
            ...item,
            use: newUse || [],
          };
        }
        return item;
      });
      newRules.push({ ...rule, oneOf: newOneOf });
    } else {
      newRules.push(rule);
    }
  });
  return newRules;
};

