import React from 'react'
import { Menu } from 'antd'
import { Link } from 'umi'
import {
  DashboardOutlined,
  ReadOutlined,
  RocketOutlined,
  PayCircleOutlined,
} from '@ant-design/icons'
const { SubMenu } = Menu

// Sider
export const siderMenus: any[] = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    text: '仪表盘',
    path: '/dashboard',
  },
  {
    key: 'article',
    icon: <ReadOutlined />,
    text: '文章管理',
    path: '/article',
  },
  {
    key: 'advert',
    icon: <RocketOutlined />,
    text: '广告管理',
    path: '/advert',
  },
  {
    key: 'payment',
    icon: <PayCircleOutlined />,
    text: '付费专栏',
    path: '/payment',
  },
  // {
  //   key: 'sub1',
  //   icon: <UserOutlined />,
  //   title: 'User',
  //   children: [
  //     {
  //       key: 3,
  //       text: 'Tom',
  //       path: '/tom',
  //     },
  //   ],
  // },
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
        <SubMenu key={menu.key} icon={menu.icon} title={menu.title}>
          {showMenus(menu.children)}
        </SubMenu>
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