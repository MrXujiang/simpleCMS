import request from '@/utils/req'
import { CurrentUser } from '@/models/user'

export async function getUserInfo(): Promise<any> {
  return request.get('/setting/userInfo/get')
}

export async function saveUserInfo(data: CurrentUser): Promise<any> {
  return request.put('/setting/userInfo/save', data)
}

interface LoginParams {
  name: string,
  pwd: string,
}

export async function login({ name, pwd }: LoginParams): Promise<any> {
  return request.post('/user/login', { name, pwd }).catch(e => console.error(e))
}
