import { UserModelState } from './user'
import { ArticleState } from './article'
import { AdvertState } from './advert'
import { SettingState } from './setting'

export interface ConnectState {
  user: UserModelState
  article: ArticleState
  advert: AdvertState
  setting: SettingState
}
