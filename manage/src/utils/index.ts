import { get } from 'lodash'

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

export const phoneRE = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/

export const SERVER_URL = process.env.NODE_ENV === 'development' ? 'localhost:3000' : '49.234.61.19:3000'