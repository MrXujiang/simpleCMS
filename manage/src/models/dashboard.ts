import { Effect, Reducer } from 'umi'

import { getStatistics, getChartsData } from '@/services/dashboard';

export interface ChartsData {
  articleVisits: any[]
  articleLikes: any[]
}

export interface DashboardState {
  statistics: any[]
  chartsData: ChartsData
}

interface DashboardType {
  namespace: 'dashboard'
  state: DashboardState
  effects: {
    getStatistics: Effect,
    getChartsData: Effect,
  }
  reducers: {
    saveStatistics: Reducer,
    saveChartsData: Reducer,
  }
}

const DashboardModel: DashboardType = {
  namespace: 'dashboard',
  state: {
    statistics: [],
    chartsData: {
      articleVisits: [],
      articleLikes: [],
    },
  },
  effects: {
    *getStatistics(_, { call, put }) {
      const res = yield call(getStatistics)
      yield put({
        type: 'saveStatistics',
        payload: res,
      })
    },
    *getChartsData(_, { call, put }) {
      const res = yield call(getChartsData)
      yield put({
        type: 'saveChartsData',
        payload: res,
      })
    },
  },
  reducers: {
    saveStatistics(state, action) {
      return {...state, statistics: action.payload}
    },
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

export default DashboardModel;