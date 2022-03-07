import webpack from "webpack"
import { MiniCssExtractPlugin } from 'kkt';

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const getToString = (rule: RegExp) => {
  return rule.toString()
}


// sourceMap 设置 为 false
const setSourceMaps = (item: any) => {
  if (item && item.options) {
    if (item.options.sourceMaps) {
      item.options.sourceMaps = false
    }
    if (item.options.sourceMap) {
      item.options.sourceMap = false
    }
    if (item.options.inputSourceMap) {
      item.options.inputSourceMap = false
    }
  }
}

/**
  * 1. 开发模式下，去除  style-loader  改成  MiniCssExtractPlugin.lader，让他生成 css 文件
  * */

export const getModuleCSSRules = (rules: (webpack.RuleSetRule | "...")[], isEnvDevelopment: boolean) => {
  const newRules: any = []
  rules.forEach((rule) => {
    if (typeof rule === "string") {
      newRules.push(rule)
      return
    }
    setSourceMaps(rule)
    if (/style-loader/.test(rule.loader) && isEnvDevelopment) {
      newRules.push({
        loader: MiniCssExtractPlugin.loader,
      })
    } else if (rule.oneOf) {
      const newOneOf = rule.oneOf.map((item) => {
        setSourceMaps(item)
        if (item.test && [
          getToString(cssRegex),
          getToString(cssModuleRegex),
          getToString(sassRegex),
          getToString(sassModuleRegex)
        ].includes(item.test.toString())
        ) {
          let newUse;
          if (Array.isArray(item.use)) {
            newUse = item.use.map((ite) => {
              setSourceMaps(ite)
              if (typeof ite === "string" && /style-loader/.test(ite) && isEnvDevelopment) {
                return {
                  loader: MiniCssExtractPlugin.loader,
                }
              } else if (typeof ite === "object" && /style-loader/.test(ite.loader) && isEnvDevelopment) {
                return {
                  loader: MiniCssExtractPlugin.loader,
                }
              }
              return ite
            })
          }
          return {
            ...item,
            use: newUse || item.use
          }
        }
        return item
      })
      newRules.push({ ...rule, oneOf: newOneOf })
    } else {
      newRules.push(rule)
    }
  })
  return newRules
}