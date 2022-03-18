import MiniCssExtractPlugin from "mini-css-extract-plugin"
import { WebpackConfiguration } from 'kkt';

export interface LessOptions {
  target: string | false | string[];
  env: "development" | "production",
  paths: Record<string, string>
  shouldUseSourceMap?: boolean
}

export default (conf: WebpackConfiguration, options: LessOptions): WebpackConfiguration => {
  let shouldUseSourceMap = options.shouldUseSourceMap || !!conf.devtool;
  const IS_NODE = /node/.test(typeof options.target === "string" ? options.target : options.target.toString());
  const IS_DEV = options.env === 'development';
  const isEnvProduction = options.env === 'production';
  const postcssLoader = {
    // Options for PostCSS as we reference these options twice
    // Adds vendor prefixing based on your specified browser support in
    // package.json
    loader: require.resolve('postcss-loader'),
    options: {
      postcssOptions: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        config: false,
        plugins: [
          'postcss-flexbugs-fixes',
          [
            'postcss-preset-env',
            {
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 3,
            },
          ],
          // Adds PostCSS Normalize as the reset css with default options,
          // so that it honors browserslist config in package.json
          // which in turn let's users customize the target behavior as per their needs.
          'postcss-normalize',
        ]
      },
      sourceMap: isEnvProduction ? shouldUseSourceMap : IS_DEV,
    },
  };

  const cssModuleOption = {
    importLoaders: 1,
    sourceMap: isEnvProduction ? shouldUseSourceMap : IS_DEV,
    modules: {
      mode: 'icss',
    },
  };
  // "postcss" loader applies autoprefixer to our CSS.
  // "css" loader resolves paths in CSS and adds assets as dependencies.
  // "style" loader turns CSS into JS modules that inject <style> tags.
  // In production, we use a plugin to extract that CSS to a file, but
  // in development "style" loader enables hot editing of CSS.
  //
  // Note: this yields the exact same CSS config as create-react-app.
  conf.module.rules = [
    ...conf.module.rules,
    {
      test: /\.less$/,
      exclude: [options.paths.appBuild, /\.module\.less$/],
      // Don't consider CSS imports dead code even if the
      // containing package claims to have no side effects.
      // Remove this when webpack adds a warning or an error for this.
      // See https://github.com/webpack/webpack/issues/6571
      sideEffects: true,
      use: (() => {
        const rulers = [];
        // Style-loader does not work in Node.js without some crazy
        // magic. Luckily we just need css-loader.
        if (IS_NODE) {
          rulers.push({
            loader: require.resolve('css-loader'),
            options: {
              ...cssModuleOption,
            },
          });
        } else {
          // Generating inline styles makes it harder to locate problems.
          // rulers.push(MiniCssExtractPlugin.loader);
          if (IS_DEV) {
            rulers.push(require.resolve('style-loader'));
          } else {
            rulers.push({
              loader: MiniCssExtractPlugin.loader,
              // css is located in `static/css`, use '../../' to locate index.html folder
              // in production `paths.publicUrlOrPath` can be a relative path
              options: options.paths.publicUrlOrPath.startsWith('.')
                ? { publicPath: '../../' }
                : {},
            });
          }
          rulers.push({
            loader: require.resolve('css-loader'),
            options: {
              ...cssModuleOption,
            },
          });
          rulers.push(postcssLoader);
        }
        rulers.push({
          loader: require.resolve('less-loader'),
          options: {
            sourceMap: true,
          }
        });
        return rulers;
      })(),
    },
    // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
    // using the extension .module.css
    {
      test: /\.module\.less$/,
      exclude: [options.paths.appBuild],
      sideEffects: true,
      use: (() => {
        const rulers = [];
        if (IS_NODE) {
          rulers.push({
            loader: require.resolve('css-loader'),
            options: {
              ...cssModuleOption,
              modules: {
                mode: 'local',
              },
            },
          });
        } else {
          // Generating inline styles makes it harder to locate problems.
          // rulers.push(MiniCssExtractPlugin.loader);
          if (IS_DEV) {
            rulers.push(require.resolve('style-loader'));
          } else {
            rulers.push(MiniCssExtractPlugin.loader);
          }
          rulers.push({
            loader: require.resolve('css-loader'),
            options: {
              ...cssModuleOption,
              modules: {
                mode: 'local',
              },
            },
          });
          rulers.push(postcssLoader);
        }
        rulers.push({
          loader: require.resolve('less-loader'),
          options: {
            sourceMap: true,
          }
        });
        return rulers;
      })(),
    },
  ];
  return conf
}
