// import request from '@/utils/req'
import { CurrentUser } from '@/models/user'

export async function getUserInfo(): Promise<any> {
  return new Promise((resolve) => setTimeout(() => resolve({
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    username: 'Serati Ma',
    email: '515151515@qq.com',
    introduction: 'Hello, my name is Serati Ma',
    country: 'china',
    address: 'ZheJiang',
    phone: '15105898989',
  }), 1000))
  // return request('/api/currentUser')
}

interface LoginParams {
  username: string,
  password: string,
}

export async function login({ username, password }: LoginParams): Promise<any> {
  return new Promise(resolve => setTimeout(() => {
    if (username === 'admin' && password === 'cms') {
      resolve({ token: 'xxxxxx' })
    }
  }, 1000))
  // return request('/api/currentUser')
}

export async function forget(): Promise<any> {
  return new Promise((resolve) => setTimeout(() => resolve(), 1000))
  // return request('/api/currentUser')
}

export async function modify(data: CurrentUser): Promise<any> {
  return new Promise((resolve) => setTimeout(() => resolve(data), 1000))
  // return request('/api/currentUser')
}
