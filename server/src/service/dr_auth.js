import { RF } from '../lib/upload'
import config from '../config'
import htr from '../lib/htr'
import { xib } from '../lib/tool'

const useVip = (ctx) => ({ co: ctx.cookies.get('vid'), n: decodeURIComponent(ctx.request.header['x-requested-with'])})
// 通用鉴权服务
const auth = async (ctx, next) => {
    const filePath = `${config.publicPath}/db/h5_vip/vip.json`;
    const { co, n } = useVip(ctx);
    const data = RF(filePath);
    const vip = data.filter(item => (item.n === n) && (item.co === xib.uxip(co)))[0];
    if(vip) {
        await next()
    }else {
        ctx.status = 403;
        ctx.body = htr(403, null, '会员登录过期,请重新登录')
    }  
}
// 超级管理员专享
const superEntry = async (ctx, next) => {
    const isSuper = ctx.cookies.get('rp') === 'STP06';
    if(isSuper) {
        await next()
    }else {
        ctx.status = 406;
        ctx.body = htr(406, null, '权限不足')
    }  
}

export {
    auth,
    superEntry,
    useVip
}