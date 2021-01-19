import fs from 'fs';
import path from 'path';

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
