// import request from '@/utils/req'

export async function getConfiguration(): Promise<any> {
  return new Promise((resolve) => setTimeout(() => resolve({
    logo: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    name: 'name',
    description: 'description',
    text: 'text',
    link: 'link',
  }), 2000))
  // return request('/api/currentUser')
}