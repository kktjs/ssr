import MiniCssExtractPlugin from "mini-css-extract-plugin"
import { WebpackConfiguration } from 'kkt';
import { RuleSetRule } from "webpack"
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');

export interface LessOptions {
  target: "node" | "web";
  env: "development" | "production",
  paths: Record<string, string>
  shouldUseSourceMap?: boolean
}

export default (conf: WebpackConfiguration, options: LessOptions): WebpackConfiguration => {
  let shouldUseSourceMap = options.shouldUseSourceMap || !!conf.devtool;

  const isWeb = options.target === "web"

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

  // node 端 需要 exportOnlyLocals 值
  const modulesLocals: { exportOnlyLocals?: boolean } = {}
  if (!isWeb) {
    modulesLocals.exportOnlyLocals = true
  }

  const cssModuleOption = {
    importLoaders: 3,
    sourceMap: shouldUseSourceMap,
    modules: {
      mode: 'icss',
      ...modulesLocals,
      getLocalIdent: getCSSModuleLocalIdent,
    },
  };


  const getStyleLoader = (cssModuleOption: any) => {
    let rules: RuleSetRule[] = [
      {
        loader: require.resolve('css-loader'),
        options: {
          ...cssModuleOption
        },
      },
      postcssLoader,
      {
        loader: require.resolve('resolve-url-loader'),
        options: {
          sourceMap: shouldUseSourceMap,
          root: options.paths.appSrc,
        },
      },
      {
        loader: require.resolve('less-loader'),
        options: {
          sourceMap: true,
        }
      }
    ]
    if (isWeb && isEnvProduction) {
      rules.unshift({
        loader: MiniCssExtractPlugin.loader,
        // css is located in `static/css`, use '../../' to locate index.html folder
        // in production `paths.publicUrlOrPath` can be a relative path
        options: options.paths.publicUrlOrPath.startsWith('.')
          ? { publicPath: '../../' }
          : {},
      })
    }
    if (isWeb && IS_DEV) {
      rules.unshift({ loader: require.resolve('style-loader') })
    }
    return rules.filter(Boolean)
  }

  // "postcss" loader applies autoprefixer to our CSS.
  // "css" loader resolves paths in CSS and adds assets as dependencies.
  // "style" loader turns CSS into JS modules that inject <style> tags.
  // In production, we use a plugin to extract that CSS to a file, but
  // in development "style" loader enables hot editing of CSS.
  //
  // Note: this yields the exact same CSS config as create-react-app.
  const lessRules: WebpackConfiguration["module"]["rules"] = [
    {
      test: /\.less$/,
      exclude: [/\.module\.less$/],
      // Don't consider CSS imports dead code even if the
      // containing package claims to have no side effects.
      // Remove this when webpack adds a warning or an error for this.
      // See https://github.com/webpack/webpack/issues/6571
      use: [
        ...getStyleLoader(cssModuleOption),
      ],
      sideEffects: true,
    },
    // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
    // using the extension .module.css
    {
      test: /\.module\.less$/,
      sideEffects: true,
      use: [
        ...getStyleLoader({
          ...cssModuleOption,
          modules: {
            mode: 'local',
            ...modulesLocals,
            getLocalIdent: getCSSModuleLocalIdent,
          },
        }),
      ],
    },
  ];

  const newRules = conf.module.rules.map((item) => {
    if (item !== "..." && item.oneOf) {
      const newOneOf = [].concat(item.oneOf);
      newOneOf.splice(newOneOf.length - 1, 0, ...lessRules)
      return {
        ...item,
        oneOf: newOneOf
      }
    }
    return item
  }) as WebpackConfiguration["module"]["rules"]

  return {
    ...conf,
    module: {
      ...conf.module,
      rules: newRules
    }
  }
}
