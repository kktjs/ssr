import { WebpackManifestPlugin, FileDescriptor } from 'webpack-manifest-plugin';
import { Plugin } from 'webpack';
import path from 'path';

type ManifestPluginOptions = {
  fileName: string;
  config: any;
};

export default (opts: ManifestPluginOptions): Plugin => {
  const { fileName, config } = opts || {};
  // Output all files in a manifest file called assets-manifest.json
  // in the build directory.
  return new WebpackManifestPlugin({
    fileName: fileName,
    writeToFileEmit: true,
    generate: (seed, files: FileDescriptor[]) => {
      const entrypoints = new Set();
      const noChunkFiles = new Set();
      files.forEach((file: FileDescriptor) => {
        if (file.isChunk) {
          ((file.chunk || {})._groups || []).forEach((group: any) => {
            entrypoints.add(group);
          });
        } else {
          noChunkFiles.add(file);
        }
      });
      const entries: any[] = [...entrypoints];
      const entryArrayManifest = entries.reduce((acc, entry) => {
        const name = (entry.options || {}).name || (entry.runtimeChunk || {}).name || entry.id;
        const allFiles = []
          .concat(
            ...(entry.chunks || []).map((chunk: any) =>
              chunk.files.map((path: string) => config.output.publicPath + path),
            ),
          )
          .filter(Boolean);

        const filesByType = allFiles.reduce((types, file) => {
          const fileType = file.slice(file.lastIndexOf('.') + 1);
          types[fileType] = types[fileType] || [];
          types[fileType].push(file);
          return types;
        }, {});

        const chunkIds = [].concat(...(entry.chunks || []).map((chunk: any) => chunk.ids));
        return name ? { ...acc, [name]: { ...filesByType, chunks: chunkIds } } : acc;
      }, seed);
      entryArrayManifest['noentry'] = [...noChunkFiles]
        .map((file: any) => file.path)
        .reduce((types, file) => {
          const fileType = file.slice(file.lastIndexOf('.') + 1);
          types[fileType] = types[fileType] || [];
          types[fileType].push(file);
          return types;
        }, {});
      return entryArrayManifest as any;
    },
  });
};
