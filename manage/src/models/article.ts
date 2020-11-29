import { Effect, Reducer } from 'umi'

import {
  getAll,
  getArticleDetail,
  del,
  add,
} from '@/services/article'

export interface ArticleType {
  fid: string
  title: string
  author: string
  label: []
  visible: number
  content?: any
  ct?: number
}

export type ArticleList = ArticleType[]

export interface ArticleState {
  articleList: ArticleList
  isLoading: boolean
}

interface ArticleModelType {
  namespace: 'article'
  state: ArticleState
  effects: {
    getAll: Effect,
    getArticleDetail: Effect,
    del: Effect,
    add: Effect,
  }
  reducers: {
    startLoading: Reducer,
    closeLoading: Reducer,
    saveAll: Reducer,
  }
}

const ArticleModel: ArticleModelType = {
  namespace: 'article',
  state: {
    articleList: [],
    isLoading: false,
  },
  effects: {
    *getAll(_, { call, put }) {
      yield put({ type: 'startLoading' })
      const res = yield call(getAll)
      if (Array.isArray(res)) {
        yield put({
          type: 'saveAll',
          payload: res,
        })
      }
      yield put({ type: 'closeLoading' })
    },
    *getArticleDetail({ payload }, { call, put }) {
      yield put({ type: 'startLoading' })
      const res = yield call(getArticleDetail, payload)
      yield put({ type: 'closeLoading' })
      return res || {}
    },
    *del({ payload }, { call, put }) {
      yield put({ type: 'startLoading' })
      yield call(del, payload)
      yield put({ type: 'closeLoading' })
    },
    *add({ payload }, { call, put }) {
      yield put({ type: 'startLoading' })
      const res =  yield call(add, payload)
      yield put({ type: 'closeLoading' })
      return res || {}
    },
  },
  reducers: {
    'startLoading'(state) {
      return {...state, isLoading: true}
    },
    'closeLoading'(state) {
      return {...state, isLoading: false}
    },
    'saveAll'(state, { payload }) {
      return {...state, articleList: payload}
    },
  },
}

export default ArticleModel