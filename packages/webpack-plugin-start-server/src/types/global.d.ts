declare namespace __WebpackModuleApi {
  interface Module {
    exports: any;
    id: string;
    filename: string;
    loaded: boolean;
    parent: NodeModule | null | undefined;
    children: NodeModule[];
    hot?: Hot;
  }
  type ModuleId = string | number;
  interface HotNotifierInfo {
    type:
      | 'self-declined'
      | 'declined'
      | 'unaccepted'
      | 'accepted'
      | 'disposed'
      | 'accept-errored'
      | 'self-accept-errored'
      | 'self-accept-error-handler-errored';
    /**
     * The module in question.
     */
    moduleId: number;
    /**
     * For errors: the module id owning the accept handler.
     */
    dependencyId?: number;
    /**
     * For declined/accepted/unaccepted: the chain from where the update was propagated.
     */
    chain?: number[];
    /**
     * For declined: the module id of the declining parent
     */
    parentId?: number;
    /**
     * For accepted: the modules that are outdated and will be disposed
     */
    outdatedModules?: number[];
    /**
     * For accepted: The location of accept handlers that will handle the update
     */
    outdatedDependencies?: {
      [dependencyId: number]: number[];
    };
    /**
     * For errors: the thrown error
     */
    error?: Error;
    /**
     * For self-accept-error-handler-errored: the error thrown by the module
     * before the error handler tried to handle it.
     */
    originalError?: Error;
  }
  interface AcceptOptions {
    /**
     * If true the update process continues even if some modules are not accepted (and would bubble to the entry point).
     */
    ignoreUnaccepted?: boolean;
    /**
     * Ignore changes made to declined modules.
     */
    ignoreDeclined?: boolean;
    /**
     *  Ignore errors throw in accept handlers, error handlers and while reevaluating module.
     */
    ignoreErrored?: boolean;
    /**
     * Notifier for declined modules.
     */
    onDeclined?: (info: HotNotifierInfo) => void;
    /**
     * Notifier for unaccepted modules.
     */
    onUnaccepted?: (info: HotNotifierInfo) => void;
    /**
     * Notifier for accepted modules.
     */
    onAccepted?: (info: HotNotifierInfo) => void;
    /**
     * Notifier for disposed modules.
     */
    onDisposed?: (info: HotNotifierInfo) => void;
    /**
     * Notifier for errors.
     */
    onErrored?: (info: HotNotifierInfo) => void;
    /**
     * Indicates that apply() is automatically called by check function
     */
    autoApply?: boolean;
  }

  interface Hot {
    /**
     * Accept code updates for the specified dependencies. The callback is called when dependencies were replaced.
     * @param dependencies
     * @param callback
     */
    accept(dependencies: string[], callback?: (updatedDependencies: ModuleId[]) => void): void;
    /**
     * Accept code updates for the specified dependencies. The callback is called when dependencies were replaced.
     * @param dependency
     * @param callback
     */
    accept(dependency: string, callback?: () => void): void;
    /**
     * Accept code updates for this module without notification of parents.
     * This should only be used if the module doesn’t export anything.
     * The errHandler can be used to handle errors that occur while loading the updated module.
     * @param errHandler
     */
    accept(errHandler?: (err: Error) => void): void;
    /**
     * Do not accept updates for the specified dependencies. If any dependencies is updated, the code update fails with code "decline".
     */
    decline(dependencies: string[]): void;
    /**
     * Do not accept updates for the specified dependencies. If any dependencies is updated, the code update fails with code "decline".
     */
    decline(dependency: string): void;
    /**
     * Flag the current module as not update-able. If updated the update code would fail with code "decline".
     */
    decline(): void;
    /**
     * Add a one time handler, which is executed when the current module code is replaced.
     * Here you should destroy/remove any persistent resource you have claimed/created.
     * If you want to transfer state to the new module, add it to data object.
     * The data will be available at module.hot.data on the new module.
     * @param callback
     */
    dispose(callback: (data: any) => void): void;
    dispose(callback: <T>(data: T) => void): void;
    /**
     * Add a one time handler, which is executed when the current module code is replaced.
     * Here you should destroy/remove any persistent resource you have claimed/created.
     * If you want to transfer state to the new module, add it to data object.
     * The data will be available at module.hot.data on the new module.
     * @param callback
     */
    addDisposeHandler(callback: (data: any) => void): void;
    addDisposeHandler<T>(callback: (data: T) => void): void;
    /**
     * Remove a handler.
     * This can useful to add a temporary dispose handler. You could i. e. replace code while in the middle of a multi-step async function.
     * @param callback
     */
    removeDisposeHandler(callback: (data: any) => void): void;
    removeDisposeHandler<T>(callback: (data: T) => void): void;
    /**
     * Throws an exceptions if status() is not idle.
     * Check all currently loaded modules for updates and apply updates if found.
     * If no update was found, the callback is called with null.
     * If autoApply is truthy the callback will be called with all modules that were disposed.
     * apply() is automatically called with autoApply as options parameter.
     * If autoApply is not set the callback will be called with all modules that will be disposed on apply().
     * @param autoApply
     * @param callback
     */
    check(
      autoApply?: boolean,
      callback?: (err: Error, outdatedModules: ModuleId[]) => void,
    ): Promise<{ updatedModules: any }>;
    /**
     * Throws an exceptions if status() is not idle.
     * Check all currently loaded modules for updates and apply updates if found.
     * If no update was found, the callback is called with null.
     * The callback will be called with all modules that will be disposed on apply().
     * @param callback
     */
    check(callback: (err: Error, outdatedModules: ModuleId[]) => void): void;
    /**
     * If status() != "ready" it throws an error.
     * Continue the update process.
     * @param options
     * @param callback
     */
    apply(
      options: AcceptOptions,
      callback?: (err: Error, outdatedModules: ModuleId[]) => void,
    ): Promise<{ renewedModules: any }>;
    // /**
    //  * If status() != "ready" it throws an error.
    //  * Continue the update process.
    //  * @param callback
    //  */
    // apply(callback: (err: Error, outdatedModules: ModuleId[]) => void): void;
    /**
     * Return one of idle, check, watch, watch-delay, prepare, ready, dispose, apply, abort or fail.
     */
    status(): string;
    /** Register a callback on status change. */
    status(callback: (status: string) => void): void;
    /** Register a callback on status change. */
    addStatusHandler(callback: (status: string) => void): void;
    /**
     * Remove a registered status change handler.
     * @param callback
     */
    removeStatusHandler(callback: (status: string) => void): void;

    active: boolean;
    data: any;
  }
}

/**
 * Declare process variable
 */
declare namespace NodeJS {
  interface Module extends __WebpackModuleApi.Module {}
}
declare var process: NodeJS.Process;
