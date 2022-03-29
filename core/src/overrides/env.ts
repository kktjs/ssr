// 重写环境变量
import { OverridesProps } from "./../interface"

export const restENV = (overrides: OverridesProps) => {
  if (overrides.env) {
    Object.entries(overrides.env).forEach(([key, value]) => {
      process.env[key] = value;
    })
  }
}
