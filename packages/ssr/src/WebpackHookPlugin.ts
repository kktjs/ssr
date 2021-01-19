import { Compiler } from 'webpack';

type HookPluginOptions = {
  onAfterEmit?: (count: number) => void;
};

const defaultOptions: HookPluginOptions = {
  onAfterEmit: () => {},
};

let afterEmitCount = 0;

class WebpackHookPlugin {
  options: HookPluginOptions;
  constructor(options: HookPluginOptions) {
    this.options = { ...defaultOptions, ...options };
  }
  apply(compiler: Compiler) {
    compiler.hooks.afterEmit.tapAsync('WebpackHookPlugin', (compilation, callback) => {
      afterEmitCount += 1;
      this.options.onAfterEmit(afterEmitCount);
      callback();
    });
  }
}

export default WebpackHookPlugin;
