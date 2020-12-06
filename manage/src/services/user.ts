import request from '@/utils/req'
import { CurrentUser } from '@/models/user'

export async function getUserInfo(): Promise<any> {
  return request.get('/setting/userInfo/get')
}

export async function saveUserInfo(data: CurrentUser): Promise<any> {
  return request.put('/setting/userInfo/save', data)
}

interface LoginParams {
  username: string,
  password: string,
}

export async function login({ username, password }: LoginParams): Promise<any> {
  return request.post('/user/login', { name: username, pwd: password }).catch(e => console.log(e))
}

export async function forget(): Promise<any> {
  return new Promise((resolve) => setTimeout(() => resolve(), 1000))
  // return request('/api/currentUser')
}
