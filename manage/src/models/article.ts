import { Effect, Reducer } from 'umi'

import {
  getAll,
  getAllDrafts,
  getArticleDetail,
  getDraftDetail,
  del,
  delDraft,
  add,
  mod,
  save,
  edit,
} from '@/services/article'

export interface ArticleType {
  fid: string
  title: string
  author: string
  label: []
  visible: number
  content: any
  type: number
  ct: number
}

export type ArticleList = ArticleType[]

export interface ArticleState {
  articleList: ArticleList
  draftList: ArticleList
  articleDetail: ArticleType
  isLoading: boolean
}

interface ArticleModelType {
  namespace: 'article'
  state: ArticleState
  effects: {
    getAll: Effect,
    getAllDrafts: Effect,
    getArticleDetail: Effect,
    getDraftDetail: Effect,
    del: Effect,
    delDraft: Effect,
    add: Effect,
    mod: Effect,
    save: Effect,
    edit: Effect,
  }
  reducers: {
    startLoading: Reducer,
    closeLoading: Reducer,
    saveAll: Reducer,
    saveAllDrafts: Reducer,
    saveArticleDetail: Reducer,
  }
}

const ArticleModel: ArticleModelType = {
  namespace: 'article',
  state: {
    articleList: [],
    draftList: [],
    articleDetail: {
      fid: '',
      title: '',
      author: '',
      label: [],
      visible: 1,
      content: '',
      type: 0,
      ct: 0,
    },
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
    *getAllDrafts(_, { call, put }) {
      yield put({ type: 'startLoading' })
      const res = yield call(getAllDrafts)
      if (Array.isArray(res)) {
        yield put({
          type: 'saveAllDrafts',
          payload: res,
        })
      }
      yield put({ type: 'closeLoading' })
    },
    *getArticleDetail({ payload }, { call, put }) {
      yield put({ type: 'startLoading' })
      const res = yield call(getArticleDetail, payload)
      if (res && res.fid) {
        yield put({ type: 'saveArticleDetail', payload: res })
      }
      yield put({ type: 'closeLoading' })
      return res || {}
    },
    *getDraftDetail({ payload }, { call, put }) {
      yield put({ type: 'startLoading' })
      const res = yield call(getDraftDetail, payload)
      yield put({ type: 'closeLoading' })
      return res || {}
    },
    *del({ payload }, { call, put }) {
      yield put({ type: 'startLoading' })
      const res = yield call(del, payload)
      yield put({ type: 'closeLoading' })
      if (res && res.id) {
        yield put({ type: 'getAll' })
      }
    },
    *delDraft({ payload }, { call, put }) {
      yield put({ type: 'startLoading' })
      const res = yield call(delDraft, payload)
      yield put({ type: 'closeLoading' })
      if (res && res.id) {
        yield put({ type: 'getAllDrafts' })
      }
    },
    *add({ payload }, { call, put }) {
      yield put({ type: 'startLoading' })
      const res =  yield call(add, payload)
      yield put({ type: 'closeLoading' })
      return res || {}
    },
    *mod({ payload }, { call, put }) {
      yield put({ type: 'startLoading' })
      const res =  yield call(mod, payload)
      yield put({ type: 'closeLoading' })
      return res || {}
    },
    *save({ payload }, { call, put }) {
      yield put({ type: 'startLoading' })
      const res =  yield call(save, payload)
      yield put({ type: 'closeLoading' })
      return res || {}
    },
    *edit({ payload }, { call, put }) {
      yield put({ type: 'startLoading' })
      const res =  yield call(edit, payload)
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
    'saveAllDrafts'(state, { payload }) {
      return {...state, draftList: payload}
    },
    'saveArticleDetail'(state, { payload }) {
      return {...state, articleDetail: payload}
    },
  },
}

export default ArticleModel