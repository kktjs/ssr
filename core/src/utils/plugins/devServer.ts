// 开发模式 下 生成 server.js 文件
import webpack from "webpack"

import FS from 'fs-extra';


class CreateTemporaryAsset {

  filename = "server.js"
  outputPath = ""

  constructor(props: { filename: string, outputPath: string, }) {
    this.filename = props.filename
    this.outputPath = props.outputPath
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.thisCompilation.tap('DevServerPlugins', (childCompilation) => {
      childCompilation.hooks.processAssets.tap('DevServerPlugins', (compilationAssets) => {
        const serverFile = compilationAssets[this.filename]
        if (!FS.existsSync(this.outputPath)) {
          FS.ensureDirSync(this.outputPath)
        }
        FS.writeFileSync(`${this.outputPath}/${this.filename}`, serverFile.buffer(), { flag: "w+", encoding: "utf-8" })
      });
    });
  }
}

export default CreateTemporaryAsset