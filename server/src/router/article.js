import fs from 'fs'
import { delFile, WF, RF } from '../lib/upload'
import { uuid } from '../lib/tool'
import { auth } from '../service'
import config from '../config'
import htr from '../lib/htr'
import marked from 'marked'
import glob from 'glob'


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
    mod: apiPath + '/articles/mod',
    get: apiPath + '/articles/get',
    del: apiPath + '/articles/del',
    all: apiPath + '/articles/all',
    topArticle: apiPath + '/article/top',
    getArticleNum: apiPath + '/articles/num',
    getAnazly: apiPath + '/articles/anazly',
    comment: apiPath + '/article/comment/save',
    comments: apiPath + '/article/comments',
    addFlover: apiPath + '/article/flover/add',
    saveDraft: apiPath + '/articles/draft/save',
    getDrafts: apiPath + '/articles/drafts',
    getDraft: apiPath + '/articles/draft/get',
    delDraft: apiPath + '/articles/draft/del',
    editDraft: apiPath + '/articles/draft/edit'
  }
  // 添加文章
  router.post(api.add,
    auth,
    async ctx => {
      let { title, author, label, face_img, visible, type, desc, content } = ctx.request.body;
      if(title && label && content) {
        // 1. 写入文章数据
        const fid = uuid(6, 16);
        const ct = Date.now();
        const filename = `${config.publicPath}/db/articles/${fid}.json`;
        try {
          // type  0 富文本  1 markdown
          const res = WF(filename, { fid, title, author, face_img, label, ct, type, visible, content, html: type ? marked(content) : '' })
          if(res) {
            ctx.body = htr(200, {fid}, '文章发布成功')
          }
        }catch(err) {
          ctx.status = 200
          ctx.body = htr(500, null, '文章写入错误')
        }

        // 2. 将文章索引添加到索引文件中
        const indexFilePath = `${config.publicPath}/db/article_index.json`
        try{
          WF(indexFilePath, { fid, title, author, label, face_img, desc, visible, ct }, 1)
        }catch(err) {
          console.log('addArticle', err)
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
      let { fid, title, author, label, face_img, visible, type, desc, content, ct } = ctx.request.body;
      if(fid && title && author && label && content) {
        // 1. 更新文件
        const filePath = `${config.publicPath}/db/articles/${fid}.json`
        const ut = Date.now()
        try {
          const res = WF(filePath, { fid, title, author, face_img, label, ct, ut, type, visible, content, html: type ? marked(content) : '' })
          if(res) {
            ctx.body = htr(200, { fid }, '文章修改成功')
          }
        }catch(err) {
          ctx.status = 200
          ctx.body = htr(500, null, '服务器错误, 文章修改失败')
        }
        
        // 2. 修改文章索引
        const indexFilePath = `${config.publicPath}/db/article_index.json`
        
        try {
          let articles = RF(indexFilePath)
          articles = articles.map(item => {
            if(item.fid === fid) {
              return {
                fid, title, author, label, face_img, desc, visible, ct, ut
              }
            }
            return item
          })

          WF(indexFilePath, articles)
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
        if (!fs.existsSync(articlePath)) {
          ctx.status = 200
          ctx.body = htr(500, null, '文件不存在')
        }else {
          const articleStr = fs.readFileSync(articlePath);
          try{
            const article = JSON.parse(articleStr);
            ctx.body = htr(200, article)
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
      const { id } = ctx.query
      if(id) {
        const articlePath = `${config.publicPath}/db/articles/${id}.json`
        const articleIdxPath = `${config.publicPath}/db/article_index.json`
        // 1.删除文章
        if(fs.existsSync(articlePath)) {
          const err = await delFile(articlePath)
          if(!err) {
            ctx.body = htr(200, null, '删除成功')
  
            // 2.删除文章索引
            let articles = RF(articleIdxPath);
            articles = articles.filter(item => item.fid !== id);
            const res = WF(articleIdxPath, articles);
            if(res) {
              ctx.body = htr(200, { id }, '文章删除成功')
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
        const articleIdxs = RF(articleIdxPath)
        ctx.body = htr(200, articleIdxs.reverse())
      }else {
        ctx.body = htr(200, [])
      } 
    }
  );

  // 置顶文章
  router.post(api.topArticle,
    auth,
    ctx => {
      const { fid } = ctx.query
      if(fid) {
        const articleIdxPath = `${config.publicPath}/db/article_index.json`
        let articleIdxs = RF(articleIdxPath)
        articleIdxs = articleIdxs.map(item => {
          return {
            ...item,
            top: item.fid === fid
          }
        })

        WF(articleIdxPath, articleIdxs)

        ctx.status = 200
        ctx.body = htr(200, null, '已置顶')
      }else {
        ctx.status = 500
        ctx.body = htr(500, null, '参数不能为空')
      } 
    }
  );

  // 获取文章总数
  router.get(api.getArticleNum,
    ctx => {
      const articleIdxPath = `${config.publicPath}/db/article_index.json`
      const articleIdxs = RF(articleIdxPath)
      ctx.body = htr(200, {num: articleIdxs.length})
    }
  );

  // 获取文章统计数据(访问量, 点赞数, 评论数)
  router.get(api.getAnazly,
    auth,
    ctx => {
      const result = {
        flovers: 0,
        comments: 0,
        views: 0
      };
      glob.sync(`${config.publicPath}/db/comments/*.json`).forEach(item => {
        const row = RF(item);
        result.flovers += row.flover;
        result.comments += row.comments.length;
        result.views += row.views;
      })
      ctx.body = htr(200, result)
    }
  );

  
  /******* 评论/点赞功能 **************/
  // 评论
  router.post(api.comment,
    ctx => {
      let { id, comment } = ctx.request.body;
      if(id && comment) {
        const commentPath = `${config.publicPath}/db/comments/${id}.json`
        const res = RF(commentPath)
        let result
        if(res) {
          if(res.comments) {
            res.comments = [...res.comments, comment]
            result = WF(commentPath, res)
          }else {
            res.comments = [comment]
            result = WF(commentPath, res)
          }
        }else {
          const comment_config = {
            flover: 0,
            comments: [comment],
            views: 1
          }
          result = WF(commentPath, comment_config)
        }

        if(result) {
          ctx.status = 200
          ctx.body = htr(200, null, '评论成功')
          return
        }

        ctx.status = 500
        ctx.body = htr(500, null, '服务器错误')
      }else {
        ctx.status = 200
        ctx.body = htr(500, null, '缺少参数')
      }
    }
  );

  // 点赞
  router.post(api.addFlover,
    ctx => {
      let { id } = ctx.request.body;
      if(id) {
        const commentPath = `${config.publicPath}/db/comments/${id}.json`
        const res = RF(commentPath)
        let result
        if(res) {
          if(res.flover) {
            res.flover = res.flover + 1
            result = WF(commentPath, res)
          }else {
            res.flover = 1
            result = WF(commentPath, res)
          }
        }else {
          const comment_config = {
            flover: 1,
            comments: [],
            views: 1
          }
          result = WF(commentPath, comment_config)
        }
        
        if(result) {
          ctx.status = 200
          ctx.body = htr(200, null, '已赞')
          return
        }

        ctx.status = 500
        ctx.body = htr(500, null, '服务器错误')
      }else {
        ctx.status = 200
        ctx.body = htr(500, null, '缺少参数')
      }
    }
  );

  // 获取文章访问量, 点赞数据
  router.get(api.comments,
    ctx => {
      let { id } = ctx.query;
      if(id) {
        const commentPath = `${config.publicPath}/db/comments/${id}.json`
        const res = RF(commentPath)
        let result
        if(res) {
          res.views = res.views + 1;
          result = res
        }else {
          const comment_config = {
            flover: 0,
            comments: [],
            views: 1
          }
          result = comment_config
        }
        
        if(result) {
          ctx.status = 200
          ctx.body = htr(200, result)
          WF(commentPath, result)
          return
        }

        ctx.status = 500
        ctx.body = htr(500, null, '服务器错误')
      }else {
        ctx.status = 200
        ctx.body = htr(500, null, '缺少参数')
      }
    }
  );
  
  /************* 草稿功能 ************/
  // 保存草稿
  router.post(api.saveDraft,
    auth,
    async ctx => {
      let { title, author, label, face_img, visible, desc, type, content } = ctx.request.body;
      if(title) {
        // 1. 写入文章数据
        const fid = uuid(6, 16);
        const filename = `${config.publicPath}/db/drafts/${fid}.json`;
        const ct = Date.now();
        try {
          // type  0 富文本  1 markdown
          const res = WF(filename, { fid, title, author, face_img, label, ct, type, visible, content, html: type ? marked(content) : '' })
          if(res) {
            ctx.body = htr(200, {fid}, '草稿保存成功')
          }
        }catch(err) {
          ctx.status = 200
          ctx.body = htr(500, null, '草稿写入错误')
        }

        // 2. 将草稿文章索引添加到索引文件中
        const indexFilePath = `${config.publicPath}/db/draft_index.json`
        try{
          WF(indexFilePath, { fid, title, author, label, face_img, desc, visible, ct }, 1)
        }catch(err) {
          console.log('saveDraft', err)
        }

      }else {
        ctx.code = 500
        ctx.body = htr(500, null, '标题不能为空, 草稿保存失败')
      }
    }
  );

  // 修改草稿
  router.put(api.editDraft,
    auth,
    async ctx => {
      let { fid, title, author, label, face_img, visible, type, desc, content, ct } = ctx.request.body;
      if(fid && title && author && label && content) {
        // 1. 更新文件
        const filePath = `${config.publicPath}/db/drafts/${fid}.json`
        const ut = Date.now()
        try {
          const res = WF(filePath, { fid, title, author, face_img, label, ct, ut, type, visible, content, html: type ? marked(content) : '' })
          if(res) {
            ctx.body = htr(200, { fid }, '草稿修改成功')
          }
        }catch(err) {
          ctx.status = 200
          ctx.body = htr(500, null, '服务器错误, 文章修改失败')
        }
        
        // 2. 修改文章索引
        const indexFilePath = `${config.publicPath}/db/draft_index.json`
        
        try {
          let articles = RF(indexFilePath)
          articles = articles.map(item => {
            if(item.fid === fid) {
              return {
                fid, title, author, label, face_img, visible, desc, ct: item.ct, ut
              }
            }
            return item
          })

          WF(indexFilePath, articles)
        }catch(err) {
          console.log('mod draft', err)
        }
      }else {
        ctx.code = 500
        ctx.body = htr(500, null, '内容不完整, 草稿修改失败')
      }
    }
  );

  // 获取草稿箱内容列表
  router.get(api.getDrafts,
    auth,
    ctx => {
      const draftIdxPath = `${config.publicPath}/db/draft_index.json`
      const drafts = RF(draftIdxPath)
      ctx.body = htr(200, drafts)
    }
  )

  // 查看草稿
  router.get(api.getDraft,
    ctx => {
      let { id } = ctx.query;
      if(id) {
        const draftPath = `${config.publicPath}/db/drafts/${id}.json`
        if (!fs.existsSync(draftPath)) {
          ctx.status = 200
          ctx.body = htr(500, null, '文件不存在')
        }else {
          const articleStr = fs.readFileSync(draftPath);
          try{
            const article = JSON.parse(articleStr);
            ctx.body = htr(200, article)
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

  // 删除草稿
  router.delete(api.delDraft,
    auth,
    async ctx => {
      const { id } = ctx.query
      if(id) {
        const articlePath = `${config.publicPath}/db/drafts/${id}.json`
        const articleIdxPath = `${config.publicPath}/db/draft_index.json`

        if(fs.existsSync(articlePath)) {
          const err = await delFile(articlePath)
          if(!err) {
            ctx.body = htr(200, null, '删除成功')
  
            // 2.删除文章索引
            let articles = RF(articleIdxPath);
            articles = articles.filter(item => item.fid !== id);
            const res = WF(articleIdxPath, articles);
            if(res) {
              ctx.body = htr(200, { id }, '草稿删除成功')
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
}

export default articleRouter