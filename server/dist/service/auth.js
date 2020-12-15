"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.auth = void 0;

var _upload = require("../lib/upload");

var _config = _interopRequireDefault(require("../config"));

var _htr = _interopRequireDefault(require("../lib/htr"));

var _tool = require("../lib/tool");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const useVip = ctx => ({
  co: ctx.cookies.get('uid'),
  n: decodeURIComponent(ctx.request.header['x-requested-with'])
});

const auth = async (ctx, next) => {
  const filePath = `${_config.default.publicPath}/db/user/user.json`;
  const {
    co,
    n
  } = useVip(ctx);
  const data = (0, _upload.RF)(filePath);
  const vip = data.filter(item => item.name === n && item.pwd === _tool.xib.uxip(co))[0];

  if (vip) {
    await next();
  } else {
    ctx.status = 403;
    ctx.body = (0, _htr.default)(403, null, '会员登录过期,请重新登录');
  }
};

exports.auth = auth;