/** @jest-environment node */
import fs from 'fs-extra';
import path from 'path';
import pkg from '../package.json';
import { helpCli, run, helpExample } from '../src/utils';

it('help test case.', async () => {
  expect(typeof helpExample).toEqual('string');
  expect(typeof helpCli).toEqual('string');
});

it('help test case.', async () => {
  const mockExit = jest.spyOn(console, 'log').mockImplementation();
  process.argv = process.argv.slice(0, 2);
  process.argv.push('my-app3');
  process.argv.push('--help');
  await import('../src/cli');
  expect(mockExit).toHaveBeenCalledWith(helpCli);
  mockExit.mockRestore();
  mockExit.mockClear();
  mockExit.mockReset();
});

it('version test case.', async () => {
  const mockExit = jest.spyOn(console, 'log').mockImplementation();
  process.argv = process.argv.slice(0, 2);
  process.argv.push('my-app4');
  process.argv.push('--version');
  await run();
  // @ts-ignore
  expect(mockExit).toHaveBeenCalledWith(
    `\n create-uiw-admin v${pkg.version}\n`,
  );
  mockExit.mockRestore();
  mockExit.mockClear();
  mockExit.mockReset();
});

it('create project. 1', async () => {
  console.log = jest.fn();
  process.argv = process.argv.slice(0, 2);
  process.argv.push('my-app2');
  process.argv.push('-f');
  process.argv.push('--output');
  process.argv.push('test');
  await run();
  expect(await fs.existsSync(path.resolve(__dirname, 'my-app2'))).toBeTruthy();
  await fs.remove('test/my-app2');
}, 10000);
