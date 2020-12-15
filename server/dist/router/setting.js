"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _upload = require("../lib/upload");

var _service = require("../service");

var _config = _interopRequireDefault(require("../config"));

var _htr = _interopRequireDefault(require("../lib/htr"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const settingRouter = (router, apiPath) => {
  // api路径
  const api = {
    setUserInfo: apiPath + '/setting/userInfo/save',
    userInfo: apiPath + '/setting/userInfo/get',
    setWebsite: apiPath + '/setting/website/save',
    website: apiPath + '/setting/website/get' // 更新用户信息

  };
  router.put(api.setUserInfo, _service.auth, async ctx => {
    let {
      email,
      username,
      desc,
      country,
      addr,
      phone,
      wx,
      job,
      tx
    } = ctx.request.body;
    const filePath = `${_config.default.publicPath}/db/setting.json`;

    if (username) {
      const res = (0, _upload.WF)(filePath, {
        userInfo: {
          email,
          username,
          desc,
          country,
          addr,
          tx,
          phone,
          wx,
          job
        }
      }, 1);

      if (res) {
        ctx.status = 200;
        ctx.body = (0, _htr.default)(200, null, '更新成功');
        return;
      }

      ctx.status = 500;
      ctx.body = (0, _htr.default)(500, null, '服务器错误');
    } else {
      ctx.status = 500;
      ctx.body = (0, _htr.default)(500, null, '用户名必填');
    }
  }); // 查看用户信息

  router.get(api.userInfo, async ctx => {
    const filePath = `${_config.default.publicPath}/db/setting.json`;
    const setting = (0, _upload.RF)(filePath);

    if (setting && setting.userInfo) {
      ctx.status = 200;
      ctx.body = (0, _htr.default)(200, setting.userInfo);
    } else {
      ctx.status = 500;
      ctx.body = (0, _htr.default)(500, null, '数据读取错误');
    }
  }); // 保存网站信息

  router.put(api.setWebsite, _service.auth, async ctx => {
    let {
      logo,
      title,
      desc,
      r_text,
      r_link
    } = ctx.request.body;
    const filePath = `${_config.default.publicPath}/db/setting.json`;

    if (title) {
      const res = (0, _upload.WF)(filePath, {
        website: {
          logo,
          title,
          desc,
          r_text,
          r_link
        }
      }, 1);

      if (res) {
        ctx.status = 200;
        ctx.body = (0, _htr.default)(200, null, '更新成功');
        return;
      }

      ctx.status = 500;
      ctx.body = (0, _htr.default)(500, null, '服务器错误');
    } else {
      ctx.status = 500;
      ctx.body = (0, _htr.default)(500, null, '用户名必填');
    }
  }); // 查看用户信息

  router.get(api.website, async ctx => {
    const filePath = `${_config.default.publicPath}/db/setting.json`;
    const setting = (0, _upload.RF)(filePath);

    if (setting && setting.website) {
      ctx.status = 200;
      ctx.body = (0, _htr.default)(200, setting.website);
    } else {
      ctx.status = 500;
      ctx.body = (0, _htr.default)(500, null, '数据读取错误');
    }
  });
};

var _default = settingRouter;
exports.default = _default;