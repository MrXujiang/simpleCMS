"use strict";

var _koa = _interopRequireDefault(require("koa"));

var _koaStatic = _interopRequireDefault(require("koa-static"));

var _fs = _interopRequireDefault(require("fs"));

var _koaBody = _interopRequireDefault(require("koa-body"));

var _glob = _interopRequireDefault(require("glob"));

var _config = _interopRequireDefault(require("./config"));

var _koa2Cors = _interopRequireDefault(require("koa2-cors"));

var _router = _interopRequireDefault(require("@koa/router"));

var _http = _interopRequireDefault(require("http"));

var _koaCompress = _interopRequireDefault(require("koa-compress"));

var _koaViews = _interopRequireDefault(require("koa-views"));

var _koaLogger = _interopRequireDefault(require("koa-logger"));

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = new _router.default(); // 启动逻辑

async function start() {
  const app = new _koa.default();

  const server = _http.default.createServer(app.callback());

  const io = require('socket.io')(server);

  app.use((0, _koaLogger.default)()); // 开启gzip

  const options = {
    threshold: 2048
  };
  app.use((0, _koaCompress.default)(options)); // 设置静态目录

  app.use((0, _koaStatic.default)(_config.default.publicPath, {
    maxage: 60 * 60 * 1000
  }));
  app.use((0, _koaStatic.default)(_config.default.appStaticPath, {
    maxage: 60 * 60 * 1000
  })); // 设置跨域

  app.use((0, _koa2Cors.default)({
    origin: function (ctx) {
      const whiteList = ['http://192.168.1.8:3000', 'http://192.168.3.15:8000', 'http://192.168.1.3:8000', 'http://192.168.1.3:8001', 'http://localhost:3000']; //可跨域白名单

      if (whiteList.includes(ctx.request.header.origin) && ctx.url.indexOf(_config.default.API_VERSION_PATH) > -1) {
        return ctx.request.header.origin; //注意，这里域名末尾不能带/，否则不成功，所以在之前我把/通过substr干掉了，允许来自指定域名请求, 如果设置为*，前端将获取不到错误的响应头
      }

      return '';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'x-show-msg'],
    maxAge: 5,
    //  该字段可选，用来指定本次预检请求的有效期，单位为秒
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With']
  }));
  app.use((0, _koaBody.default)()); // 渲染页面

  app.use(async (ctx, next) => {
    if (/^\/admin/g.test(ctx.path)) {
      ctx.type = 'html';
      ctx.body = _fs.default.createReadStream(_config.default.adminPath);
      return;
    }

    await next();
  }); // 挂载路由

  _glob.default.sync(`${_config.default.routerPath}/*.js`).forEach(item => {
    require(item).default(router, _config.default.API_VERSION_PATH, io);
  }); //使用模版引擎


  app.use((0, _koaViews.default)((0, _path.resolve)(__dirname, './views'), {
    extension: 'pug'
  }));
  app.use(router.routes()).use(router.allowedMethods()); // io

  io.on('connection', socket => {
    console.log('a user connected');
    socket.on('doc load', msg => {
      console.log('doc load', msg);
      io.emit('getData', users);
    });
  });
  server.listen(_config.default.serverPort, () => {
    console.log(`服务器地址:${_config.default.staticPath}`);
  });
}

start();