import React, { useCallback, useState, useEffect, FC } from 'react'
import { connect, Dispatch } from 'umi'
import { Layout } from 'antd'

import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';

import Header from './header'
import Sider from './sider'

import styles from './index.less'

const { Content } = Layout;

interface BasicLayoutProps {
  children: JSX.Element
  location: any
  dispatch: Dispatch
  currentUser: CurrentUser
}

const BasicLayout: FC<BasicLayoutProps> = ({ children, location, dispatch, currentUser }) => {
  const [ collapsed, setCollapsed ] = useState<boolean>(false)
  const toggle = useCallback(() => setCollapsed(!collapsed), [collapsed])

  useEffect(() => {
    if (dispatch) dispatch({ type: 'user/getUserInfo' })
  }, []);

  return (
    <Layout className={styles.layout}>
      <Sider collapsed={collapsed} location={location} />
      <Layout>
        <Header collapsed={collapsed} toggle={toggle} currentUser={currentUser} />
        <Content className={styles.content}>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(BasicLayout)