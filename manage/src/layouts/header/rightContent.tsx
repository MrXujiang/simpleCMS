import React, { useMemo, useCallback, useEffect } from 'react'
import { Dropdown, Menu, Avatar, Spin } from 'antd'
import { history, connect, Dispatch } from 'umi'
import {
  SettingOutlined,
  LogoutOutlined,
  GlobalOutlined,
} from '@ant-design/icons'

import FormattedMsg from '@/components/reactIntl/FormattedMsg'
import { ConnectState } from '@/models/connect'
import { CurrentUser } from '@/models/user'
import avatar from '@/assets/avatar.svg'

import styles from './index.less'

interface RightContentProps {
  currentUser: CurrentUser
  lang: string
  dispatch: Dispatch
}

const RightContent: React.FC<RightContentProps> = ({ currentUser, lang, dispatch }) => {
  const onMenuClick: (params: { key: React.Key }) => void = useCallback(({ key }) => {
    switch (key) {
    case 'logout':
      history.replace('/user/login')
      break
    case 'settings':
      history.push('/modify')
      break
    case 'zh-cn':
      localStorage.setItem('simpleCMSLang', 'zh-cn')
      dispatch({ type: 'user/changeLocale', payload: 'zh-cn' })
      break
    case 'en':
      localStorage.setItem('simpleCMSLang', 'en')
      dispatch({ type: 'user/changeLocale', payload: 'en' })
      break
    }
  }, [])

  // eslint-disable-next-line no-undef
  const actionsDropdown: JSX.Element = useMemo(() => (
    <Menu onClick={onMenuClick}>
      <Menu.Item key="settings">
        <SettingOutlined />
        <FormattedMsg id="Personal Settings" />
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <LogoutOutlined />
        <FormattedMsg id="Log out" />
      </Menu.Item>
    </Menu>
  ), [])

  // eslint-disable-next-line no-undef
  const globalLanguageDropdown: JSX.Element = useMemo(() => (
    <Menu selectedKeys={[lang]} onClick={onMenuClick}>
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

  useEffect(() => {
    dispatch({ type: 'user/getUserInfo' })
  }, [])

  return (
    <div className={styles.rightContent}>
      {currentUser && currentUser.username
        ? (
          <Dropdown
            overlayClassName={styles.overlay}
            overlay={actionsDropdown}
            placement="bottomCenter"
          >
            <span className={styles.currentUser}>
              <Avatar size="small" className={styles.avatar} src={currentUser.tx || avatar} alt="avatar" />
              <span>{currentUser.username}</span>
            </span>
          </Dropdown>
        )
        : (
          <Spin size="small" style={{ marginRight: 10 }} />
        )}
      <Dropdown
        overlayClassName={styles.overlay}
        overlay={globalLanguageDropdown}
        placement="bottomCenter"
      >
        <GlobalOutlined style={{ cursor: 'pointer' }} />
      </Dropdown>
    </div>
  )
}

export default connect(({ user }: ConnectState) => ({
  lang: user.lang,
  currentUser: user.currentUser,
}))(RightContent)
