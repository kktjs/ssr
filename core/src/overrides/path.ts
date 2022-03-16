import { OverridesProps } from ".";
import { paths, Paths } from "./pathUtils"

/** 覆盖 */
export default (overrides: OverridesProps): Paths => {
  return {
    ...paths,
    ...overrides.paths,
    appBuild: overrides.output_path
  }
}