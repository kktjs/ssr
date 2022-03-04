import webpack from "webpack"

// 过滤 不用的插件
export const getPlugins = (oldPlugins: webpack.Configuration["plugins"], isWebpack = false) => {
  let plugins: webpack.Configuration["plugins"] = [];
  (oldPlugins || []).forEach((plugin) => {
    if (!(plugin && plugin.constructor && ["HtmlWebpackPlugin", "SSRWebpackPlugin", "SSRWebpackRunPlugin", "WebpackManifestPlugin"].includes(plugin.constructor.name))) {
      plugins?.push(plugin)
    }
  })
  return plugins
}

// 设置 sourceMap = false
const setSourceMaps = (item: any) => {
  let newItem = item
  if (item && item.options && typeof item.options === "object") {
    if (Reflect.has(item.options, "sourceMaps")) {
      newItem = {
        ...item,
        options: {
          ...item.options,
          sourceMaps: false
        }
      }
    }
    if (Reflect.has(item.options, "sourceMap")) {
      newItem = {
        ...item,
        options: {
          ...item.options,
          sourceMap: false
        }
      }
    }
    if (Reflect.has(item.options, "inputSourceMap")) {
      newItem = {
        ...item,
        options: {
          ...item.options,
          inputSourceMap: false
        }
      }
    }
  }
  return newItem
}

// 过滤出不用的 模块规则
export const getModuleRules = (oleRules: webpack.ModuleOptions["rules"]) => {

  const getUseLoader = (arr: webpack.RuleSetUseItem[]) => {
    const reslult = arr.map((item: any) => {
      const newItem = setSourceMaps(item)
      if (item &&
        typeof item !== "string" &&
        typeof item !== "function"
      ) {
        if (item.loader && /mini-css-extract-plugin\/dist\/loader.js$/.test(item.loader)) {
          return false
        }
        if (item.exclude &&
          /@babel(?:\/|\\{1,2})runtime/.toString() === item.exclude.toString() &&
          item.test.toString() === /\.(js|mjs)$/.toString()) {
          return false
        }
      }
      return newItem
    }).filter(Boolean)
    return reslult
  }

  const newRules: webpack.ModuleOptions["rules"] = [];
  (oleRules || []).forEach((item) => {
    const newItems = setSourceMaps(item)
    if (item !== "..." && item.oneOf) {
      let rulesOneOf = [] as webpack.RuleSetRule[]
      item.oneOf.forEach((childItem) => {
        const newChildItems = setSourceMaps(childItem)
        if (childItem.use && Array.isArray(childItem.use)) {
          rulesOneOf.push({ ...newChildItems, use: getUseLoader(newChildItems.use) })
        } else {
          rulesOneOf.push(newChildItems)
        }
      })
      newRules.push({ ...newItems, oneOf: rulesOneOf })
    } else if (item !== "..." && item && item.exclude?.toString() === /@babel(?:\/|\\{1,2})runtime/.toString()) {
    } else {
      newRules.push(newItems)
    }
  })
  return newRules
}

