import request from '@/utils/req'
import { SettingType } from '@/models/setting'

export async function getWebsite(): Promise<any> {
  return request.get('/setting/website/get')
}

export async function saveWebsite(data: SettingType): Promise<any> {
  return request.put('/setting/website/save', data)
}