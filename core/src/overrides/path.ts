import overrides from ".";
import { paths } from "./pathUtils"

export default {
  ...paths,
  ...overrides.paths,
  appBuild: overrides.output_path
}