import fs from 'fs'
import { WF, RF } from '../lib/upload'
import { controller, get, post, del } from '../lib/decorator'
import {
    
} from '../service/user'
import htr from '../lib/htr'
import { uuid, xib } from '../lib/tool'
import config from '../config'

@controller('/api/v0/user')
class adminController {
    /**
     * 获取所有的管理员信息
     * @param {*} ctx 
     * @param {*} next 
     */
    @get('/login')
    async userLogin(ctx, next) {
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
}

export default adminController
