import request from '@/utils/req'

import { ArticleType } from '@/models/article'

export async function getAll(): Promise<any> {
  return request.get('/articles/all')
}

export async function getArticleDetail(payload: string): Promise<any> {
  return request.get(`/articles/get?id=${payload}`)
}

export async function del(id: string): Promise<any> {
  return request.delete(`/articles/del?id=${id}`)
}

export async function add(data: ArticleType): Promise<any> {
  return request.post('/articles/add', data)
}
