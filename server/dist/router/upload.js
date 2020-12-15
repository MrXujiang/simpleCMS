"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _glob = _interopRequireDefault(require("glob"));

var _upload = require("../lib/upload");

var _config = _interopRequireDefault(require("../config"));

var _htr = _interopRequireDefault(require("../lib/htr"));

var _service = require("../service");

var _os = _interopRequireDefault(require("os"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const os_flag = _os.default.platform().toLowerCase() === 'win32' ? '\\' : '/';

const uploadRouter = (router, apiPath) => {
  const api = {
    upload: apiPath + '/files/upload',
    uploadFree: apiPath + '/files/upload/free',
    uploadTx: apiPath + '/files/upload/tx',
    files: apiPath + '/files/all',
    del: apiPath + '/files/del' // 上传文件

  };
  router.post(api.upload, _service.auth, _upload.uploadSingleCatchError, ctx => {
    let {
      filename,
      path,
      size
    } = ctx.file;
    let {
      source
    } = ctx.request.body || 'unknow';
    let url = `${_config.default.staticPath}${path.split(`${os_flag}public`)[1]}`;
    ctx.body = (0, _htr.default)(200, {
      filename,
      url,
      source,
      size
    }, '文件上传成功');
  }); // 免费上传文件

  router.post(api.uploadFree, _upload.uploadSingleCatchError, ctx => {
    let {
      filename,
      path,
      size
    } = ctx.file;
    let {
      source
    } = ctx.request.body || 'unknow';
    let url = `${_config.default.staticPath}${path.split(`${os_flag}public`)[1]}`;
    ctx.body = (0, _htr.default)(200, {
      filename,
      url,
      source,
      size
    }, '文件上传成功');
  });
  router.post(api.uploadTx, _upload.uploadSingleCatchError, ctx => {
    let {
      filename,
      path,
      size
    } = ctx.file;
    let {
      source
    } = ctx.request.body || 'unknow';
    let url = `${_config.default.staticPath}${path.split(`${os_flag}public`)[1]}`;
    ctx.body = (0, _htr.default)(200, {
      filename,
      url,
      source,
      size
    }, '文件上传成功');
  }); // 读取文件

  router.get(api.files, ctx => {
    const files = _glob.default.sync(`${_config.default.publicPath}${os_flag}uploads/*`);

    const result = files.map(item => {
      return `${_config.default.staticPath}${item.split('public')[1]}`;
    });
    ctx.body = (0, _htr.default)(200, result);
  }); // 删除文件

  router.delete(api.del, _service.auth, async ctx => {
    const {
      id
    } = ctx.query;

    if (id) {
      const err = await (0, _upload.delFile)(`${_config.default.publicPath}${os_flag}uploads${os_flag}${id}`);

      if (!err) {
        ctx.body = (0, _htr.default)(200, null, '删除成功');
      } else {
        ctx.code = 500;
        ctx.body = (0, _htr.default)(500, null, '文件不存在，删除失败');
      }
    } else {
      ctx.status = 200;
      ctx.body = (0, _htr.default)(500, null, 'id不能为空');
    }
  });
};

var _default = uploadRouter;
exports.default = _default;