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

export const SERVER_URL = isDev ? 'http://192.168.56.1:3000' : 'http://cms.zhikume.cn'

export const IP_URL = 'https://beian.miit.gov.cn/'

export const IP_ADDRESS = '鄂ICP备18024675号-2'
