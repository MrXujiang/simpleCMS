import { UserModelState } from './user'
import { DashboardState } from './dashboard'
import { ArticleState } from './article'
import { AdvertState } from './advert'
import { SettingState } from './setting'

// export { UserModelState, DashboardState, ArticleState, AdvertState, SettingState }

export interface ConnectState {
  user: UserModelState
  dashboard: DashboardState
  article: ArticleState
  advert: AdvertState
  setting: SettingState
}