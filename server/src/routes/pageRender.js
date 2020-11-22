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
            contentShow: {
                'title': '文章标题文章标题文章标题文章标题', 
                'introduce': '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容容内容内容内容内容内容',
                'date': '2020-11-14',
                'author': 'Huxiaolei'
            },
            colunmList: [
                {title: '标题', introduction: '描述描述描述描述描述描述描述描述'}, 
                {title: '标题', introduction: '描述描述描述描述描述描述描述描述'}, 
                {title: '标题', introduction: '描述描述描述描述描述描述描述描述'}
            ],
            updataList: [
                {img: '/assets/home.jpeg',title: '标题', introduction: '描述描述描述描述描述描述描述描述',avatarName: 'huxiaolei', date: '11/14',},
                {img: '/assets/home.jpeg',title: '标题', introduction: '描述描述描述描述描述描述描述描述',avatarName: 'huxiaolei', date: '11/14',},
                {img: '/assets/home.jpeg',title: '标题', introduction: '描述描述描述描述描述描述描述描述',avatarName: 'huxiaolei', date: '11/14',}
            ]
        })
    }
    /**
     * 详情页
     * @param {*} ctx 
     * @param {*} next 
     */
    @get('/detail')
    async renderDetail(ctx, next) {
        await ctx.render('detail', {
            viewTitle: '文章标题文章标题文章标题文章标题',
            authorInfo: {name: 'huxialei', date: '2020-11-15'},
            descriptionBox: [
                '“服务设计”真正让所有人重视“用户”、重视“体验”这件事情，通过“服务设计”打通所有的节点（现在我们叫触点），把所有人调动起来。所以我认为，服务设计仅仅在“文化驱动”这个层面都是非常有价值的。 对于公司来说，“服务设计”是一个能够让公司所有的人都去接触客户，并且开始思考好的体验是什么样的一种理念。',
                '“体验设计”可以让你走好，“服务设计”可以让你走远。',
                '互联网常用的敏捷开发，核心是快。“我”要侧重做哪一个需求？“我”是先做哪个，或是后做哪一个才能保证快起来？“我”要去把需求管理起来，所以敏捷的“快”不是快，而是在于精准的需求管理与控制能力。',
                '不管是服务设计师也好，交互设计师也好，或者叫全链路设计师也好，他一定会参与到战略层里面去的。 一定是一个有经验的一个人，懂产品，也懂设计，也懂研究的这种人。',
                '如果“你”想把自己变成一个“T”型人才，或者是“π”型人才，你总要有一项能力是纵深的。',
                '先扩大自己的现有优势'
            ],
            commentInfoList: [
                {name: 'huxialei', date: '2020-11-15',content: '所以敏捷的“快”不是快，而是在于精准的需求管理与控制能力。'},
                {name: 'huxialei', date: '2020-11-15',content: '所以敏捷的“快”不是快，而是在于精准的需求管理与控制能力。'},
                {name: 'huxialei', date: '2020-11-15',content: '所以敏捷的“快”不是快，而是在于精准的需求管理与控制能力。'}
            ]
        })
    }
}

export default adminController
