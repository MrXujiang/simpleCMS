import { Effect, Reducer } from 'umi'

import { getUserInfo, login, saveUserInfo } from '@/services/user'

export interface CurrentUser {
  tx: string
  username: string
  email: string
  desc: string
  country: string
  addr: string
  phone: string
}

export interface UserModelState {
  lang: string
  currentUser: CurrentUser
  isLoading: boolean
}

interface UserModelType {
  namespace: 'user'
  state: UserModelState
  effects: {
    getUserInfo: Effect,
    login: Effect,
    saveUserInfo: Effect,
  }
  reducers: {
    startLoading: Reducer,
    closeLoading: Reducer,
    changeLocale: Reducer,
    saveCurrentUser: Reducer,
  }
}

const UserModel: UserModelType = {
  namespace: 'user',
  state: {
    lang: localStorage.getItem('simpleCMSLang') || 'zh-cn',
    currentUser: {
      tx: '',
      username: '',
      email: '',
      desc: '',
      country: '',
      addr: '',
      phone: '',
    },
    isLoading: false,
  },
  effects: {
    *getUserInfo(_, { call, put }) {
      const res = yield call(getUserInfo)
      yield put({
        type: 'saveCurrentUser',
        payload: res || {},
      })
    },
    *login({ payload }, { call, put }) {
      yield put({ type: 'startLoading' })
      const res = yield call(login, payload)
      localStorage.setItem('role', res.role)
      yield put({ type: 'closeLoading' })
      return res || {}
    },
    *saveUserInfo({ payload }, { call, put }) {
      yield put({ type: 'startLoading' })
      yield call(saveUserInfo, payload)
      yield put({ type: 'closeLoading' })
    },
  },
  reducers: {
    'startLoading'(state) {
      return { ...state, isLoading: true }
    },
    'closeLoading'(state) {
      return { ...state, isLoading: false }
    },
    'changeLocale'(state, { payload }) {
      return { ...state, lang: payload }
    },
    'saveCurrentUser'(state, { payload }) {
      return { ...state, currentUser: payload }
    },
  },
}

export default UserModel
