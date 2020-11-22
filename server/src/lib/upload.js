import multer from '@koa/multer'
import { resolve } from 'path'
import fs from 'fs'

const rootImages = resolve(__dirname, '../../public/uploads')
//上传文件存放路径、及文件命名
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, rootImages)
    },
    filename: function (req, file, cb) {
        let [name, type] = file.originalname.split('.');
        cb(null, `${name}_${Date.now().toString(16)}.${type}`)
    }
})
//文件上传限制
const limits = {
    fields: 10,//非文件字段的数量
    fileSize: 1024 * 1024 * 3,//文件大小 单位 b
    files: 1//文件数量
}

export const upload = multer({storage,limits})

// 删除文件
export const delFile = (path) => {
    return new Promise((resolve, reject) => {
        fs.unlink(path, (err) => {
            if(err) {
                reject(err)
            }else {
                resolve(null)
            }
        })
    }) 
}

// 删除文件夹
export function deleteFolder(path) {
    var files = [];
    if(fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

export function writeFile(path, data, encode) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, encode, (err) => {
            if(err) {
                reject(err)
            }else {
                resolve(null)
            }
        })
    })
}

/**
 * 异步写入文件, 如果文件不存在则创建文件并写入内容
 * @param {path} 文件路径
 * @param {row} 要添加的数据
 * @param {flag}} 添加的标识符, 0表示数组 1表示对象
 * @param {isCover}} 文件写入模式, false为追加, true为覆盖
 */
export function wfPromise(path, row, flag, isCover) {
  return new Promise((resolve, reject) => {
    if(fs.existsSync(path)) {
      fs.readFile(path, (err, data) => {
        if(!err) {
          let prevData = JSON.parse(data)
          if(flag) {
            prevData = !isCover ? Object.assign(prevData, row) : row
          }else {
            !isCover ? (prevData.push(row)) : (prevData = row)
          }
          fs.writeFile(path, JSON.stringify(prevData), err => {
            if(!err) {
              resolve(true)
            }else {
              reject(err)
            }
          })
        }else {
          reject(err)
        }
      })
    }else {
      let prevData
      if(flag) {
        prevData = row
      }else {
        prevData = !isCover ? [row] : row
      }
      fs.writeFile(path, JSON.stringify(prevData), err => {
        if(!err) {
          resolve(true)
        }else {
          reject(err)
        }
      })
    }
  })
}

// 流式写入文件
export function wfsPromise(filename, data) {
  return new Promise((reslove, reject) => {
    const ws = fs.createWriteStream(filename);
    //为流绑定一个close事件，来监听流是否关闭
    ws.once("close",function () {
      reslove(true)
    });
  
    ws.once("error",function (err) {
      reject(err)
    });
    //通过可写流向文件中输出内容
    ws.write(JSON.stringify(data));
    //关闭流
    ws.end();
  })
}

// 为了捕获multer的错误
export const uploadSingleCatchError = async (ctx, next) => {
    let err = await upload.single('file')(ctx, next).then(res => res)
                .catch(err => err);
    if(err) {
        ctx.status = 500
        ctx.body = {
            state: 500,
            msg: err.message
        }
    }
}

/**
 * 写入文件,如果路径不存在则创建
 * path 文件路径
 * data 要写入的数据
 * mode 写入模式 0 覆盖 1 追加
 */
export function WF(path, data, mode) {
  if(fs.existsSync(path)) {
    let source = fs.readFileSync(path)
    let sourceData = source.toString() ? JSON.parse(source) : ""
    if(sourceData && mode) {
      if(Array.isArray(sourceData)) {
        sourceData.push(data)
      }else {
        sourceData = Object.assign(sourceData, data)
      }
    }else {
      sourceData = data
    }
    try{
      fs.writeFileSync(path, JSON.stringify(sourceData))
      return true
    }catch(err) {
      return false
    }
  }else {
    const pathArr = path.split('/')
    const filename = pathArr.pop()
    // 创建目录
    fs.mkdirSync(pathArr.join('/'), { recursive: true })
    try{
      fs.writeFileSync(path, JSON.stringify(data))
      return true
    }catch(err) {
      return false
    }
  }
}

// 读取文件, 如果路径不存在则创建对应的路径
export function RF(path) {
  if(fs.existsSync(path)) {
    const data = fs.readFileSync(path)
    return data.toString() ? JSON.parse(data) : null
  }
  // 如果不存在, 则创建空文件
  const pathArr = path.split('/')
  const filename = pathArr.pop()
  // 创建目录
  fs.mkdirSync(pathArr.join('/'), { recursive: true })
  fs.writeFileSync(path, '')
  return null
}