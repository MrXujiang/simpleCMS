// import request from '@/utils/req'

export async function getStatistics(): Promise<any> {
  return new Promise((resolve) => setTimeout(() => resolve([
    {
      title: '文章数',
      total: 22,
    },
    {
      title: '总访问量',
      total: 10000,
    },
    {
      title: '日访问量',
      total: 1000,
    },
    {
      title: '总点赞数',
      total: 8000,
    },
    {
      title: '广告点击总数',
      total: 100000,
    }
  ]), 1000))
  // return request('/api/currentUser')
}

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
        type: '家具家电',
        sales: 38,
      },
      {
        type: '粮油副食',
        sales: 52,
      },
      {
        type: '生鲜水果',
        sales: 61,
      },
      {
        type: '美容洗护',
        sales: 145,
      },
      {
        type: '母婴用品',
        sales: 48,
      },
      {
        type: '进口食品',
        sales: 38,
      },
      {
        type: '食品饮料',
        sales: 38,
      },
      {
        type: '家庭清洁',
        sales: 38,
      },
    ],
  }), 1000))
  // return request('/api/currentUser')
}
