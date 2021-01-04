import { Effect, Reducer } from 'umi'

import { getWebsite, saveWebsite } from '@/services/setting'

export interface WebsiteType {
  logo: string
  title: string
  desc: string
  r_text: string
  r_link: string
}

export interface SettingState {
  isLoading: boolean
  website: WebsiteType
}

interface SettingModelType {
  namespace: 'setting'
  state: SettingState
  effects: {
    getWebsite: Effect,
    saveWebsite: Effect,
  }
  reducers: {
    startLoading: Reducer,
    closeLoading: Reducer,
  }
}

const SettingModel: SettingModelType = {
  namespace: 'setting',
  state: {
    isLoading: false,
    website: {
      logo: '',
      title: '',
      desc: '',
      r_text: '',
      r_link: '',
    },
  },
  effects: {
    *getWebsite(_, { call, put }) {
      yield put({ type: 'startLoading' })
      const res = yield call(getWebsite)
      yield put({ type: 'closeLoading' })
      return res || {}
    },
    *saveWebsite({ payload }, { call, put }) {
      yield put({ type: 'startLoading' })
      yield call(saveWebsite, payload)
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

export default SettingModel
