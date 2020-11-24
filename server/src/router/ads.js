import fs from 'fs'
import { wfPromise, delFile } from '../lib/upload'
import { auth } from '../service'
import config from '../config'
import htr from '../lib/htr'

const adsRouter = (router, apiPath) => {
  // api路径
  const api = {
    editAds: apiPath + '/ads/cor/edit',
    ads: apiPath + '/ads/cor/get',
    adsDel: apiPath + '/ads/cor/del'
  }
  // 更改合作广告
  router.post(api.editAds,
    auth,
    async ctx => {
      let { type, list } = ctx.request.body;
      if( type && list) {
        // 1. 写入广告数据
        const filePath = `${config.publicPath}/db/ads/${type}.json`;
        try {
          const res = await wfPromise(filePath, list, 0, true)
          if(res) {
            ctx.body = htr(200, null, '保存成功')
          }
        }catch(err) {
          ctx.status = 200
          ctx.body = htr(500, null, '参数错误, 保存失败')
        }
      }else {
        ctx.status = 200
        ctx.body = htr(500, null, '内容不完整, 广告保存失败')
      }
    }
  );

  // 获取广告数据
  router.get(api.ads,
    ctx => {
      const { type } = ctx.query
      const filePath = `${config.publicPath}/db/ads/${type}.json`
      if(fs.existsSync(filePath)) {
        if(type) {
          const str = fs.readFileSync(filePath)
          try {
            const data = JSON.parse(str)
            ctx.body = htr(200, data ? data : [])
          }catch(err) {
            ctx.status = 200
            ctx.body = htr(500, null, '解析失败')
          }
        }else {
          ctx.status = 200
          ctx.body = htr(500, null, '参数错误')
        }
      }else {
        ctx.body = htr(200, [])
      }
    }
  );

  router.delete(api.adsDel,
    auth,
    async ctx => {
      const { type } = ctx.query
      const filePath = `${config.publicPath}/db/ads/${type}.json`
      if(fs.existsSync(filePath)) {
        try{
          const err = await delFile(filePath)
          if(!err) {
            ctx.body = htr(200, null, '删除成功')
          }else {
            ctx.body = 200
            ctx.body = htr(500, null, '系统错误')
          }
        }catch(err) {
          console.error(err)
        }
      }else {
        ctx.body = htr(500, null, '已删除')
      }
    }
  )
}

export default adsRouter