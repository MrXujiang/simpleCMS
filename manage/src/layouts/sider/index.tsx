import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Link } from 'umi'
import { Layout, Menu } from 'antd'

import FormattedMsg from '@/components/reactIntl/FormattedMsg'
import logo from 'assets/logo.svg'
import { title } from '@/utils'
import { siderMenus, showMenus } from '../schema'

import styles from './index.less'

interface SiderProps {
  location: { pathname: string }
}

const SiderLayput: React.FC<SiderProps> = ({ location: { pathname } }) => {
  const curKey = useMemo(() => pathname.slice(1), [pathname])
  
  const [ selectedKey, setSelectedKey ] = useState<string>(curKey)
  
  const onMenuClick = useCallback(({ key }) => setSelectedKey(key), [])

  useEffect(() => setSelectedKey(curKey), [pathname])

  return (
    <Layout.Sider className={styles.sider} width={140}>
      <div className={styles.logo}>
        <Link to="/">
          <img src={logo} alt="logo" width={30} height={30} />
        </Link>
        <span className={styles.title}>
          <FormattedMsg id={title} />
        </span>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={onMenuClick}
      >
        {showMenus(siderMenus)}
      </Menu>
    </Layout.Sider>
  )
}

export default SiderLayput