import webpack from 'webpack';
import { regexSame } from './utils';

export default (rules: webpack.RuleSetRule[]) => {
  return rules.map((rule) => {
    if (rule.oneOf) {
      rule.oneOf = rule.oneOf
        .map((item) => {
          if (regexSame(/\.css$/, item.test as RegExp)) {
            console.log('item.test|css>>>', item);
            return {
              test: /\.css$/,
              exclude: /\.module\.css$/,
              use: [
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                    modules: {
                      auto: true,
                      localIdentName: '[name]__[local]___[hash:base64:5]',
                    },
                    // exportOnlyLocals: true,
                  },
                },
              ],
            };
          }
          if (
            regexSame(/\.(scss|sass)$/, item.test as RegExp) ||
            regexSame(/\.module\.(scss|sass)$/, item.test as RegExp)
          ) {
            // console.log('item.test|scss|sass>>>', item)
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
