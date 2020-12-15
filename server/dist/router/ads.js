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

const adsRouter = (router, apiPath) => {
  // api路径
  const api = {
    editAds: apiPath + '/ads/save',
    ads: apiPath + '/ads/get' // 更改合作广告

  };
  router.post(api.editAds, _service.auth, async ctx => {
    let adForm = ctx.request.body;

    if (adForm) {
      // 1. 写入广告数据
      const filePath = `${_config.default.publicPath}/db/ads.json`;

      try {
        const res = await (0, _upload.WF)(filePath, adForm);

        if (res) {
          ctx.body = (0, _htr.default)(200, null, '保存成功');
        }
      } catch (err) {
        ctx.status = 200;
        ctx.body = (0, _htr.default)(500, null, '参数错误, 保存失败');
      }
    } else {
      ctx.status = 200;
      ctx.body = (0, _htr.default)(500, null, '内容不完整, 广告保存失败');
    }
  }); // 获取广告数据

  router.get(api.ads, _service.auth, ctx => {
    const filePath = `${_config.default.publicPath}/db/ads.json`;

    try {
      const data = (0, _upload.RF)(filePath);
      ctx.body = (0, _htr.default)(200, data);
    } catch (err) {
      ctx.status = 200;
      ctx.body = (0, _htr.default)(500, null, '解析失败');
    }
  });
};

var _default = adsRouter;
exports.default = _default;