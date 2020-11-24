import fs from 'fs'
import { delFile, WF, RF } from '../lib/upload'
import { uuid } from '../lib/tool'
import { auth } from '../service'
import config from '../config'
import htr from '../lib/htr'
/**
 * 文章路由
 * @param {*} router 
 * @param {*} apiPath
 * 待优化：1.将成功响应和失败响应统一封装 
 */
const articleRouter = (router, apiPath) => {
  // api路径
  const api = {
    add: apiPath + '/articles/add',
    addRelativeArticle: apiPath + '/articles/addRelativeArticle',
    getRelativeArticle: apiPath + '/relativeArticles',
    mod: apiPath + '/articles/mod',
    get: apiPath + '/articles/get',
    del: apiPath + '/articles/del',
    all: apiPath + '/articles/all',
    saveDraft: apiPath + '/articles/draft/save',
    getDrafts: apiPath + '/articles/drafts',
    getDraft: apiPath + '/articles/draft/get'
  }
  // 添加文章
  router.post(api.add,
    auth,
    async ctx => {
      let { did, title, author, label, desc, type, content } = ctx.request.body;
      if(title && author && label && type && content) {
        // 1. 写入文章数据
        const uid = uuid(8, 10);
        const filename = `${config.publicPath}/db/articles/${uid}.json`;
        const id = 'ax_' + uid; 
        try {
          const res = WF(filename, { fid: uid, content })
          if(res) {
            ctx.body = htr(200, {id, fid: uid}, '文章发布成功')
          }
        }catch(err) {
          ctx.status = 200
          ctx.body = htr(500, null, '文章写入错误')
        }

        // 2. 将文章索引添加到索引文件中
        const indexFilePath = `${config.publicPath}/db/article_index.json`
        const ct = Date.now()
        try{
          WF(indexFilePath, { [uid] : { uid, title, author, label, type, ct, desc } }, 1)
        }catch(err) {
          console.log('addArticle', err)
        }

        // 3. 如果是草稿被发布，则删除对应草稿文件和索引
        if(did) {
          const draftPath = `${config.publicPath}/db/drafts/draft_${did}.json`
          const draftIdxPath = `${config.publicPath}/db/draft_index.json`
          if (fs.existsSync(draftPath) && fs.existsSync(draftIdxPath)) {
            delFile(draftPath)
            // 2.删除文章索引
            const draftIdxsStr = fs.readFileSync(draftIdxPath);
            try{
              const draftIdxs = JSON.parse(draftIdxsStr);
              delete draftIdxs[did]
              WF(draftIdxPath, draftIdxs)
            }catch(err) {
              console.error(err)
            }
          }
        }
      }else {
        ctx.code = 500
        ctx.body = htr(500, null, '内容不完整, 文章发布失败')
      }
    }
  );

  // 修改文章
  router.put(api.mod,
    auth,
    async ctx => {
      let { fid, title, author, label, desc, type, content } = ctx.request.body;
      if(fid && title && author && label && desc && type && content) {
        // 1. 更新文件
        const filePath = `${config.publicPath}/db/articles/${fid}.json`
        try {
          const res = await wfPromise(filePath, { fid, content }, 1)
          if(res) {
            ctx.body = htr(200, {fid}, '文章修改成功')
          }
        }catch(err) {
          ctx.status = 200
          ctx.body = htr(500, null, '服务器错误, 文章修改失败')
        }
        
        // 2. 修改文章索引
        const indexFilePath = `${config.publicPath}/db/article_index.json`
        const ut = Date.now()
        try {
          WF(indexFilePath, { [fid] : { uid: fid, title, author, label, type, ct: ut, desc } }, 1)
        }catch(err) {
          console.log('mod article', err)
        }
      }else {
        ctx.code = 500
        ctx.body = htr(500, null, '内容不完整, 文章发布失败')
      }
    }
  );

  // 查看文章
  router.get(api.get,
    ctx => {
      let { id } = ctx.query;
      if(id) {
        const articlePath = `${config.publicPath}/db/articles/${id}.json`
        const articleIdxPath = `${config.publicPath}/db/article_index.json`
        if (!fs.existsSync(articlePath) && !fs.existsSync(articleIdxPath)) {
          ctx.status = 200
          ctx.body = htr(500, null, '文件读取失败')
        }else {
          const articleStr = fs.readFileSync(articlePath);
          const articleIdxsStr = fs.readFileSync(articleIdxPath);
          try{
            const article = JSON.parse(articleStr);
            const articleIdxs = JSON.parse(articleIdxsStr);
            const data = {
              fid: article.fid,
              content: article.content,
              ...articleIdxs[id]
            }
            ctx.body = htr(200, data)
          }catch(err) {
            console.error(err)
          }
        }
      }else {
        ctx.status = 200
        ctx.body = htr(500, null, '参数不存在')
      }
    }
  );

  // 删除文章
  router.delete(api.del,
    auth,
    async ctx => {
      const { id, type } = ctx.query
      if(id && type) {
        const articlePath = `${config.publicPath}/db/articles/${id}.json`
        const articleIdxPath = `${config.publicPath}/db/article_index.json`
        // 1.删除文章
        if(fs.existsSync(articlePath)) {
          const err = await delFile(articlePath)
          if(!err) {
            ctx.body = htr(200, null, '删除成功')
  
            // 2.删除文章索引
            const articleIdxsStr = fs.readFileSync(articleIdxPath);
            try{
              const articleIdxs = JSON.parse(articleIdxsStr);
              delete articleIdxs[id]
              wfPromise(articleIdxPath, articleIdxs, 1, true).then(res => {
                // 
              }).catch(err => {
                console.error(err)
              })
            }catch(err) {
              console.error(err)
            }
          }else {
            ctx.status = 200
            ctx.body = htr(500, null, '文件不存在，删除失败')
          } 
        }else {
          ctx.body = htr(500, null, '文件不存在, 请刷新页面查看最新数据')
        }
        
      }else {
        ctx.status = 200
        ctx.body = htr(500, null, 'id不能为空')
      }  
    }
  );

  // 获取文章列表
  router.get(api.all,
    ctx => {
      const { q } = ctx.query
      if(!q) {
        const articleIdxPath = `${config.publicPath}/db/article_index.json`
        if(fs.existsSync(articleIdxPath)) {
          const articleIdxs = RF(articleIdxPath)
          ctx.body = htr(200, articleIdxs ? Object.values(articleIdxs) : [])
        }else {
          ctx.body = htr(200, [])
        }
      }else {

      } 
    }
  );

  /************* 草稿功能 ************/
  // 保存草稿
  router.post(api.saveDraft,
    auth,
    async ctx => {
      let { title, author, label, desc, type, content } = ctx.request.body;
      if(title) {
        // 1. 写入文章数据
        const uid = uuid(8, 10);
        const filename = `${config.publicPath}/db/drafts/draft_${uid}.json`;
        const id = 'DRAFT_' + uid; 
        try {
          const res = await wfsPromise(filename, { fid: uid, content })
          if(res) {
            ctx.body = htr(200, {id, fid: uid}, '草稿保存成功')
          }
        }catch(err) {
          ctx.status = 200
          ctx.body = htr(500, null, '文章写入错误')
        }

        // 2. 将文章索引添加到索引文件中
        const indexFilePath = `${config.publicPath}/db/${type}/draft_index.json`
        const ct = Date.now()
        wfPromise(indexFilePath, { [uid] : { uid, title, author, type, label, ct, desc } }, 1).then(res => {
          // 一些操作
        }).catch(err => {
          console.error(err)
        })

      }else {
        ctx.code = 500
        ctx.body = htr(500, null, '标题不能为空, 草稿保存失败')
      }
    }
  );

  // 获取草稿箱内容列表
  router.get(api.getDrafts,
    auth,
    ctx => {
      const draftIdxPath = `${config.publicPath}/db/draft_index.json`
      if(fs.existsSync(draftIdxPath)) {
        const drafts = RF(draftIdxPath)
        ctx.body = htr(200, drafts ? Object.values(drafts) : [])
      }else {
        ctx.body = htr(200, [])
      }
    }
  )

  // 查看草稿
  router.get(api.getDraft,
    ctx => {
      let { id } = ctx.query;
      if(id) {
        const draftPath = `${config.publicPath}/db/draft/draft_${id}.json`
        const draftIdxPath = `${config.publicPath}/db/draft_index.json`
        if (!fs.existsSync(draftPath) && !fs.existsSync(draftIdxPath)) {
          ctx.status = 200
          ctx.body = htr(500, null, '文件读取失败')
        }else {
          try{
            const draft = RF(draftPath);
            const draftIdxs = RF(draftIdxPath);
            const data = {
              fid: draft.fid,
              content: draft.content,
              ...draftIdxs[id]
            }
            ctx.body = htr(200, data)
          }catch(err) {
            console.error(err)
          }
        }
      }else {
        ctx.status = 200
        ctx.body = htr(500, null, '参数不存在')
      }
    }
  );
}

export default articleRouter