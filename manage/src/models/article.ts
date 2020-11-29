import { Effect, Reducer } from 'umi'

import {
  getAll,
  getArticleDetail,
  getEditorContent,
  del,
  add,
} from '@/services/article'

export interface ArticleType {
  id: string
  title: string
  author: string
  label: []
  visible: number,
  content?: any
}

export type ArticleList = ArticleType[]

export interface ArticleState {
  articleList: ArticleList
  articleContent: any
  isLoading: boolean
}

interface ArticleModelType {
  namespace: 'article'
  state: ArticleState
  effects: {
    getAll: Effect,
    getArticleDetail: Effect,
    getEditorContent: Effect,
    del: Effect,
    add: Effect,
  }
  reducers: {
    startLoading: Reducer,
    closeLoading: Reducer,
    saveAll: Reducer,
    saveEditorContent: Reducer,
  }
}

const ArticleModel: ArticleModelType = {
  namespace: 'article',
  state: {
    articleList: [],
    articleContent: '',
    isLoading: false,
  },
  effects: {
    *getAll(_, { call, put }) {
      const res = yield call(getAll)
      yield put({
        type: 'saveAll',
        payload: res,
      })
    },
    *getArticleDetail({ payload }, { call, put }) {
      yield put({ type: 'startLoading' })
      const res = yield call(getArticleDetail, payload)
      yield put({ type: 'closeLoading' })
      return res
    },
    *getEditorContent(_, { call, put }) {
      const res = yield call(getEditorContent)
      yield put({
        type: 'saveEditorContent',
        payload: res,
      })
      return res
    },
    *del({ payload }, { call, put }) {
      yield put({ type: 'startLoading' })
      const res = yield call(del, payload)
      if (res) {
        yield call(getEditorContent)
      }
      yield put({ type: 'closeLoading' })
    },
    *add({ payload }, { call, put }) {
      yield put({ type: 'startLoading' })
      yield call(add, payload)
      yield put({ type: 'closeLoading' })
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
    'saveEditorContent'(state, { payload }) {
      return {...state, articleContent: payload}
    },
  },
}

export default ArticleModel