const fs = require('fs');
const path = require('path');
const url = require('url');

function buildManifest(compiler, compilation, options) {
  const context = compiler.options.context;
  const manifest = {};

  compilation.chunks.forEach((chunk) => {
    chunk.files.forEach((file) => {
      chunk.forEachModule((module) => {
        const id = module.id;
        const name = typeof module.libIdent === 'function' ? module.libIdent({ context }) : null;
        const publicPath = url.resolve(compilation.outputOptions.publicPath || '', file);

        let currentModule = module;
        if (module.constructor.name === 'ConcatenatedModule') {
          currentModule = module.rootModule;
        }
        if (!manifest[currentModule.rawRequest]) {
          manifest[currentModule.rawRequest] = [];
        }

        // Deduplication
        const isUnique = manifest[currentModule.rawRequest].filter(item => item.id === id && item.name === name && item.file === file && item.publicPath === publicPath);
        if (isUnique.length === 0) {
          manifest[currentModule.rawRequest].push({ id, name, file, publicPath });
        }
      });
    });
  });
  // exclude some data
  if (options.exclude) {
    Object.keys(manifest).forEach((key) => {
      if (options.exclude.test(key)) {
        delete manifest[key];
      }
    });
  }

  return manifest;
}

class DynamicLoadablePlugin {
  constructor(opts = {}) {
    this.filename = opts.filename;
    this.exclude = opts.exclude; // It is a regular expression
    this.options = opts;
  }

  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      const manifest = buildManifest(compiler, compilation, this.options);
      const json = JSON.stringify(manifest, null, 2);
      const outputDirectory = path.dirname(this.filename);
      try {
        fs.mkdirSync(outputDirectory);
      } catch (err) {
        if (err.code !== 'EEXIST') {
          throw err;
        }
      }
      fs.writeFileSync(this.filename, json);
      callback();
    });
  }
}

function getBundles(manifest, moduleIds) {
  return moduleIds.reduce((bundles, moduleId) => {
    return bundles.concat(manifest[moduleId]);
  }, []);
}

exports.DynamicLoadablePlugin = DynamicLoadablePlugin;
exports.getBundles = getBundles;
