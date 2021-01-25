import { Compiler, Stats } from 'webpack';

type HookPluginOptions = {
  onAfterEmit?: (count: number, callback: () => void) => void;
  onDone?: (stats: Stats) => void;
  onDonePromise?: (stats: Stats, count: number) => Promise<any>;
};

const defaultOptions: HookPluginOptions = {};

let afterEmitCount = 0;
let donePromiseCount = 0;

class WebpackHookPlugin {
  options: HookPluginOptions;
  constructor(options: HookPluginOptions) {
    this.options = { ...defaultOptions, ...options };
  }
  apply(compiler: Compiler) {
    const { onAfterEmit, onDonePromise } = this.options;
    compiler.hooks.afterEmit.tapAsync('WebpackHookPlugin', (compilation, callback: () => void) => {
      afterEmitCount += 1;
      if (!onAfterEmit) {
        return callback();
      }
      this.options.onAfterEmit(afterEmitCount, callback);
    });
    compiler.hooks.done.tapPromise('WebpackHookPlugin', (stats: Stats) => {
      donePromiseCount += 1;
      if (!onDonePromise) {
        return new Promise((resolve) => resolve(stats));
      }
      return onDonePromise(stats, donePromiseCount);
    });
  }
}

export default WebpackHookPlugin;
