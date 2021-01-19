import webpack, { Plugin } from 'webpack';

export default (plugins: webpack.Plugin[], regexp: RegExp, callback?: (plugin: Plugin) => Plugin | false): Plugin[] => {
  return plugins
    .map((item) => {
      if (item.constructor && item.constructor.name && regexp.test(item.constructor.name)) {
        return callback ? callback(item) : false;
      }
      return item;
    })
    .filter((x) => x) as Plugin[];
};
