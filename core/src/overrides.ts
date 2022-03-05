import { reactDevUtils } from 'kkt';
import 'react-dev-utils/printHostingInstructions';
import { measureFileSizesBeforeBuild } from 'react-dev-utils/FileSizeReporter';
// @ts-ignore
import 'react-dev-utils/browsersHelper';

const printHostingInstructionsPath = `${reactDevUtils}/printHostingInstructions`;
if (require.cache && require.cache[require.resolve(printHostingInstructionsPath)]) {
  require.cache[require.resolve(printHostingInstructionsPath)].exports = () => {};
}

const fileSizeReporterPath = `${reactDevUtils}/FileSizeReporter`;
if (require.cache && require.cache[require.resolve(fileSizeReporterPath)]) {
  require.cache[require.resolve(fileSizeReporterPath)].exports = {
    measureFileSizesBeforeBuild,
    printFileSizesAfterBuild: () => {},
  };
}

const browsersHelperPath = `${reactDevUtils}/browsersHelper`;
if (require.cache && require.cache[require.resolve(browsersHelperPath)]) {
  require.cache[require.resolve(browsersHelperPath)].exports = {
    checkBrowsers: () => Promise.resolve(),
    defaultBrowsers: () => {},
  };
}
