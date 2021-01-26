import { WebpackManifestPlugin, FileDescriptor } from 'webpack-manifest-plugin';
import { Plugin } from 'webpack';
import path from 'path';

type ManifestPluginOptions = {
  fileName: string;
  publicUrlOrPath: string;
};

export default (opts: ManifestPluginOptions): Plugin => {
  const { fileName, publicUrlOrPath } = opts || {};
  // Output all files in a manifest file called assets-manifest.json
  // in the build directory.
  return new WebpackManifestPlugin({
    fileName,
    publicPath: publicUrlOrPath,
    generate: (seed, files, entrypoints) => {
      const manifestFiles = files.reduce((manifest: any, file) => {
        manifest[file.name] = file.path;
        return manifest;
      }, seed);
      const entrypointFiles = entrypoints.main.filter((fileName) => !fileName.endsWith('.map'));

      return {
        files: manifestFiles,
        entrypoints: entrypointFiles,
      };
    },
  });
};
