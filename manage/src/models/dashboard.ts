import { Effect, Reducer } from 'umi'

import { getChartsData } from '@/services/dashboard'

export interface ChartsData {
  articleVisits: any[]
  articleLikes: any[]
}

export interface DashboardState {
  chartsData: ChartsData
}

interface DashboardType {
  namespace: 'dashboard'
  state: DashboardState
  effects: {
    getChartsData: Effect,
  }
  reducers: {
    saveChartsData: Reducer,
  }
}

const DashboardModel: DashboardType = {
  namespace: 'dashboard',
  state: {
    chartsData: {
      articleVisits: [],
      articleLikes: [],
    },
  },
  effects: {
    *getChartsData(_, { call, put }) {
      const res = yield call(getChartsData)
      yield put({
        type: 'saveChartsData',
        payload: res,
      })
    },
  },
  reducers: {
    saveChartsData(state, action) {
      return {
        ...state,
        chartsData: {
          articleVisits: action.payload.articleVisits,
          articleLikes: action.payload.articleLikes,
        }
      }
    }
  },
}

export default DashboardModel