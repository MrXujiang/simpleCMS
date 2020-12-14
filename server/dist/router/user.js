"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _upload = require("../lib/upload");

var _tool = require("../lib/tool");

var _service = require("../service");

var _config = _interopRequireDefault(require("../config"));

var _htr = _interopRequireDefault(require("../lib/htr"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 文章路由
 * @param {*} router 
 * @param {*} apiPath
 * 待优化：1.将成功响应和失败响应统一封装 
 */
const userRouter = (router, apiPath) => {
  // api路径
  const api = {
    login: apiPath + '/user/login' // 登录逻辑

  };
  router.post(api.login, async ctx => {
    const {
      name,
      pwd
    } = ctx.request.body;
    const filePath = `${_config.default.publicPath}/db/user/user.json`;
    const data = (0, _upload.RF)(filePath);
    const user = data.filter(item => item.name === name && item.pwd === pwd)[0];

    if (user) {
      ctx.cookies.set('cid', _tool.xib.xip(pwd), {
        maxAge: 3 * 24 * 3600 * 1000
      });
      ctx.cookies.set('rp', user.role, {
        maxAge: 3 * 24 * 3600 * 1000
      });
      ctx.status = 200;
      ctx.set('x-show-msg', 'zxzk_msg_200');
      const {
        name,
        role,
        uid
      } = user;
      ctx.body = (0, _htr.default)(200, {
        name,
        role,
        uid,
        maxage: 3 * 24 * 3600 * 1000
      }, '登录成功');
    } else {
      ctx.status = 500;
      ctx.body = (0, _htr.default)(500, null, '用户名/密码错误');
    }
  });
};

var _default = userRouter;
exports.default = _default;