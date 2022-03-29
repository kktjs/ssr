import { reactScripts } from "./pathUtils"
import { Paths, OverridesProps } from "../interface"
import fs from 'fs';

/** 覆盖 */
export default (overrides: OverridesProps): Paths => {
  const pathsConfPath = `${reactScripts}/config/paths`;
  const pathsConf = require(pathsConfPath);
  const newPaths = {
    ...pathsConf,
    ...overrides.paths,
    appBuild: overrides.output_path
  }
  if (!fs.existsSync(newPaths.appIndexJs) && fs.existsSync(overrides.client_path)) {
    newPaths.appIndexJs = overrides.client_path
  }
  require.cache[require.resolve(`${reactScripts}/config/paths`)].exports = newPaths
  return newPaths
}