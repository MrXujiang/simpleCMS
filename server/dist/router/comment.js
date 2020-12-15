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

const commentRouter = (router, apiPath) => {
  // api路径
  const api = {
    add: apiPath + '/comment/add',
    comments: apiPath + '/comment/get',
    del: apiPath + '/comment/del',
    doZan: apiPath + '/article/addflover' // 添加评论

  };
  router.post(api.add, async ctx => {
    let {
      id,
      text
    } = ctx.request.body;

    if (id && text) {
      const filePath = `${_config.default.publicPath}/db/comment/${id}.json`;
      const cid = Date.now();

      try {
        let res = '',
            data;

        if (!_fs.default.existsSync(filePath)) {
          res = await (0, _upload.wfPromise)(filePath, {
            comments: [{
              text,
              cid
            }]
          }, 1);
          data = {
            comments: [{
              text,
              cid
            }]
          };
        } else {
          const dataStr = _fs.default.readFileSync(filePath);

          data = dataStr ? JSON.parse(dataStr) : {
            comments: []
          };
          data.comments ? data.comments.push({
            text,
            cid
          }) : data.comments = [{
            text,
            cid
          }];
          res = await (0, _upload.wfPromise)(filePath, data, 1);
        }

        if (res) {
          ctx.body = (0, _htr.default)(200, data.comments, '评论成功');
        } else {
          ctx.body = (0, _htr.default)(500, null, '服务器错误');
        }
      } catch (err) {
        ctx.status = 200;
        ctx.body = (0, _htr.default)(500, null, '参数错误, 保存失败');
      }
    } else {
      ctx.status = 200;
      ctx.body = (0, _htr.default)(500, null, '内容不完整, 评论保存失败');
    }
  }); // 获取评论等数据

  router.get(api.comments, ctx => {
    const {
      id
    } = ctx.query;
    const filePath = `${_config.default.publicPath}/db/comment/${id}.json`;

    if (id) {
      if (!_fs.default.existsSync(filePath)) {
        ctx.body = (0, _htr.default)(200, []);
      } else {
        const str = _fs.default.readFileSync(filePath);

        try {
          const data = JSON.parse(str);
          ctx.body = (0, _htr.default)(200, data ? data : []);
        } catch (err) {
          ctx.status = 200;
          ctx.body = (0, _htr.default)(500, null, '解析失败');
        }
      }
    } else {
      ctx.status = 200;
      ctx.body = (0, _htr.default)(500, null, '参数错误');
    }
  }); // 删除评论

  router.delete(api.del, _service.auth, async ctx => {
    const {
      id,
      cid
    } = ctx.query;

    if (id) {
      const filePath = `${_config.default.publicPath}/db/comment/${id}.json`;

      if (!_fs.default.existsSync(filePath)) {
        ctx.body = (0, _htr.default)(500, null, '文件不存在, 删除失败');
      } else {
        const str = _fs.default.readFileSync(filePath);

        try {
          const data = JSON.parse(str);
          data.comments = data.comments.filter((item, i) => {
            return item.cid !== cid;
          });
          res = await (0, _upload.wfPromise)(filePath, data, 1);

          if (res) {
            ctx.status = 200;
            ctx.body = (0, _htr.default)(200, null, '删除成功');
          } else {
            ctx.status = 200;
            ctx.body = (0, _htr.default)(500, null, '服务器错误');
          }
        } catch (err) {
          ctx.status = 200;
          ctx.body = (0, _htr.default)(500, null, '数据解析错误');
        }
      }
    } else {
      ctx.status = 200;
      ctx.body = (0, _htr.default)(500, null, 'id不能为空');
    }
  }); // 点赞功能

  router.post(api.doZan, async ctx => {
    let {
      id,
      flover
    } = ctx.request.body;

    if (id) {
      const filePath = `${_config.default.publicPath}/db/comment/${id}.json`;

      try {
        let res = '';

        if (!_fs.default.existsSync(filePath)) {
          res = await (0, _upload.wfPromise)(filePath, {
            flovers: flover ? 1 : 0
          }, 1);
        } else {
          const dataStr = _fs.default.readFileSync(filePath);

          const data = dataStr ? JSON.parse(dataStr) : {
            flovers: 0
          };
          data.flovers = flover ? ++data.flovers : --data.flovers;
          res = await (0, _upload.wfPromise)(filePath, data, 1);
        }

        if (res) {
          ctx.body = (0, _htr.default)(200, null, '点赞成功');
        } else {
          ctx.body = (0, _htr.default)(500, null, '服务器错误');
        }
      } catch (err) {
        ctx.status = 200;
        ctx.body = (0, _htr.default)(500, null, '参数错误, 点赞失败');
      }
    } else {
      ctx.status = 200;
      ctx.body = (0, _htr.default)(500, null, '内容不完整, 点赞失败');
    }
  });
};

var _default = commentRouter;
exports.default = _default;