/**
 * 解决 打包时 页面引入 asset 报错问题 
 * **/
import FS from 'fs-extra';
export default class CreateTemporaryAsset {
  pathname = ""

  constructor(pathname: string) {
    this.pathname = pathname
  }

  apply() {
    if (!FS.existsSync(this.pathname)) {
      FS.ensureFileSync(this.pathname)
    }
  }
}