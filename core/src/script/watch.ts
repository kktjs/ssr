// 根据 kkt 写法 重置 create-react-app 中的 react-script配置
import createCompiler from "./utils"

import clearConsole from 'react-dev-utils/clearConsole';
import overrides from "./../overrides"
const today = () => new Date().toISOString().split('.')[0].replace('T', ' ');
export default async () => {
  const { compiler } = createCompiler("development")
  compiler.watch({
    ...(overrides.watchOptions || {}),
  }, (err, stats) => {
    if (err) {
      console.log('❌ KKT-SSR:\x1b[31;1mERR\x1b[0m:', err);
      return;
    }
    if (stats.hasErrors()) {
      clearConsole();
      console.log(`❌ KKT-SSR:\x1b[31;1mERR\x1b[0m: \x1b[35;1m${today()}\x1b[0m\n`, stats.toString());
      return;
    }
    clearConsole();
    console.log(`🚀 started! \x1b[35;1m${today()}\x1b[0m`);
  });

}