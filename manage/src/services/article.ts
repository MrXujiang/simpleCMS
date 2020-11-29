import request from '@/utils/req'

import { ArticleType } from '@/models/article'

export async function getAll(): Promise<any> {
  return new Promise((resolve) => setTimeout(() => resolve(
    new Array(100).fill(1).map(() => ({
      key: Math.random(),
      title: '文章',
      author: 'John Brown',
      description: 'This book is very funny!',
      label: ['a10', 'b11'],
      visible: 1,
    }))
  ), 1000))
  return request.get('/articles/all')
  //.catch(e => console.log(e))
}

export async function getArticleDetail(payload: string): Promise<any> {
  return new Promise((resolve) => setTimeout(() => resolve({
    key: Math.random(),
    title: '文章',
    author: 'John Brown',
    label: ['a10', 'b11'],
    visible: 1,
  }), 1000))
  // return request('/api/currentUser')
}

export async function getEditorContent(): Promise<any> {
  return new Promise((resolve) => setTimeout(() => resolve('+ qw'), 1000))
  // return request('/api/currentUser')
}

export async function del(data: ArticleType): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(''), 1000)
  })
  // return request('/api/currentUser')
}

export async function add(data: ArticleType): Promise<any> {
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve('')
  //   }, 1000)
  // })
  return request.post('/articles/add', data)
}
