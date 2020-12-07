import request from '@/utils/req'

import { AdvertType } from '@/models/advert'

export async function get(): Promise<any> {
  return request.get('/ads/get')
}

export async function save(data: {topAd: AdvertType, sideAd: AdvertType}): Promise<any> {
  return request.post('/ads/save', data)
}