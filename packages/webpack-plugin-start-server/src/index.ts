import sysPath from 'path';
import childProcess, { ChildProcess } from 'child_process';
import webpack, { Compiler, Configuration, Entry, compilation } from 'webpack';

// Get webpack major version
const webpackMajorVersion = typeof webpack.version !== 'undefined' ? parseInt(webpack.version[0]) : 3;

export type StartServerPluginOptions = {
  entryName?: string;
  verbose?: boolean;
  once?: boolean;
  nodeArgs?: string[];
  scriptArgs?: string[];
  signal?: string | number;
  restartable?: boolean;
};

const defaultOptions: StartServerPluginOptions = {
  verbose: true, // print logs
  entryName: 'main', // What to run
  once: false, // Run once and exit when worker exits
  nodeArgs: [], // Node arguments for worker
  scriptArgs: [], // Script arguments for worker
  signal: 0, // Send a signal instead of a message
  // Only listen on keyboard in development, so the server doesn't hang forever
  restartable: process.env.NODE_ENV === 'development',
};

export default class StartServerPlugin {
  options: StartServerPluginOptions;
  worker: ChildProcess;
  workerLoaded: boolean;
  scriptFile: string;
  constructor(options: StartServerPluginOptions) {
    this.options = { ...defaultOptions, ...options };
    if (!Array.isArray(this.options.scriptArgs)) {
      throw new Error('options.scriptArgs has to be an array of strings');
    }
    if (this.options.signal === 1) {
      this.options.signal = 'SIGUSR2';
    }
    this.apply = this.apply.bind(this);
    this.afterEmit = this.afterEmit.bind(this);
    this.getScripts = this.getScripts.bind(this);
    this._handleChildError = this._handleChildError.bind(this);
    this._handleChildExit = this._handleChildExit.bind(this);
    this._handleChildMessage = this._handleChildMessage.bind(this);
    this.worker = null;
    if (this.options.restartable && !options.once) {
      this._enableRestarting();
    }
  }
  apply(compiler: Compiler) {
    const plugin = { name: 'StartServerPlugin' };
    if (webpackMajorVersion >= 4 && webpackMajorVersion < 5) {
      compiler.options.entry = this.amendEntry(compiler.options.entry);
    }
    compiler.hooks.afterEmit.tapAsync(plugin, this.afterEmit);
  }

  _info(msg: string, ...args: any) {
    if (this.options.verbose) console.log(`\x1b[1;34m[SSWP]> \x1b[0m${msg}`, ...args);
  }
  _error(msg: string, ...args: any) {
    console.error(`\x1b[1;31m[SSWP]> \x1b[0m!!! ${msg}`, ...args);
  }
  _worker_error(msg: string) {
    process.stderr.write(msg);
  }
  _worker_info(msg: string) {
    process.stdout.write(msg);
  }
  _handleChildError(err: Error) {
    this.worker = null;
  }
  _handleChildMessage(message: childProcess.Serializable) {
    if (message === 'SSWP_LOADED') {
      this.workerLoaded = true;
      this._info('Script loaded');
      if (process.env.NODE_ENV === 'test' && this.options.once) {
        process.kill(this.worker.pid);
      }
    } else if (message === 'SSWP_HMR_FAIL') {
      this.workerLoaded = false;
    }
  }
  _enableRestarting() {
    this._info('Type `rs<Enter>` to restart the worker');
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (data) => {
      if (data.toString().trim() === 'rs') {
        if (this.worker) {
          this._info('Killing worker...');
          process.kill(this.worker.pid);
        } else {
          this._runWorker();
        }
      }
    });
  }

  _getExecArgv() {
    const { nodeArgs } = this.options;
    const execArgv = (nodeArgs || []).concat(process.execArgv);
    return execArgv;
  }
  _getMonitor() {
    const loaderPath = require.resolve('./monitor-loader');
    return `!!${loaderPath}!${loaderPath}`;
  }
  _hmrWorker(compilation: compilation.Compilation, callback: any) {
    const {
      worker,
      options: { signal },
    } = this;
    if (signal) {
      process.kill(worker.pid, signal);
    } else if (worker.send) {
      worker.send('SSWP_HMR');
    } else {
      this._error('hot reloaded but no way to tell the worker');
    }
    callback();
  }
  _runWorker(callback?: () => void) {
    if (this.worker) return;
    const {
      scriptFile,
      options: { scriptArgs },
    } = this;

    const execArgv = this._getExecArgv();
    const extScriptArgs = ['--color', '--ansi', ...scriptArgs];

    if (this.options.verbose) {
      const cmdline = [...execArgv, scriptFile, '--', ...extScriptArgs].join(' ');
      this._info(`running \`node ${cmdline}\``);
    }

    const worker = childProcess.fork(scriptFile, extScriptArgs, {
      execArgv,
      silent: true,
      env: Object.assign(process.env, { FORCE_COLOR: 3 }),
    });
    worker.once('exit', this._handleChildExit);
    worker.once('error', this._handleChildError);
    worker.on('message', this._handleChildMessage);
    worker.stdout.on('data', this._worker_info);
    worker.stderr.on('data', this._worker_error);

    this.worker = worker;

    if (callback) callback();
  }
  _handleChildExit(code: number, signal: NodeJS.Signals) {
    if (code) this._error('script exited with code', code);
    if (signal && signal !== 'SIGTERM') this._error('script exited after signal', signal);

    this.worker = null;

    if (!this.workerLoaded) {
      this._error('Script did not load, or HMR failed; not restarting');
      return;
    }
    if (this.options.once) {
      this._info('Only running script once, as requested');
      return;
    }

    this.workerLoaded = false;
    this._runWorker();
  }
  getScripts(compilation: compilation.Compilation) {
    const { entryName } = this.options;
    return compilation.assets[`${entryName}.js`].existsAt;
    // const entrypoints = compilation.entrypoints;
    // const entry = entrypoints.get ? entrypoints.get(entryName) : (entrypoints as any)[entryName];
    // if (!entry) {
    //   this._info('compilation: %O', compilation);
    //   throw new Error(
    //     `Requested entry "${entryName}" does not exist, try one of: ${(entrypoints.keys
    //       ? Object.keys(entrypoints.entries())
    //       : Object.keys(entrypoints)
    //     ).join(' ')}`,
    //   );
    // }

    // const runtimeChunk = (webpack as any).EntryPlugin && (entry.runtimeChunk || entry._entrypointChunk);
    // const runtimeChunkFiles = runtimeChunk && runtimeChunk.files && runtimeChunk.files.values();

    // const entryScript = (runtimeChunkFiles && runtimeChunkFiles.next().value) || ((entry.chunks[0] || {}).files || [])[0];
    // if (!entryScript) {
    //   this._error('Entry chunk not outputted: %O', entry);
    //   return;
    // }
    // const { path } = compilation.outputOptions;
    // return sysPath.resolve(path, entryScript);
  }
  afterEmit(compilation: compilation.Compilation, callback: any) {
    this.scriptFile = this.getScripts(compilation);

    if (this.worker) {
      return this._hmrWorker(compilation, callback);
    }

    if (!this.scriptFile) return;

    this._runWorker(callback);
  }
  amendEntry(entry: Configuration['entry']): Configuration['entry'] {
    if (typeof entry === 'function')
      return (...args: any) => Promise.resolve((entry as any)(...args)).then(this.amendEntry.bind(this));
    const monitor = this._getMonitor();
    if (typeof entry === 'string') return [entry, monitor];
    if (Array.isArray(entry)) return [...entry, monitor];
    if (typeof entry === 'object') {
      return Object.assign({}, entry, {
        [this.options.entryName]: this.amendEntry(entry[this.options.entryName]),
      });
    }
    throw new Error(`Cannot parse webpack \`entry\` option: %O  ${entry}`);
  }
}
