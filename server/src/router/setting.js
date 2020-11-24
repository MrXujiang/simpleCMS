import fs from 'fs'
import { WF, RF, delFile } from '../lib/upload'
import { auth } from '../service'
import config from '../config'
import htr from '../lib/htr'
import httpException from '../lib/httpException'

const adsRouter = (router, apiPath) => {
  // api路径
  const api = {
    setting: apiPath + '/setting/get',
    saveLogo: apiPath + '/setting/logo',
    saveNav: apiPath + '/setting/nav',
    saveColumn: apiPath + '/setting/column',
    saveBanner: apiPath + '/setting/banner',
    saveCor: apiPath + '/setting/cor',
    delCor: apiPath + '/setting/cor/del',
    delBanner: apiPath + '/setting/banner/del'
  }
  // 获取网站配置信息
  router.get(api.setting,
    auth,
    async ctx => {
        const filePath = `${config.publicPath}/db/setting.json`;
        const data = RF(filePath);
        if(data) {
            ctx.status = 200
            ctx.body = htr(200, data)
        }else {
            const setting = {
                logo: '',
                navList: {
                    all: [
                        {
                            name: '首页',
                            path: '/'
                        },
                        {
                            name: '课程中心',
                            path: '/courses'
                        },
                        {
                            name: '精华文章',
                            path: '/articles'
                        },
                        {
                            name: '活动',
                            path: '/activities'
                        },
                        {
                            name: '互联网吐槽墙',
                            path: '/ventWall'
                        }
                    ],
                    cur: [
                        {
                            name: '首页',
                            path: '/'
                        }
                    ]
                },
                column: [],
                banners: [],
                cors: []
            }
            WF(filePath, setting)
            ctx.status = 200
            ctx.body = htr(200, setting)
        }
    }
  );

  // 保存logo
  router.post(api.saveLogo,
    auth,
    ctx => {
      const { url } = ctx.request.body || {}
      if(url) {
        const filePath = `${config.publicPath}/db/setting.json`
        const data = RF(filePath)
        const res = WF(filePath, { logo: url }, data ? 1 : 0)
        ctx.status = res ? 200 : 500
        ctx.body = res ? htr(200, null, '保存成功') : htr(500, null, '服务器错误')
      }else {
        ctx.status = 400
        ctx.body = htr(400, null, '参数不能为空')
      }
    }
  );

  // 保存导航
  router.post(api.saveNav,
    auth,
    ctx => {
        const { curList } = ctx.request.body || {}
        if(curList && curList.length) {
          const filePath = `${config.publicPath}/db/setting.json`
          const data = RF(filePath)
          if(data) {
            const navList = Object.assign(data.navList, {cur: curList})
            const res = WF(filePath, { navList }, 1)
            ctx.status = res ? 200 : 500
            ctx.body = res ? htr(200, null, '保存成功') : htr(500, null, '服务器错误')
          }else {
            ctx.status = 500
            ctx.body = htr(500, null, '服务器错误')
          }
        }else {
          ctx.status = 400
          ctx.body = htr(400, null, '参数不能为空')
        }
    }
  );

  // 保存栏目
  router.post(api.saveColumn,
    auth,
    ctx => {
        const { column } = ctx.request.body || {}
        if(column && column.length) {
          const filePath = `${config.publicPath}/db/setting.json`
          const data = RF(filePath)
          if(data) {
            const res = WF(filePath, { column  }, 1)
            ctx.status = res ? 200 : 500
            ctx.body = res ? htr(200, null, '保存成功') : htr(500, null, '服务器错误')
          }else {
            ctx.status = 500
            ctx.body = htr(500, null, '服务器错误')
          }
        }else {
          ctx.status = 400
          ctx.body = htr(400, null, '参数不能为空')
        }
    }
  );

  // 添加/修改banner
  router.post(api.saveBanner,
    auth,
    ctx => {
        const { banner } = ctx.request.body || {}
        if(banner) {
          const filePath = `${config.publicPath}/db/setting.json`
          const data = RF(filePath)
          if(data) {
            const { banners } = data
            const curIndex = banners.findIndex(item => item.key === banner.key)
            if(curIndex < 0) {
                banners.push(banner)
            }else {
                banners[curIndex] = banner
            }
            const res = WF(filePath, { banners }, 1)
            ctx.status = res ? 200 : 500
            ctx.body = res ? htr(200, banners, '保存成功') : htr(500, null, '服务器错误')
          }else {
            ctx.status = 500
            ctx.body = htr(500, null, '服务器错误')
          }
        }else {
          ctx.status = 400
          ctx.body = htr(400, null, '参数不能为空')
        }
    }
  );

  router.delete(api.delBanner,
    auth,
    async ctx => {
      const { key } = ctx.query
      if(key) {
        const filePath = `${config.publicPath}/db/setting.json`
        const data = RF(filePath)
        if(data) {
          const { banners } = data
          const newBanners = banners.filter(item => item.key !== +key)
          const res = WF(filePath, { banners: newBanners }, 1)
          ctx.status = res ? 200 : 500
          ctx.body = res ? htr(200, newBanners, '删除成功') : htr(500, null, '服务器错误')
        }else {
          ctx.status = 500
          ctx.body = htr(500, null, '服务器错误')
        }
      }else {
        ctx.status = 400
        ctx.body = htr(400, null, '参数不能为空')
      }
    }
  );

  router.delete(api.delCor,
    auth,
    async ctx => {
      const { type } = ctx.query
      const filePath = `${config.publicPath}/db/ads/${type}.json`
      if(fs.existsSync(filePath)) {
        
      }else {
        ctx.body = htr(500, null, '已删除')
      }
    }
  )
}

export default adsRouter