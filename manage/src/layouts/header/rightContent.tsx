import React, { useMemo, useCallback, useContext, Key } from 'react'
import { Dropdown, Menu, Avatar, Spin } from 'antd'
import { history } from 'umi'
import {
  SettingOutlined,
  LogoutOutlined,
  GlobalOutlined,
} from '@ant-design/icons'

import { HeaderContext, HeaderContextType } from '@/utils/context/header'
import FormattedMsg from '@/components/reactIntl/FormattedMsg'

import styles from './index.less'

const RightContent: () => JSX.Element = () => {
  const { locale, changeLocale, currentUser } = useContext<HeaderContextType>(HeaderContext)

  const onMenuClick: (params: { key: Key }) => void = useCallback(({ key }) => {
    switch (key) {
      case 'logout':
        history.replace('/user/login')
        break
      case 'settings':
        history.push('/modifyUser')
        break
      case 'zh-cn':
        changeLocale && changeLocale('zh-cn')
        break
      case 'en':
        changeLocale && changeLocale('en')
        break
    }
  }, [])
  
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

  const globalLanguageDropdown: JSX.Element = useMemo(() => (
    <Menu selectedKeys={[locale]} onClick={onMenuClick}>
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
  ), [locale])

  return (
    <div className={styles.rightContent}>
      {currentUser && currentUser.username ? (
        <Dropdown
          overlayClassName={styles.overlay}
          overlay={actionsDropdown}
          placement="bottomRight"
        >
          <span className={styles.currentUser}>
            <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
            <span>{currentUser.username}</span>
          </span>
        </Dropdown>
      ) : (
        <Spin size="small" style={{ marginRight: 10 }} />
      )}
      <Dropdown
        overlayClassName={styles.overlay}
        overlay={globalLanguageDropdown}
        placement="bottomRight"
      >
        <GlobalOutlined style={{ cursor: 'pointer' }} />
      </Dropdown>
    </div>
  )
}

export default RightContent