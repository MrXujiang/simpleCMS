import React from 'react'
import { Menu } from 'antd'
import { Link } from 'umi'
import {
  DashboardOutlined,
  ReadOutlined,
  RocketOutlined,
  PayCircleOutlined,
} from '@ant-design/icons'
import FormattedMsg from '@/components/reactIntl/FormattedMsg'

// Sider
export const siderMenus: any[] = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    text: <FormattedMsg id="Dashboard" />,
    path: '/dashboard',
  },
  {
    key: 'article',
    icon: <ReadOutlined />,
    text: <FormattedMsg id="Article" />,
    path: '/article',
  },
  {
    key: 'advert',
    icon: <RocketOutlined />,
    text: <FormattedMsg id="Advertising" />,
    path: '/advert',
  },
  {
    key: 'payment',
    icon: <PayCircleOutlined />,
    text: <FormattedMsg id="Pay" />,
    path: '/payment',
  },
]

interface siderMenuList {
  key: number,
  icon: any,
  title: string,
  children: [],
  text: string,
  path: string,
}

export function showMenus(menulist: any[]) {
  return menulist.map((menu: siderMenuList) => {
    if (menu.children) {
      return (
        <Menu.SubMenu key={menu.key} icon={menu.icon} title={menu.title}>
          {showMenus(menu.children)}
        </Menu.SubMenu>
      )
    } else {
      return (
        <Menu.Item key={menu.key} icon={menu.icon}>
          <Link to={menu.path}>{menu.text}</Link>
        </Menu.Item>
      )
    }
  })
}