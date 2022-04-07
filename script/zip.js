const archiver = require("archiver")
const FS = require('fs-extra');
const path = require("path")

const PWDTS = path.resolve(__dirname, '../example/');
const PWDJS = path.resolve(__dirname, '../examplejs/');
const PWDZIP = path.resolve(__dirname, '../zip');

FS.emptyDirSync(PWDZIP)

const createZip = async (paths, type) => {
  const pathArr = FS.readdirSync(paths)
  try {
    pathArr.forEach((itemName) => {
      const childPath = path.join(paths, itemName)
      const createDirZIP = path.join(PWDZIP, itemName + "-" + type + ".zip")
      const stat = FS.lstatSync(childPath)
      if (stat.isDirectory()) {
        const output = FS.createWriteStream(createDirZIP);
        var archive = archiver('zip', {
          store: true,
          zlib: { level: 9 } // 设置压缩级别
        });
        // 文件输出流结束
        output.on('close', function () {
          console.log(`${itemName + "-" + type + ".zip"} 压缩完成：总共 ${archive.pointer()} 字节`);
        });
        // 数据源是否耗尽
        output.on('end', function () {
          console.log('数据源已耗尽')
        })
        // 存档出错
        archive.on('error', function (err) {
          throw err;
        });
        // 通过管道方法将输出流存档到文件
        archive.pipe(output);
        // 压缩的文件路径
        archive.directory(childPath, false, (entry) => {
          if (/^(node_modules|build|dist|coverage|.eslintcache|sandbox.config.json|.stackblitzrc)/.test(entry.name)) {
            return false
          }
          return entry
        });
        //完成归档
        archive.finalize();
      }
    })
  }
  catch (err) {
    console.log(err)
  }
}
createZip(PWDTS, "ts")
createZip(PWDJS, "js")