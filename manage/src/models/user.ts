import { Effect, Reducer } from 'umi'

import { getUserInfo } from '@/services/user';

export interface CurrentUser {
  avatar?: string
  name?: string
}

export interface UserModelState {
  currentUser: CurrentUser
}

interface UserModelType {
  namespace: 'user'
  state: UserModelState
  effects: {
    getUserInfo: Effect,
  }
  reducers: {
    saveCurrentUser: Reducer<UserModelState>
  }
}

const UserModel: UserModelType = {
  namespace: 'user',
  state: {
    currentUser: {}
  },
  effects: {
    *getUserInfo(_, { call, put }) {
      const res = yield call(getUserInfo)
      yield put({
        type: 'saveCurrentUser',
        payload: res,
      })
    }
  },
  reducers: {
    'saveCurrentUser'(state, action) {
      return {...state, currentUser: action.payload}
    }
  },
}

export default UserModel;