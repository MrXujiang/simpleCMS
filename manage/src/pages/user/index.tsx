import React, { useCallback, useMemo } from 'react'
import { Dropdown, Menu } from 'antd'
import { CopyrightOutlined, GlobalOutlined } from '@ant-design/icons'
import { connect, Dispatch } from 'umi'

import logo from 'assets/logo.svg'
import { title } from '@/utils'
import FormattedMsg from '@/components/reactIntl/FormattedMsg'
import { ConnectState } from '@/models/connect'

import styles from './index.less'

interface UserLayoutProps {
  children: JSX.Element
  lang: string
  dispatch: Dispatch
}

const UserLayout: React.FC<UserLayoutProps> = ({ children, lang, dispatch }) => {
  const handleChangeLanguage: (key: { key: React.Key }) => void = useCallback(({ key }) => {
    dispatch({ type: 'user/changeLocale', payload: key })
  }, [])

  const globalLanguageDropdown: JSX.Element = useMemo(() => (
    <Menu selectedKeys={[lang]} onClick={handleChangeLanguage}>
      <Menu.Item key="en">
        <span className={styles.lang}>US</span>
        English
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="zh-cn">
        <span className={styles.lang}>CN</span>
        <FormattedMsg id="Simplified Chinese" />
      </Menu.Item>
    </Menu>
  ), [lang])

  return (
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
        <div className={styles.top}>
          <FormattedMsg id={title} />
        </div>
        <FormattedMsg id="Copyright" /> <CopyrightOutlined /> <FormattedMsg id="CopyrightText" />
      </footer>
    </div>
  )
}

export default connect(({ user }: ConnectState) => ({
  lang: user.lang,
}))(UserLayout)