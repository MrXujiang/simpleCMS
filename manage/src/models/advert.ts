import { Effect, Reducer } from 'umi'

import { get, save } from '@/services/advert'

export interface AdvertType {
  link: string
  imgUrl: string
  text: string
}

export interface AdvertState {
  isLoading: boolean
}

interface AdvertModelType {
  namespace: 'advert'
  state: AdvertState
  effects: {
    get: Effect,
    save: Effect,
  }
  reducers: {
    startLoading: Reducer,
    closeLoading: Reducer,
  }
}

const AdvertModel: AdvertModelType = {
  namespace: 'advert',
  state: {
    isLoading: false,
  },
  effects: {
    *get(_, { call, put }) {
      yield put({ type: 'startLoading' })
      const res = yield call(get)
      yield put({ type: 'closeLoading' })
      return res || {}
    },
    *save({ payload }, { call, put }) {
      yield put({ type: 'startLoading' })
      yield call(save, payload)
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
  },
}

export default AdvertModel
