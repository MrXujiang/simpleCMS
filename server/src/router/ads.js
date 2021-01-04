import { RF, WF } from '../lib/upload'
import { auth } from '../service'
import config from '../config'
import htr from '../lib/htr'

const adsRouter = (router, apiPath) => {
  // api路径
  const api = {
    editAds: apiPath + '/ads/save',
    ads: apiPath + '/ads/get'
  }
  // 更改合作广告
  router.post(api.editAds,
    auth,
    async ctx => {
      let adForm = ctx.request.body;
      if(adForm) {
        // 1. 写入广告数据
        const filePath = `${config.publicPath}/db/ads.json`;
        try {
          const res = await WF(filePath, adForm)
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
    auth,
    ctx => {
      const filePath = `${config.publicPath}/db/ads.json`
      try {
        const data = RF(filePath)
        ctx.body = htr(200, data)
      }catch(err) {
        ctx.status = 200
        ctx.body = htr(500, null, '解析失败')
      }
    }
  );
}

export default adsRouter