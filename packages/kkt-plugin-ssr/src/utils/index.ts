import webpack from "webpack"


// 过滤 不用的插件
export const getPlugins = (oldPlugins: webpack.Configuration["plugins"]) => {
  let plugins: webpack.Configuration["plugins"] = [];
  (oldPlugins || []).forEach((plugin) => {
    if (!(plugin && plugin.constructor && ["HtmlWebpackPlugin", "SSRWebpackPlugin", "MiniCssExtractPlugin"].includes(plugin.constructor.name))) {
      plugins?.push(plugin)
    }
  })
  return plugins
}

// 过滤出不用的 模块规则
export const getModuleRules = (oleRules: webpack.ModuleOptions["rules"]) => {

  const getUseLoader = (arr: webpack.RuleSetUseItem[]) => {
    const reslult = arr.filter((item) => {
      if (item && typeof item !== "string" && typeof item !== "function" && item.loader && /mini-css-extract-plugin\/dist\/loader.js$/.test(item.loader)) {
        return false
      }
      return true
    })
    return reslult
  }

  const newRules: webpack.ModuleOptions["rules"] = [];
  (oleRules || []).forEach((item) => {
    if (item !== "..." && item.oneOf) {
      let rulesOneOf = [] as webpack.RuleSetRule[]
      item.oneOf.forEach((item) => {
        if (item.use && Array.isArray(item.use)) {
          rulesOneOf.push({ ...item, use: getUseLoader(item.use) })
        } else {
          rulesOneOf.push(item)
        }
      })
      newRules.push({ ...item, oneOf: rulesOneOf })
    } else {
      newRules.push(item)
    }
  })
  return newRules
}