const PATH = require('path');
const FS = require('fs');
const url = require('url');

// 确保在项目文件夹中的任何符号都解决了：
const appDirectory = FS.realpathSync(process.cwd());
const resolveApp = relativePath => PATH.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;
const getPublicUrl = appPackageJson => envPublicUrl || require(appPackageJson).homepage; // eslint-disable-line


function ensureSlash(inputPath, needsSlash) {
  const hasSlash = inputPath.endsWith('/');
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  } else {
    return inputPath;
  }
}

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl = envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}

const resolveOwn = relativePath => PATH.resolve(__dirname, '..', relativePath);

module.exports = {
  resolveApp,
  appDirectory,
  dotenv: resolveApp('.env'),
  appPublicPath: '/',
  appNodeModules: resolveApp('node_modules'),
  ownNodeModules: resolveOwn('node_modules'),
  appPublic: resolveApp('public'),
  appPath: resolveApp('.'),
  appSrc: resolveApp('src'),
  appKKTRC: resolveApp('.kktrc.js'),
  appServerIndexJs: resolveApp('src'),
  appClientIndexJs: resolveApp('src/client'),
  appBuildPublic: resolveApp('dist/public'),
  appManifest: resolveApp('dist/assets.json'),
  appBuildDist: resolveApp('dist'),
  appPackageJson: resolveApp('package.json'),
  appTsConfig: resolveApp('tsconfig.json'),
  appIndex: resolveApp('src/index.js'),
  appBabelRc: resolveApp('.babelrc'),
  defaultHTMLPath: resolveApp('public/index.html'),
  defaultFaviconPath: resolveApp('public/favicon.ico'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
  testsSetup: resolveApp('src/setupTests.js'),
};

module.exports.moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];
