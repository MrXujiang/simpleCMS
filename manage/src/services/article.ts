import request from '@/utils/req'
import { ArticleType } from '@/models/article'

export async function getAll(): Promise<any> {
  return request.get('/articles/all')
}

export async function getAllDrafts(): Promise<any> {
  return request.get('/articles/drafts')
}

export async function getArticleDetail(payload: string): Promise<any> {
  return request.get(`/articles/get?id=${payload}`)
}

export async function getDraftDetail(payload: string): Promise<any> {
  return request.get(`/articles/draft/get?id=${payload}`)
}

export async function del(id: string): Promise<any> {
  return request.delete(`/articles/del?id=${id}`)
}

export async function delDraft(id: string): Promise<any> {
  return request.delete(`/articles/draft/del?id=${id}`)
}

export async function add(data: ArticleType): Promise<any> {
  return request.post('/articles/add', data)
}

export async function mod(data: ArticleType): Promise<any> {
  return request.put('/articles/mod', data)
}

export async function save(data: ArticleType): Promise<any> {
  return request.post('/articles/draft/save', data)
}

export async function edit(data: ArticleType): Promise<any> {
  return request.put('/articles/draft/edit', data)
}

export async function anazly(): Promise<any> {
  return request.get('/articles/anazly')
}

export async function top(fid: string): Promise<any> {
  return request.post(`/article/top?fid=${fid}`)
}

export async function untop(fid: string): Promise<any> {
  return request.post(`/article/untop?fid=${fid}`)
}

export async function upload(file: any): Promise<any> {
  return request.post('/files/upload/free', file)
}

export async function weeklog(): Promise<any> {
  return request.get('/articles/weeklog')
}

export async function lock(fid: string): Promise<any> {
  return request.post(`/article/lock?fid=${fid}`)
}

export async function unlock(fid: string): Promise<any> {
  return request.post(`/article/unlock?fid=${fid}`)
}
