const fs = require('fs');
const color = require('colors-cli/safe');
const paths = require('./');

module.exports = (resolve, rootDir) => {
  // Use this instead of `paths.testsSetup` to avoid putting
  // an absolute filename into configuration after ejecting.
  const setupTestsFile = fs.existsSync(paths.testsSetup)
    ? '<rootDir>/src/setupTests.js'
    : undefined;

  // TODO: I don't know if it's safe or not to just use / as path separator
  // in Jest configs. We need help from somebody with Windows to determine this.
  const config = {
    collectCoverageFrom: [
      'src/**/*.{js,jsx,ts,tsx}',
      '!src/**/*.d.ts',
    ],
    setupTestFrameworkScriptFile: setupTestsFile,
    testMatch: [
      '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
      '<rootDir>/src/**/?(*.)(spec|test).{js,jsx,ts,tsx}',
    ],
    testEnvironment: 'node',
    // testEnvironment: 'jsdom',
    testURL: 'http://localhost',
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': resolve('conf/jest/babelTransform.js'),
      '^.+\\.css$': resolve('conf/jest/cssTransform.js'),
      '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': resolve('conf/jest/fileTransform.js'),
    },
    transformIgnorePatterns: [
      '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
      '^.+\\.module\\.(css|sass|scss|less)$',
    ],
    moduleNameMapper: {
      '^react-native$': 'react-native-web',
      '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    },
  };
  if (rootDir) {
    config.rootDir = rootDir;
  }
  // eslint-disable-next-line
  const overrides = Object.assign({}, require(paths.appPackageJson).jest);
  const supportedKeys = [
    'collectCoverageFrom',
    'coverageReporters',
    'coverageThreshold',
    'globals',
    'mapCoverage',
    'moduleFileExtensions',
    'moduleNameMapper',
    'modulePaths',
    'snapshotSerializers',
    'setupFiles',
    'testMatch',
    'testEnvironmentOptions',
    'testResultsProcessor',
    'transform',
    'transformIgnorePatterns',
    'reporters',
  ];
  if (overrides) {
    supportedKeys.forEach((key) => {
      // eslint-disable-next-line
      if (overrides.hasOwnProperty(key)) {
        config[key] = overrides[key];
        delete overrides[key];
      }
    });
    const unsupportedKeys = Object.keys(overrides);
    if (unsupportedKeys.length) {
      /* eslint-disable */
      console.error(
        color.red(
          'Out of the box, kkt-ssr only supports overriding ' +
          'these Jest options:\n\n' +
          supportedKeys.map(key => color.bold('  \u2022 ' + key)).join('\n') +
          '.\n\n' +
          'These options in your package.json Jest configuration ' +
          'are not currently supported by kkt-ssr:\n\n' +
          unsupportedKeys.map(key => color.bold('  \u2022 ' + key)).join('\n')
        )
      );
      /* eslint-enable */
      process.exit(1);
    }
  }
  return config;
};
