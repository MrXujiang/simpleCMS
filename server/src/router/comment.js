import fs from 'fs'
import { wfPromise } from '../lib/upload'
import { auth } from '../service'
import config from '../config'
import htr from '../lib/htr'

const commentRouter = (router, apiPath) => {
  // api路径
  const api = {
    add: apiPath + '/comment/add',
    comments: apiPath + '/comment/get',
    del: apiPath + '/comment/del',
    doZan: apiPath + '/article/addflover'
  }
  // 添加评论
  router.post(api.add,
    async ctx => {
      let { id, text } = ctx.request.body;
      if( id && text) {
        const filePath = `${config.publicPath}/db/comment/${id}.json`;
        const cid = Date.now();
        try {
          let res = '',
              data
          if(!fs.existsSync(filePath)) {
            res = await wfPromise(filePath, {comments: [{text, cid}] }, 1)
            data = {comments: [{text, cid}]}
          }else {
            const dataStr = fs.readFileSync(filePath)
            data = dataStr ? JSON.parse(dataStr) : {comments: []}
            data.comments ? data.comments.push({text, cid}) : (data.comments = [{text, cid}])
            res = await wfPromise(filePath, data, 1)
          }
          if(res) {
            ctx.body = htr(200, data.comments, '评论成功')
          }else {
            ctx.body = htr(500, null, '服务器错误')
          }
        }catch(err) {
          ctx.status = 200
          ctx.body = htr(500, null, '参数错误, 保存失败')
        }
      }else {
        ctx.status = 200
        ctx.body = htr(500, null, '内容不完整, 评论保存失败')
      }
    }
  );

  // 获取评论等数据
  router.get(api.comments,
    ctx => {
      const { id } = ctx.query
      const filePath = `${config.publicPath}/db/comment/${id}.json`
      if(id) {
        if(!fs.existsSync(filePath)) {
          ctx.body = htr(200, [])
        }else {
          const str = fs.readFileSync(filePath)
          try {
            const data = JSON.parse(str)
            ctx.body = htr(200, data ? data : [])
          }catch(err) {
            ctx.status = 200
            ctx.body = htr(500, null, '解析失败')
          }
        }
      }else {
        ctx.status = 200
          ctx.body = htr(500, null, '参数错误')
      }
    }
  );

  // 删除评论
  router.delete(api.del,
    auth,
    async ctx => {
      const { id, cid } = ctx.query
      if(id) {
        const filePath = `${config.publicPath}/db/comment/${id}.json`
        if(!fs.existsSync(filePath)) {
          ctx.body = htr(500, null, '文件不存在, 删除失败')
        }else {
          const str = fs.readFileSync(filePath)
          try{
            const data = JSON.parse(str)
            data.comments = data.comments.filter((item, i) => {
              return item.cid !== cid
            })
            res = await wfPromise(filePath, data, 1)
            if(res) {
              ctx.status = 200
              ctx.body = htr(200, null, '删除成功')
            }else {
              ctx.status = 200
              ctx.body = htr(500, null, '服务器错误')
            }
          }catch(err){
            ctx.status = 200
            ctx.body = htr(500, null, '数据解析错误')
          }
        }
      }else {
        ctx.status = 200
        ctx.body = htr(500, null, 'id不能为空')
      }  
    }
  );

  // 点赞功能
  router.post(api.doZan,
    async ctx => {
      let { id, flover } = ctx.request.body;
      if(id) {
        const filePath = `${config.publicPath}/db/comment/${id}.json`;
        try {
          let res = ''
          if(!fs.existsSync(filePath)) {
            res = await wfPromise(filePath, {flovers: flover ? 1 : 0 }, 1)
          }else {
            const dataStr = fs.readFileSync(filePath)
            const data = dataStr ? JSON.parse(dataStr) : {flovers: 0}
            data.flovers = flover ? ++data.flovers : --data.flovers
            res = await wfPromise(filePath, data, 1)
          }
          if(res) {
            ctx.body = htr(200, null, '点赞成功')
          }else {
            ctx.body = htr(500, null, '服务器错误')
          }
        }catch(err) {
          ctx.status = 200
          ctx.body = htr(500, null, '参数错误, 点赞失败')
        }
      }else {
        ctx.status = 200
        ctx.body = htr(500, null, '内容不完整, 点赞失败')
      }
    }
  );
}

export default commentRouter