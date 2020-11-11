import React, { useMemo, Key, useCallback } from 'react'
import { Dropdown, Menu, Avatar, Spin } from 'antd'
import { history } from 'umi'
import {
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons'

import { CurrentUser } from '@/models/user';

import styles from './index.less'

interface RightContentProps {
  currentUser: CurrentUser,
}

export default function RightContent({ currentUser }: RightContentProps) {
  const onMenuClick = useCallback((event: {
    key: Key
  }) => {
    const { key } = event
    if (key === 'logout') {
      console.log('logout')
      history.replace('/login')
      return
    }
  }, [])
  
  const menuHeaderDropdown = useMemo(() => (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="settings">
        <SettingOutlined />
        修改资料
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  ), [])

  return (
    <div className={styles.rightContent}>
      {currentUser && currentUser.name ? (
        <Dropdown
          overlayClassName={styles.overlay}
          overlay={menuHeaderDropdown}
          placement="bottomRight"
          // trigger={['click']}
        >
          <span style={{ cursor: 'pointer' }}>
            <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
            <span>{currentUser.name}</span>
          </span>
        </Dropdown>
      ) : (
        <Spin className={styles.spin} size="small" />
      )}
    </div>
  )
}