import React, { useState, useCallback, Key } from 'react'
import { Link } from 'umi'
import { Layout, Menu } from 'antd'

import logo from 'assets/logo.svg'
import { title } from 'utils/constants'
import { siderMenus, showMenus } from '../schema'

import styles from './index.less'

interface SiderProps {
  collapsed: boolean
  location: {
    pathname: string
  }
}

const { Sider } = Layout;

export default function SiderLayput({ collapsed, location }: SiderProps) {
  const [ selectedKey, setSelectedKey ] = useState<any>(location.pathname.slice(1))
  const onMenuClick = useCallback(({ key }: { key: Key }) => setSelectedKey(key), [])
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className={styles.logo}>
        <Link to="/">
          <img src={logo} alt="logo" width={30} height={30} />
        </Link>
        <span className={collapsed ? styles.hideTitle : styles.showTitle}>{title}</span>
      </div>
      <Menu theme="dark" selectedKeys={[selectedKey]} mode="inline" onClick={onMenuClick}>
        {showMenus(siderMenus)}
      </Menu>
    </Sider>
  )
}