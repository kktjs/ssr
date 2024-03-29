import path from 'path';
import fs from 'fs';
import { Paths } from "./../interface"

export const appDirectory = fs.realpathSync(process.cwd());

export const resolveApp = (relativePath: string) => path.resolve(appDirectory, relativePath);

export const reactScripts = path.join(require.resolve('react-scripts/package.json'), '..');

export const paths: Paths = require(`${reactScripts}/config/paths`);

export const moduleFileExtensions: string[] = paths.moduleFileExtensions || [];

export const devServerConfigPath = `${reactScripts}/config/webpackDevServer.config`

export const webpackConfigPath = `${reactScripts}/config/webpack.config`

export const reactDevUtils = path.join(require.resolve('react-dev-utils/package.json'), '..');

// Resolve file paths in the same order as webpack
export const resolveModule = (resolveFn: { (relativePath: string): string; (arg0: string): fs.PathLike; }, filePath: string) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

