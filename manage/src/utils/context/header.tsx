import React from 'react'
import { CurrentUser } from '@/models/user'

export interface HeaderContextType {
  locale?: any
  changeLocale?: (localeValue: string) => void
  currentUser?: CurrentUser
  Provider: any
  Consumer: any
}

export const HeaderContext: HeaderContextType = React.createContext({})