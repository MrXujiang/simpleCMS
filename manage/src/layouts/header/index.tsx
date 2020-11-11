import React, { createElement } from 'react'
import { Layout } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons'

import { CurrentUser } from '@/models/user';
import RightContent from './rightContent'

import styles from './index.less'

interface HeaderProps {
  collapsed: boolean
  toggle: () => void
  currentUser: CurrentUser
}

const { Header } = Layout

export default function HeaderLayput({ collapsed, toggle, currentUser }: HeaderProps) {
  return (
    <Header className={styles.header}>
      {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: styles.trigger,
        onClick: toggle,
      })}
      <RightContent currentUser={currentUser} />
    </Header>
  )
}