import webpack from 'webpack';
import { regexSame } from './utils';

export default (rules: webpack.RuleSetRule[]) => {
  return rules.map((rule) => {
    if (rule.oneOf) {
      rule.oneOf = rule.oneOf
        .map((item) => {
          if (regexSame(/\.(js|mjs|jsx|ts|tsx)$/, item.test as RegExp) && /babel-loader/.test(item.loader.toString())) {
            if (item.options && (item.options as any).plugins) {
              const plugs = (item.options as any).plugins.map((plug: (string | (string | { loaderMap: any })[])[]) => {
                if (typeof plug === 'string' && /react-refresh/.test(plug)) {
                  return false;
                }
                return plug;
              });
              (item.options as any).plugins = plugs.filter(Boolean);
            }
            return item;
          }
          // if (regexSame(/\.(js|mjs)$/, item.test as RegExp) && /babel-loader/.test(item.loader.toString())) {
          //   return false;
          // }
          // if (regexSame(/\.css$/, item.test as RegExp)) {
          //   return false;
          // }
          // if (regexSame(/\.module\.css$/, item.test as RegExp)) {
          //   return false;
          // }
          // if (regexSame(/\.(scss|sass)$/, item.test as RegExp)) {
          //   return false;
          // }
          // if (regexSame(/\.module\.(scss|sass)$/, item.test as RegExp)) {
          //   return false;
          // }
          return item;
        })
        .filter((x) => x);
    }
    return rule;
  });
};
