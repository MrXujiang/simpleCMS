"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteFolder = deleteFolder;
exports.writeFile = writeFile;
exports.wfPromise = wfPromise;
exports.wfsPromise = wfsPromise;
exports.WF = WF;
exports.RF = RF;
exports.uploadSingleCatchError = exports.delFile = exports.upload = void 0;

var _multer = _interopRequireDefault(require("@koa/multer"));

var _path = require("path");

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rootImages = (0, _path.resolve)(__dirname, '../../public/uploads'); //上传文件存放路径、及文件命名

const storage = _multer.default.diskStorage({
  destination: function (req, file, cb) {
    cb(null, rootImages);
  },
  filename: function (req, file, cb) {
    let [name, type] = file.originalname.split('.');
    cb(null, `${name}_${Date.now().toString(16)}.${type}`);
  }
}); //文件上传限制


const limits = {
  fields: 10,
  //非文件字段的数量
  fileSize: 1024 * 1024 * 3,
  //文件大小 单位 b
  files: 1 //文件数量

};
const upload = (0, _multer.default)({
  storage,
  limits
}); // 删除文件

exports.upload = upload;

const delFile = path => {
  return new Promise((resolve, reject) => {
    _fs.default.unlink(path, err => {
      if (err) {
        reject(err);
      } else {
        resolve(null);
      }
    });
  });
}; // 删除文件夹


exports.delFile = delFile;

function deleteFolder(path) {
  var files = [];

  if (_fs.default.existsSync(path)) {
    files = _fs.default.readdirSync(path);
    files.forEach(function (file, index) {
      var curPath = path + "/" + file;

      if (_fs.default.statSync(curPath).isDirectory()) {
        // recurse
        deleteFolder(curPath);
      } else {
        // delete file
        _fs.default.unlinkSync(curPath);
      }
    });

    _fs.default.rmdirSync(path);
  }
}

function writeFile(path, data, encode) {
  return new Promise((resolve, reject) => {
    _fs.default.writeFile(path, data, encode, err => {
      if (err) {
        reject(err);
      } else {
        resolve(null);
      }
    });
  });
}
/**
 * 异步写入文件, 如果文件不存在则创建文件并写入内容
 * @param {path} 文件路径
 * @param {row} 要添加的数据
 * @param {flag}} 添加的标识符, 0表示数组 1表示对象
 * @param {isCover}} 文件写入模式, false为追加, true为覆盖
 */


function wfPromise(path, row, flag, isCover) {
  return new Promise((resolve, reject) => {
    if (_fs.default.existsSync(path)) {
      _fs.default.readFile(path, (err, data) => {
        if (!err) {
          let prevData = JSON.parse(data);

          if (flag) {
            prevData = !isCover ? Object.assign(prevData, row) : row;
          } else {
            !isCover ? prevData.push(row) : prevData = row;
          }

          _fs.default.writeFile(path, JSON.stringify(prevData), err => {
            if (!err) {
              resolve(true);
            } else {
              reject(err);
            }
          });
        } else {
          reject(err);
        }
      });
    } else {
      let prevData;

      if (flag) {
        prevData = row;
      } else {
        prevData = !isCover ? [row] : row;
      }

      _fs.default.writeFile(path, JSON.stringify(prevData), err => {
        if (!err) {
          resolve(true);
        } else {
          reject(err);
        }
      });
    }
  });
} // 流式写入文件


function wfsPromise(filename, data) {
  return new Promise((reslove, reject) => {
    const ws = _fs.default.createWriteStream(filename); //为流绑定一个close事件，来监听流是否关闭


    ws.once("close", function () {
      reslove(true);
    });
    ws.once("error", function (err) {
      reject(err);
    }); //通过可写流向文件中输出内容

    ws.write(JSON.stringify(data)); //关闭流

    ws.end();
  });
} // 为了捕获multer的错误


const uploadSingleCatchError = async (ctx, next) => {
  let err = await upload.single('file')(ctx, next).then(res => res).catch(err => err);

  if (err) {
    ctx.status = 500;
    ctx.body = {
      state: 500,
      msg: err.message
    };
  }
};
/**
 * 写入文件,如果路径不存在则创建
 * path 文件路径
 * data 要写入的数据
 * mode 写入模式 0 覆盖 1 追加
 */


exports.uploadSingleCatchError = uploadSingleCatchError;

function WF(path, data, mode) {
  if (_fs.default.existsSync(path)) {
    let source = _fs.default.readFileSync(path);

    let sourceData = source.toString() ? JSON.parse(source) : "";

    if (sourceData && mode) {
      if (Array.isArray(sourceData)) {
        sourceData.push(data);
      } else {
        sourceData = Object.assign(sourceData, data);
      }
    } else {
      sourceData = data;
    }

    try {
      _fs.default.writeFileSync(path, JSON.stringify(sourceData));

      return true;
    } catch (err) {
      return false;
    }
  } else {
    const pathArr = path.split('/');
    const filename = pathArr.pop(); // 创建目录

    _fs.default.mkdirSync(pathArr.join('/'), {
      recursive: true
    });

    try {
      _fs.default.writeFileSync(path, JSON.stringify(data));

      return true;
    } catch (err) {
      return false;
    }
  }
} // 读取文件, 如果路径不存在则创建对应的路径


function RF(path) {
  if (_fs.default.existsSync(path)) {
    const data = _fs.default.readFileSync(path);

    return data.toString() ? JSON.parse(data) : null;
  } // 如果不存在, 则创建空文件


  const pathArr = path.split('/');
  const filename = pathArr.pop(); // 创建目录

  _fs.default.mkdirSync(pathArr.join('/'), {
    recursive: true
  });

  _fs.default.writeFileSync(path, '');

  return null;
}