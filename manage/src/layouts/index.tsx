import React, { useMemo, useCallback, useState, useEffect, FC, Fragment } from 'react'
import { connect, Dispatch } from 'umi'
import { ConfigProvider, Layout } from 'antd'
import enUS from 'antd/lib/locale/en_US'
import zhCN from 'antd/lib/locale/zh_CN'

import { IntlProvider, createIntl, createIntlCache } from 'react-intl'
import en_US from '@/locales/en'
import zh_CN from '@/locales/zh'

import { ConnectState } from '@/models/connect'
import { CurrentUser } from '@/models/user'
import { HeaderContext } from '@/utils/context/header'
import { IntlContext } from '@/utils/context/intl'
import Header from './header'
import Sider from './sider'

import styles from './index.less'

const cache = createIntlCache()

interface BasicLayoutProps {
  children: JSX.Element
  location: any
  currentUser: CurrentUser
  lang: string
  dispatch: Dispatch
}

const BasicLayout: FC<BasicLayoutProps> = ({ children, location, lang, dispatch, currentUser }) => {
  // silder
  const [ collapsed, setCollapsed ] = useState<boolean>(false)
  const toggle: () => void = useCallback(() => setCollapsed(!collapsed), [collapsed])

  // globalLanguage
  const changeLocale: (locale: string) => void = useCallback(localeValue => {
    dispatch({ type: 'user/changeLocale', payload: localeValue })
  }, [])
  const getLocale: (lang: string, type: string) => any = useCallback((lang, type) => {
    let language = null
    switch (lang) {
      case 'zh-cn':
        language = type === 'antd' ? zhCN : zh_CN
        break
      case 'en':
        language = type === 'antd' ? enUS : en_US
        break
      default:
        language = type === 'antd' ? zhCN : zh_CN
        break
    }
    return language
  }, [])

  // react-intl
  const intl = useMemo(() => createIntl(
    {
      locale: lang,
      defaultLocale: 'en',
      messages: getLocale(lang, 'react-intl'),
    },
    cache
  ), [lang])
  const formatMsg: (id: string, defaultMsg?: string) => any = useCallback((id, defaultMsg) => intl.formatMessage(
    {
      id,
      defaultMessage: defaultMsg || id,
    }
  ), [intl.locale])

  useEffect(() => {
    if (dispatch) dispatch({ type: 'user/getUserInfo' })
  }, [])

  return (
    <IntlProvider messages={getLocale(lang, 'react-intl')} locale={lang} defaultLocale="en">
      <ConfigProvider locale={getLocale(lang, 'antd')}>
        <IntlContext.Provider value={formatMsg}>
          {location.pathname.startsWith('/user') ? <Fragment>{children}</Fragment> : (
            <Layout className={styles.basicLayout}>
              <Sider collapsed={collapsed} location={location} />
              <Layout>
                <HeaderContext.Provider value={{ locale: lang, changeLocale, currentUser }}>
                  <Header collapsed={collapsed} toggle={toggle} />
                </HeaderContext.Provider>
                <Layout.Content className={styles.content}>
                  {children}
                </Layout.Content>
              </Layout>
            </Layout>
          )}
        </IntlContext.Provider>
      </ConfigProvider>
    </IntlProvider>    
  )
}

export default connect(({ user }: ConnectState) => ({
  lang: user.lang,
  currentUser: user.currentUser,
}))(BasicLayout)