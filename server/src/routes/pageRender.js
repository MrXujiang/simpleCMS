import { controller, get, post, del, authAdmin } from '../lib/decorator'

@controller('/')
class adminController {
    /**
     * 获取所有的管理员信息
     * @param {*} ctx 
     * @param {*} next 
     */
    @get('/')
    async renderHome(ctx, next) {
        await ctx.render('index', {
            name: 'xujiang',
            years: '248岁'
        })
    }
}

export default adminController
