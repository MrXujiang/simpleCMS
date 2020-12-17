import { Effect, Reducer } from 'umi'

import {
  getAll, getAllDrafts, getArticleDetail, getDraftDetail,
  del, delDraft, add, mod, save, edit, anazly, top, untop,
  upload, weeklog,
} from '@/services/article'

export interface ArticleType {
  fid: string
  title: string
  author: string
  label: []
  visible: number
  face_img: string
  content: string
  html: string
  type: number
  ct: number
  ut: number
  top: boolean
}

export type ArticleList = ArticleType[]

export interface AnazlyType {
  flovers: number
  comments: number
  views: number
}

export interface ArticleState {
  isLoading: boolean
  isWeekLogLoading: boolean
  articleList: ArticleList
  draftList: ArticleList
  articleDetail: ArticleType
  draftDetail: ArticleType
  anazly: AnazlyType
  weekLog: any
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
    anazly: Effect,
    top: Effect,
    untop: Effect,
    upload: Effect,
    weeklog: Effect,
  }
  reducers: {
    startLoading: Reducer,
    closeLoading: Reducer,
    startWeekLogLoading: Reducer,
    closeWeekLogLoading: Reducer,
    saveAll: Reducer,
    saveAllDrafts: Reducer,
    saveArticleDetail: Reducer,
    saveDraftDetail: Reducer,
    saveAnazly: Reducer,
    saveWeeklog: Reducer,
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
      face_img: '',
      content: '',
      html: '',
      type: 0,
      ct: 0,
      ut: 0,
      top: false,
    },
    draftDetail: {
      fid: '',
      title: '',
      author: '',
      label: [],
      visible: 1,
      face_img: '',
      content: '',
      html: '',
      type: 0,
      ct: 0,
      ut: 0,
      top: false,
    },
    anazly: {
      flovers: 0,
      comments: 0,
      views: 0,
    },
    weekLog: {},
    isLoading: false,
    isWeekLogLoading: false,
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
      if (res && res.fid) {
        yield put({ type: 'saveDraftDetail', payload: res })
      }
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
    *anazly(_, { call, put }) {
      yield put({ type: 'startLoading' })
      const res = yield call(anazly)
      if (res) {
        yield put({ type: 'saveAnazly', payload: res })
      }
      yield put({ type: 'closeLoading' })
    },
    *top({ payload }, { call, put }) {
      yield put({ type: 'startLoading' })
      yield call(top, payload)
      yield put({ type: 'getAll' })
      yield put({ type: 'closeLoading' })
    },
    *untop({ payload }, { call, put }) {
      yield put({ type: 'startLoading' })
      yield call(untop, payload)
      yield put({ type: 'getAll' })
      yield put({ type: 'closeLoading' })
    },
    *upload({ payload }, { call }) {
      const res = yield call(upload, payload)
      return res || {}
    },
    *weeklog(_, { call, put }) {
      yield put({ type: 'startLoading' })
      const res = yield call(weeklog)
      if (res) {
        yield put({
          type: 'saveWeeklog',
          payload: res,
        })
      }
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
    'startWeekLogLoading'(state) {
      return {...state, isWeekLogLoading: true}
    },
    'closeWeekLogLoading'(state) {
      return {...state, isWeekLogLoading: false}
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
    'saveDraftDetail'(state, { payload }) {
      return {...state, draftDetail: payload}
    },
    'saveAnazly'(state, { payload }) {
      return {...state, anazly: payload}
    },
    'saveWeeklog'(state, { payload }) {
      return {...state, weekLog: payload}
    },
  },
}

export default ArticleModel