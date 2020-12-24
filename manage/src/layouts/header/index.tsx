import React from 'react'
import { Layout } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons'

import RightContent from './rightContent'

import styles from './index.less'

interface HeaderProps {
  collapsed: boolean
  toggle: () => void
}

const { Header } = Layout

const HeaderLayput: React.FC<HeaderProps> = ({ collapsed, toggle }) => {
  return (
    <Header className={styles.header}>
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: styles.trigger,
        onClick: toggle,
      })}
      <RightContent />
    </Header>
  )
}

export default HeaderLayput