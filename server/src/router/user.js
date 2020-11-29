import fs from 'fs'
import { delFile, WF, RF } from '../lib/upload'
import { uuid, xib } from '../lib/tool'
import { auth } from '../service'
import config from '../config'
import htr from '../lib/htr'
/**
 * 文章路由
 * @param {*} router 
 * @param {*} apiPath
 * 待优化：1.将成功响应和失败响应统一封装 
 */
const userRouter = (router, apiPath) => {
  // api路径
  const api = {
    login: apiPath + '/user/login',
  }

  // 登录逻辑
  router.post(api.login,
    async ctx => {
        const { name, pwd } = ctx.request.body;
        const filePath = `${config.publicPath}/db/user/user.json`;
        const data = RF(filePath);
        const user = data.filter(item => (item.name === name) && (item.pwd === pwd))[0];
        if(user) {
            ctx.cookies.set('uid', xib.xip(pwd), { maxAge: 3 * 24 * 3600 * 1000 });
            ctx.cookies.set('rp', user.role,  { maxAge: 3 * 24 * 3600 * 1000 });
            ctx.status = 200;
            ctx.set('x-show-msg', 'zxzk_msg_200');
            const { name, role, uid } = user;
            ctx.body = htr(200, { name, role, uid, maxage: 3 * 24 * 3600 * 1000 }, '登录成功');
        }else {
            ctx.status = 500
            ctx.body = htr(500, null, '用户名/密码错误')
        }
    }
  );

}

export default userRouter