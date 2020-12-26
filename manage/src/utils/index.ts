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

export const SERVER_URL = isDev ? '192.168.1.3:3000' : '49.234.61.19:3000'