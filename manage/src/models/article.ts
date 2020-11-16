import { Effect, Reducer } from 'umi'

import {
  getArticleList,
  getArticleDetail,
  getEditorContent,
  deleteArticle,
  releaseArticle,
} from '@/services/article'

export interface ArticleType {
  key: string
  title: string
  description: string
  author: string
  labels: []
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
    getArticleList: Effect,
    getArticleDetail: Effect,
    getEditorContent: Effect,
    deleteArticle: Effect,
    releaseArticle: Effect,
  }
  reducers: {
    startLoading: Reducer,
    closeLoading: Reducer,
    saveArticleList: Reducer,
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
    *getArticleList(_, { call, put }) {
      const res = yield call(getArticleList)
      yield put({
        type: 'saveArticleList',
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
    *deleteArticle({ payload }, { call, put }) {
      yield put({ type: 'startLoading' })
      const res = yield call(deleteArticle, payload)
      if (res) {
        yield call(getEditorContent)
      }
      yield put({ type: 'closeLoading' })
    },
    *releaseArticle({ payload }, { call, put }) {
      yield put({ type: 'startLoading' })
      yield call(releaseArticle, payload)
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
    'saveArticleList'(state, { payload }) {
      return {...state, articleList: payload}
    },
    'saveEditorContent'(state, { payload }) {
      return {...state, articleContent: payload}
    },
  },
}

export default ArticleModel