import { UserModelState } from './user'
import { DashboardState } from './dashboard'

export { UserModelState, DashboardState }

export interface ConnectState {
  user: UserModelState
  dashboard: DashboardState
}