import React, { useState, useCallback, useMemo, useEffect, Key, FC } from 'react'
import { Link } from 'umi'
import { Layout, Menu } from 'antd'

import logo from 'assets/logo.svg'
import { title } from '@/utils'
import { siderMenus, showMenus } from '../schema'

import styles from './index.less'

interface SiderProps {
  collapsed: boolean
  location: {
    pathname: string
  }
}

const SiderLayput: FC<SiderProps> = ({ collapsed, location: { pathname } }) => {
  const curKey = useMemo(() => {
    return pathname.lastIndexOf('/') !== 0
      ? pathname.slice(1, pathname.lastIndexOf('/'))
      : pathname.slice(1)
  }, [pathname])
  
  const [ selectedKey, setSelectedKey ] = useState<any>(curKey)
  
  const onMenuClick = useCallback(({ key }: { key: Key }) => setSelectedKey(key), [])

  useEffect(() => setSelectedKey(curKey), [pathname])

  return (
    <Layout.Sider width={168} trigger={null} collapsible collapsed={collapsed}>
      <div className={styles.logo}>
        <Link to="/">
          <img src={logo} alt="logo" width={30} height={30} />
        </Link>
        <span className={collapsed ? styles.hideTitle : styles.showTitle}>{title}</span>
      </div>
      <Menu theme="dark" selectedKeys={[selectedKey]} mode="inline" onClick={onMenuClick}>
        {showMenus(siderMenus)}
      </Menu>
    </Layout.Sider>
  )
}

export default SiderLayput