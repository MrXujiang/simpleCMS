// import request from '@/utils/req'

import { AdvertInfo } from '@/models/advert'

export async function getAdvertInfo(): Promise<any> {
  return new Promise((resolve) => setTimeout(() => resolve({
    topLink: 'xxx',
    topImgUrl: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    topDesc: 'xxxxxxx',
    sideLink: 'xxx',
    sideImgUrl: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    sideDesc: 'xxxxxxx',
  }), 1000))
  // return request('/api/currentUser')
}

export async function publishAdvert(data: AdvertInfo): Promise<any> {
  return new Promise((resolve) => setTimeout(() => resolve(data), 1000))
  // return request('/api/currentUser')
}
