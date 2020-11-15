import { controller, get, post, del, authAdmin } from '../lib/decorator'

@controller('')
class adminController {
    /**
     * 首页
     * @param {*} ctx 
     * @param {*} next 
     */
    @get('/')
    async renderHome(ctx, next) {
        console.log('/')
        await ctx.render('index', {
            name: 'xujiang',
            years: '248岁'
        })
    }
    /**
     * 详情页
     * @param {*} ctx 
     * @param {*} next 
     */
    @get('/detail')
    async renderDetail(ctx, next) {
        console.log('/detail')
        await ctx.render('view', {
            name: 'xujiang',
            years: '248岁'
        })
    }
}

export default adminController
