import token from '../config/secret'

// router或者koa的中间件一定要用await处理next，否则将不能正常响应数据
export default async (ctx, next) => {
  const t = ctx.request.header.authorization
  let uid = ctx.request.header['x-requested-with']
  let uidArr = uid.split(',')
  if(uidArr.length > 1) {
      uid = uidArr.pop().trim()
  }
    if(token[uid] && token[uid][1] === t) {
        await next()
    }else {
        ctx.status = 403;
        ctx.body = {
            state: 403,
            msg: '你没有权限操作'
        }
    }  
}