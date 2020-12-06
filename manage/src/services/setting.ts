import request from '@/utils/req'
import { WebsiteType } from '@/models/setting'

export async function getWebsite(): Promise<any> {
  return request.get('/setting/website/get')
}

export async function saveWebsite(data: WebsiteType): Promise<any> {
  return request.put('/setting/website/save', data)
}