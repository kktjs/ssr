import fs from 'fs';
import path from 'path';
import webpack from 'webpack';

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
export const appDirectory = fs.realpathSync(process.cwd());
export const resolveApp = (relativePath: string) => path.resolve(appDirectory, relativePath);

/**
 * Compare regular expressions
 *
 * `regexSame(/a$/, /a$/)` => true
 */
export function regexSame(r1: RegExp, r2: RegExp) {
  return (
    r1 instanceof RegExp &&
    r2 instanceof RegExp &&
    r1.source === r2.source &&
    r1.flags.split('').sort().join('') === r2.flags.split('').sort().join('')
  );
}

/**
 * Webpack compile in a try-catch
 * @param config
 */
export function compile(config: webpack.Configuration): webpack.Compiler {
  let compiler = undefined;
  try {
    compiler = webpack(config);
  } catch (e) {
    console.log('\x1b[31m Failed to compile.\x1b[0m', [e], '-- verbose --');
    process.exit(1);
  }
  return compiler;
}
