import React, { useCallback, useMemo } from 'react'
import { Dropdown, Menu } from 'antd'
import { CopyrightOutlined, GlobalOutlined } from '@ant-design/icons'
import { connect, Dispatch } from 'umi'

import logo from 'assets/logo.svg'
import { title, IP_URL, IP_ADDRESS } from '@/utils'
import FormattedMsg from '@/components/reactIntl/FormattedMsg'
import { ConnectState } from '@/models/connect'

import styles from './index.less'

interface UserLayoutProps {
  // eslint-disable-next-line no-undef
  children: JSX.Element
  location: any
  lang: string
  dispatch: Dispatch
}

const UserLayout: React.FC<UserLayoutProps> = ({ children, location, lang, dispatch }) => {
  const handleChangeLanguage: (key: { key: React.Key }) => void = useCallback(({ key }) => {
    dispatch({ type: 'user/changeLocale', payload: key })
  }, [])

  // eslint-disable-next-line no-undef
  const globalLanguageDropdown: JSX.Element = useMemo(() => (
    <Menu selectedKeys={[lang]} onClick={handleChangeLanguage}>
      <Menu.Item key="en">
        <span className={styles.lang}>US</span>
        English
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="zh-cn">
        <span className={styles.lang}>CN</span>
        简体中文
      </Menu.Item>
    </Menu>
  ), [lang])

  return location.pathname !== '/user/login'
    ? (
      <React.Fragment>
        {children}
      </React.Fragment>
    )
    : (
      <div className={styles.userLayout}>
        <div className={styles.globalIcon}>
          <Dropdown
            overlay={globalLanguageDropdown}
            placement="bottomRight"
          >
            <GlobalOutlined style={{ cursor: 'pointer' }} />
          </Dropdown>
        </div>
        <header className={styles.header}>
          <img src={logo} width={45} height={45} alt="logo" style={{ verticalAlign: 'bottom' }} />
          <span className={styles.title}>
            <FormattedMsg id={title} />
          </span>
          <div className={styles.desc}>
            <FormattedMsg id="simpleCMS" />: <FormattedMsg id="simpleCMS_DESC" />
          </div>
        </header>
        {children}
        <footer className={styles.footer}>
          <div>
            <a href={IP_URL} target="_blank" rel="noreferrer">{IP_ADDRESS}</a>
          </div>
          <FormattedMsg id="Copyright" /> <CopyrightOutlined /> <FormattedMsg id="CopyrightText" />
        </footer>
      </div>
    )
}

export default connect(({ user }: ConnectState) => ({
  lang: user.lang,
}))(UserLayout)
