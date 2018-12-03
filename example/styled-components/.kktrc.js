const path = require('path');

module.exports = {
  // Modify the webpack config
  config: (conf, { target, dev, env, ...props }, webpack) => {
    // https://www.styled-components.com/docs/faqs#duplicated-module-in-node_modules
    // If you are using webpack, you can change the way it will resolve the styled-components module.
    // You can overwrite the default order in which webpack will look for your dependencies and
    // make your application node_modules more prioritized than default node module resolution order:
    // conf.resolve.alias['styled-components'] = path.resolve(props.appNodeModules, 'styled-components');
    return conf;
  },
};
