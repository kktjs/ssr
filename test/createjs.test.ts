import fs from 'fs';
import path from 'path';

it('js案例项目生成测试1', async () => {
  const srcDir = path.resolve(process.cwd(), 'examplejs', 'basic', 'src');
  expect(fs.existsSync(srcDir)).toBeTruthy();
  const fileNames = fs.readdirSync(srcDir);
  expect(fileNames).toContain('client.js');
});
it('js案例项目生成测试2', async () => {
  const srcDir = path.resolve(process.cwd(), 'examplejs', 'basic-routes', 'src');
  expect(fs.existsSync(srcDir)).toBeTruthy();
  const fileNames = fs.readdirSync(srcDir);
  expect(fileNames).toContain('client.js');
});

it('js案例项目生成测试3', async () => {
  const srcDir = path.resolve(process.cwd(), 'examplejs', 'basic-routes-rematch-new', 'src');
  expect(fs.existsSync(srcDir)).toBeTruthy();
  const fileNames = fs.readdirSync(srcDir);
  expect(fileNames).toContain('client.js');
});

it('js案例项目生成测试4', async () => {
  const srcDir = path.resolve(process.cwd(), 'examplejs', 'react-router-rematch-old', 'src');
  expect(fs.existsSync(srcDir)).toBeTruthy();
  const fileNames = fs.readdirSync(srcDir);
  expect(fileNames).toContain('client.js');
});

it('js案例项目生成测试5', async () => {
  const srcDir = path.resolve(process.cwd(), 'examplejs', 'basic-plugins', 'src');
  expect(fs.existsSync(srcDir)).toBeTruthy();
  const fileNames = fs.readdirSync(srcDir);
  expect(fileNames).toContain('index.js');
});
