export * from "./module"
export * from "./plugins"
export * from "./output"

export { default as getWebpackConfig } from "./getWebpackConfig"
export { default as processingConfig } from "./ProcessingConfig"
type BoolenValue = boolean | undefined | "false" | "true"

export const getBoolean = (one: BoolenValue, two: BoolenValue, defaultValue: boolean = false) => {
  let value = defaultValue
  if (typeof one === "boolean") {
    value = one
  } else if (typeof two === "boolean") {
    value = two
  }

  if ((typeof one === "string" && one === "true") || (typeof two === "string" && two === "true")) {
    value = true
  }

  if ((typeof one === "string" && one === "false") || (typeof two === "string" && two === "false")) {
    value = false
  }

  return value
}