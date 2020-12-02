import { UserModelState } from './user'
import { DashboardState } from './dashboard'
import { ArticleState } from './article'
import { AdvertState } from './advert'
import { ConfigurationState } from './configuration'

// export { UserModelState, DashboardState, ArticleState, AdvertState, ConfigurationState }

export interface ConnectState {
  user: UserModelState
  dashboard: DashboardState
  article: ArticleState
  advert: AdvertState
  configuration: ConfigurationState
}