import { getStyleLoaders } from "./../../overrides/utils"
import webpack from "webpack"
import { OverridesProps } from "./../../overrides"
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');

export const getLessRules = (newConfig: webpack.Configuration, env: "development" | "production", overrides: OverridesProps) => {
  return [
    {
      test: /\.less$/,
      exclude: [/\.module\.less$/],
      use: getStyleLoaders({
        importLoaders: 1,
        sourceMap: newConfig.devtool,
        modules: {
          mode: 'icss',
        },
      }, {
        webpackEnv: env,
        devtool: newConfig.devtool,
        isStyleLoader: newConfig.target !== "node",
        paths: overrides.paths
      }, "less-loader"),
      sideEffects: true,
    },
    {
      test: /\.module\.less$/,
      use: getStyleLoaders({
        importLoaders: 1,
        sourceMap: newConfig.devtool,
        modules: {
          mode: 'local',
          getLocalIdent: getCSSModuleLocalIdent,
        },
      }, {
        webpackEnv: env,
        devtool: newConfig.devtool,
        isStyleLoader: newConfig.target !== "node",
        paths: overrides.paths
      }, "less-loader"),
    },
  ]
}