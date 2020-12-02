import { Effect, Reducer } from 'umi'

import { getConfiguration } from '@/services/configuration'

export interface ConfigurationType {
  logo?: any
  name: string
  description: string
  text: string
  link: string
}

export interface ConfigurationState {
  isLoading: boolean
  configuration: ConfigurationType
}

interface ConfigurationModelType {
  namespace: 'configuration'
  state: ConfigurationState
  effects: {
    getConfiguration: Effect,
  }
  reducers: {
    startLoading: Reducer,
    closeLoading: Reducer,
    saveConfiguration: Reducer,
  }
}

const ConfigurationModel: ConfigurationModelType = {
  namespace: 'configuration',
  state: {
    isLoading: false,
    configuration: {
      name: '',
      description: '',
      text: '',
      link: '',
    },
  },
  effects: {
    *getConfiguration(_, { call, put }) {
      yield put({ type: 'startLoading' })
      const res = yield call(getConfiguration)
      yield put({
        type: 'saveConfiguration',
        payload: res,
      })
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
    'saveConfiguration'(state, { payload }) {
      return {...state, configuration: payload}
    },
  },
}

export default ConfigurationModel