import logger from 'koa-logger';
import koaBody from 'koa-body';
import session from 'koa-session';
import cors from 'koa2-cors';
import sessionStore from '../lib/sessionStore';

// 设置日志
export const Logger = app => app.use(logger())
// 处理请求体
export const KoaBody = app => app.use(koaBody())

// 配置跨域资源共享
export const Cors = app => app.use(cors({
  origin: function (ctx) {
    const whiteList = [
        'http://192.168.1.8:3000',
        'http://192.168.3.15:8000'
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
  })
)

// 设置session
export const Session = app => {
    app.keys = ['xujiang']
    const SESSION_CONFIG = {
        key: 'zxzkCMS',
        maxAge: 12 * 60 * 60 * 1000,   // session的失效时间,设置为半天
        store: new sessionStore(),
        signed: true
    }

    app.use(session(SESSION_CONFIG, app));
}

// 统计网站数据
export const siteStatistics = app => app.use(async (ctx, next) => {
  if(ctx.url.indexOf('articleList?iSaJAx=isAjax') > -1) {
    // const views = await statisticsSchema.hget('views')
    // statisticsSchema.hmset('views', +views + 1)
  }
  await next()
})

// 获取客户端ip
const get_client_ip = function(req) {
  let ip = req.headers['x-forwarded-for'] ||
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress || '';
  if(ip.split(',').length>0){
      ip = ip.split(',')[0]
  }
  return ip;
};

