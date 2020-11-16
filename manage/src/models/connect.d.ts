import { UserModelState } from './user'
import { DashboardState } from './dashboard'
import { ArticleState } from './article'
import { AdvertState } from './advert'

// export { UserModelState, DashboardState, ArticleState, AdvertState }

export interface ConnectState {
  user: UserModelState
  dashboard: DashboardState
  article: ArticleState
  advert: AdvertState
}