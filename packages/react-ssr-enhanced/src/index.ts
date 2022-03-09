
export { default as Document } from './Document';
export * from './Document';
import RoutersController from './RoutersController';
import ensureReady from './ensureReady';
import render from './render';
import { loadInitialProps } from './loadInitialProps';

/** 问题
 * 1. 页面的 store 状态调用问题
 * 2. 懒加载页面问题
 * 3. 懒加载 store
 * */

export {
  render,
  RoutersController,
  ensureReady,
  loadInitialProps,
};
