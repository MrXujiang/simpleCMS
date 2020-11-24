import koa from 'koa';
import staticServer from 'koa-static';
import fs from 'fs';
import koaBody from 'koa-body';
import glob from 'glob';
import config from './config';
import cors from 'koa2-cors';
import Router from '@koa/router';
import http from 'http';
import compress from 'koa-compress';
import views from 'koa-views';
import { resolve } from 'path';

const router = new Router()
// 启动逻辑
async function start() {
    const app = new koa();
    const server = http.createServer(app.callback());
    const io = require('socket.io')(server);
    // 开启gzip
    const options = { threshold: 2048 };
    app.use(compress(options));
    // 设置静态目录
    app.use(staticServer(config.publicPath, { maxage: 60 * 60 * 1000 }))
    app.use(staticServer(config.appStaticPath, { maxage: 60 * 60 * 1000 }))
    // 设置跨域
    app.use(cors({
        origin: function (ctx) {
            const whiteList = [
                'http://192.168.1.8:3000',
                'http://192.168.3.15:8000',
                'http://192.168.1.3:8000'
              ]; //可跨域白名单
            if (whiteList.includes(ctx.request.header.origin) && ctx.url.indexOf(config.API_VERSION_PATH) > -1) {
                return ctx.request.header.origin //注意，这里域名末尾不能带/，否则不成功，所以在之前我把/通过substr干掉了，允许来自指定域名请求, 如果设置为*，前端将获取不到错误的响应头
            }
            return ''
        },
        exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'x-show-msg'],
        maxAge: 5,  //  该字段可选，用来指定本次预检请求的有效期，单位为秒
        credentials: true,
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    }))

    app.use(koaBody());

    // 渲染页面
    app.use(async (ctx, next) => {
        if(/^\/admin/g.test(ctx.path)) {
            ctx.type = 'html'
            ctx.body = fs.createReadStream(config.adminPath)
            return
        }
        await next()
    })

    // 挂载路由
    glob.sync(`${config.routerPath}/*.js`).forEach(item => {
        require(item).default(router, config.API_VERSION_PATH, io)
    })

    //使用模版引擎
    app.use(views(resolve(__dirname, './views'), { extension: 'pug' }));
      
    app.use(router.routes()).use(router.allowedMethods())

    // io
    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('doc load', (msg) => {
          console.log('doc load', msg)
          io.emit('getData', users)
        })
      });

    server.listen(config.serverPort, () => {
        console.log(`服务器地址:${config.staticPath}`)
    });
}

start()