import overrides from ".";
import { paths } from "./pathUtils"
/** 覆盖 */
export default {
  ...paths,
  ...overrides.paths,
  appBuild: overrides.output_path
}