import { WF, RF } from '../lib/upload'
import { auth } from '../service'
import config from '../config'
import htr from '../lib/htr'

const settingRouter = (router, apiPath) => {
  // api路径
  const api = {
    setUserInfo: apiPath + '/setting/userInfo/save',
    userInfo: apiPath + '/setting/userInfo/get',
    setWebsite: apiPath + '/setting/website/save',
    website: apiPath + '/setting/website/get',
  }
  // 更新用户信息
  router.put(api.setUserInfo,
    auth,
    async ctx => {
      let { email, username, desc, country, addr, phone, wx, job, tx } = ctx.request.body;
      const filePath = `${config.publicPath}/db/setting.json`;
      
      if(username) {
        const res = WF(filePath, { userInfo: { email, username, desc, country, addr, tx, phone, wx, job } }, 1);
        if(res) {
          ctx.status = 200
          ctx.body = htr(200, null, '更新成功')
          return
        }

        ctx.status = 500
        ctx.body = htr(500, null, '服务器错误')
        
      }else {
        ctx.status = 500
        ctx.body = htr(500, null, '用户名必填')
      }
    }
  );

  // 查看用户信息
  router.get(api.userInfo,
    async ctx => {
      const filePath = `${config.publicPath}/db/setting.json`;
      const setting = RF(filePath);
      if(setting && setting.userInfo) {
          ctx.status = 200
          ctx.body = htr(200, setting.userInfo)
      }else {
        ctx.status = 500
        ctx.body = htr(500, null, '数据读取错误')
      }
    }
  );

  // 保存网站信息
  router.put(api.setWebsite,
    auth,
    async ctx => {
      let { logo, title, desc, r_text, r_link, theme } = ctx.request.body;
      const filePath = `${config.publicPath}/db/setting.json`;
      
      if(title) {
        const res = WF(filePath, { website: { logo, title, desc, r_text, r_link, theme } }, 1);
        if(res) {
          ctx.status = 200
          ctx.body = htr(200, null, '更新成功')
          return
        }

        ctx.status = 500
        ctx.body = htr(500, null, '服务器错误')
        
      }else {
        ctx.status = 500
        ctx.body = htr(500, null, '用户名必填')
      }
    }
  );

  // 查看用户信息
  router.get(api.website,
    async ctx => {
      const filePath = `${config.publicPath}/db/setting.json`;
      const setting = RF(filePath);
      if(setting && setting.website) {
          ctx.status = 200
          ctx.body = htr(200, setting.website)
      }else {
        ctx.status = 500
        ctx.body = htr(500, null, '数据读取错误')
      }
    }
  );
}

export default settingRouter