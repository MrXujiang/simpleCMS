import { RF } from '../lib/upload'
import config from '../config'
import htr from '../lib/htr'
import { xib } from '../lib/tool'

const useVip = (ctx) => ({ co: ctx.cookies.get('uid'), n: decodeURIComponent(ctx.request.header['x-requested-with'])})

const auth = async (ctx, next) => {
    const filePath = `${config.publicPath}/db/user/user.json`;
    const { co, n } = useVip(ctx);
    const data = RF(filePath);
    const vip = data.filter(item => (item.name === n) && (item.pwd === xib.uxip(co)))[0];
    if(vip) {
        await next()
    }else {
        ctx.status = 403;
        ctx.body = htr(403, null, '会员登录过期,请重新登录')
    }  
}

export {
    auth
}