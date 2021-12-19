import { get } from 'lodash'

export const isDev = process.env.NODE_ENV === 'development'

export const title: string = 'simpleCMS'

export const TIME_FORMAT: string = 'YYYY-MM-DD HH:mm'

export const getImageUrl: (info: any) => string = info => {
  const imageUrl = get(info, 'file.response.result.url', '')
  return imageUrl
}

export const getFormdata: (info: any) => void = info => {
  const formdata = new FormData()
  formdata.append('file', info)
  return formdata
}

export const phoneRE = /^1[0-9]{10}$/

export const SERVER_URL = isDev ? 'http://192.168.1.9:3000' : (window.location.protocol + '//' + window.location.host)

export const IP_URL = 'http://h5.dooring.cn'

export const IP_ADDRESS = '趣谈前端'
