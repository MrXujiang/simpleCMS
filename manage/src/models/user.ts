import { Effect, Reducer, history } from 'umi'

import { getUserInfo, login, forget, modify } from '@/services/user'
import { locale } from 'moment'

export interface CurrentUser {
  avatar?: string
  username?: string
  email?: string
  introduction?: string
  country?: string
  address?: string
  phone?: string
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
    forget: Effect,
    modify: Effect,
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
    lang: 'zh-cn',
    currentUser: {},
    isLoading: false,
  },
  effects: {
    *getUserInfo(_, { call, put }) {
      const res = yield call(getUserInfo)
      yield put({
        type: 'saveCurrentUser',
        payload: res,
      })
    },
    *login({ payload }, { call }) {
      const res = yield call(login, payload)
      if (res && res.uid) {
        localStorage.setItem('nickname', res.name)
        history.push('/dashboard')
      }
    },
    *forget({ payload }, { call, put }) {
      yield put({ type: 'startLoading' })
      yield call(forget, payload)
      yield put({ type: 'closeLoading' })
    },
    *modify({ payload }, { call, put }) {
      yield put({ type: 'startLoading' })
      yield call(modify, payload)
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
    'changeLocale'(state, { payload }) {
      return { ...state, lang: payload }
    },
    'saveCurrentUser'(state, { payload }) {
      return {...state, currentUser: payload}
    },
  },
}

export default UserModel