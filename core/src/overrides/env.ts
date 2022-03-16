// 重写环境变量
import { OverridesProps } from "."

export const restENV = (overrides: OverridesProps) => {
  if (Reflect.has(overrides, 'GENERATE_SOURCEMAP')) {
    process.env.GENERATE_SOURCEMAP = Reflect.get(overrides, 'GENERATE_SOURCEMAP');
  }

  if (Reflect.has(overrides, 'INLINE_RUNTIME_CHUNK')) {
    process.env.INLINE_RUNTIME_CHUNK = Reflect.get(
      overrides,
      'INLINE_RUNTIME_CHUNK'
    );
  }
  if (Reflect.has(overrides, 'ESLINT_NO_DEV_ERRORS')) {
    process.env.ESLINT_NO_DEV_ERRORS = Reflect.get(
      overrides,
      'ESLINT_NO_DEV_ERRORS'
    );
  }

  if (Reflect.has(overrides, 'DISABLE_ESLINT_PLUGIN')) {
    process.env.DISABLE_ESLINT_PLUGIN = Reflect.get(
      overrides,
      'DISABLE_ESLINT_PLUGIN'
    );
  }

}