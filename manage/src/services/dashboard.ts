// import request from '@/utils/req'

export async function getChartsData(): Promise<any> {
  return new Promise((resolve) => setTimeout(() => resolve({
    articleVisits: [
      {
        year: '1991',
        value: 3,
      },
      {
        year: '1992',
        value: 4,
      },
      {
        year: '1993',
        value: 3.5,
      },
      {
        year: '1994',
        value: 5,
      },
      {
        year: '1995',
        value: 4.9,
      },
      {
        year: '1996',
        value: 6,
      },
      {
        year: '1997',
        value: 7,
      },
      {
        year: '1998',
        value: 9,
      },
      {
        year: '1999',
        value: 13,
      },
    ],
    articleLikes: [
      {
        type: '文章1',
        sales: 38,
      },
      {
        type: '文章2',
        sales: 52,
      },
      {
        type: '文章3',
        sales: 61,
      },
      {
        type: '文章4',
        sales: 145,
      },
      {
        type: '文章5',
        sales: 48,
      },
      {
        type: '文章6',
        sales: 38,
      },
      {
        type: '文章7',
        sales: 38,
      },
      {
        type: '文章8',
        sales: 38,
      },
    ],
  }), 1000))
  // return request('/api/currentUser')
}
