import glob from 'glob'
import { uploadSingleCatchError, delFile } from '../lib/upload'
import config from '../config'
import htr from '../lib/htr'
import { auth } from '../service'

const uploadRouter = (router, apiPath) => {
    const api = {
      upload: apiPath + '/files/upload',
      uploadFree: apiPath + '/files/upload/free',
      uploadTx: apiPath + '/files/upload/tx',
      files: apiPath + '/files/all',
      del: apiPath + '/files/del',
    }
    // 上传文件
    router.post(api.upload, auth, uploadSingleCatchError,
      ctx => {
          let { filename, path, size } = ctx.file;
          let { source } = ctx.request.body || 'unknow';

          let url = `${config.staticPath}${path.split('/public')[1]}`
          
          ctx.body = htr(200, {filename, url, source, size}, '文件上传成功')
      }
    );

    // 免费上传文件
    router.post(api.uploadFree, uploadSingleCatchError,
      ctx => {
          let { filename, path, size } = ctx.file;
          let { source } = ctx.request.body || 'unknow';

          let url = `${config.staticPath}${path.split('/public')[1]}`
          
          ctx.body = htr(200, {filename, url, source, size}, '文件上传成功')
      }
    );

    router.post(api.uploadTx, uploadSingleCatchError,
      ctx => {
          let { filename, path, size } = ctx.file;
          let { source } = ctx.request.body || 'unknow';

          let url = `${config.staticPath}${path.split('/public')[1]}`
          
          ctx.body = htr(200, {filename, url, source, size}, '文件上传成功')
      }
    );

    // 读取文件
    router.get(api.files,
      ctx => {
          const files = glob.sync(`${config.publicPath}/uploads/*`)
          const result = files.map(item => {
              return `${config.staticPath}${item.split('public')[1]}`
          })
          ctx.body = htr(200, result)
      }
    );

    // 删除文件
    router.delete(api.del,
      auth,
      async ctx => {
        const { id } = ctx.query
        if(id) {
            const err = await delFile(`${config.publicPath}/uploads/${id}`)
            if(!err) {
              ctx.body = htr(200, null, '删除成功')
            }else {
              ctx.code = 500
              ctx.body = htr(500, null, '文件不存在，删除失败')
            } 
        }else {
            ctx.status = 200
            ctx.body = htr(500, null, 'id不能为空')
        }  
      }
    );
}

export default uploadRouter