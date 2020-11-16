import { Effect, Reducer } from 'umi'

import { getAdvertInfo, publishAdvert } from '@/services/advert'

export interface AdvertInfo {
  topLink: string
  topImgUrl: string
  topDesc: string
  sideLink: string
  sideImgUrl: string
  sideDesc: string
}

export interface AdvertState {
  isLoading: boolean
  advertInfo: AdvertInfo
}

interface AdvertModelType {
  namespace: 'advert'
  state: AdvertState
  effects: {
    getAdvertInfo: Effect,
    publishAdvert: Effect,
  }
  reducers: {
    startLoading: Reducer,
    closeLoading: Reducer,
    saveAdvertInfo: Reducer,
  }
}

const AdvertModel: AdvertModelType = {
  namespace: 'advert',
  state: {
    isLoading: false,
    advertInfo: {
      topLink: '',
      topImgUrl: '',
      topDesc: '',
      sideLink: '',
      sideImgUrl: '',
      sideDesc: '',
    },
  },
  effects: {
    *getAdvertInfo(_, { call, put }) {
      yield put({ type: 'startLoading' })
      const res = yield call(getAdvertInfo)
      yield put({
        type: 'saveAdvertInfo',
        payload: res,
      })
      yield put({ type: 'closeLoading' })
      return res
    },
    *publishAdvert({ payload }, { call, put }) {
      yield put({ type: 'startLoading' })
      const res = yield call(publishAdvert, payload)
      console.log('res========= ', res)
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
    'saveAdvertInfo'(state, { payload }) {
      return {...state, advertInfo: payload}
    },
  },
}

export default AdvertModel