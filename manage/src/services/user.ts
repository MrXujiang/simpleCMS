// import request from '@/utils/request';

export async function getUserInfo(): Promise<any> {
  return new Promise((resolve) => setTimeout(() => resolve({
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    name: 'Serati Ma',
  }), 500))
  // return request('/api/currentUser');
}
