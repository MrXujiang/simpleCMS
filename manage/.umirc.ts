import path from 'path'
import { defineConfig } from 'umi'

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  dva: {
    immer: true,
    hmr: true,
  },
  devtool: 'source-map',
  antd: {},
  title: 'simpleCMS',
  exportStatic: {},
  base: '/manage/',
  publicPath: '/manage/',
  outputPath: 'dist',
  theme: {
    'primary-color': '#2F54EB',
    "btn-primary-bg": "#2F54EB"
  },
  analytics: {
    ga: 'google analytics code',
  },
  extraBabelPlugins: [['import', { libraryName: 'zarm', style: true }]],
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
    utils: path.resolve(__dirname, 'src/utils/'),
    assets: path.resolve(__dirname, 'src/assets/'),
    less: path.resolve(__dirname, 'src/less/'),
  },
  routes: [
    { path: '/', redirect: '/dashboard' },
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        {
          path: '/user',
          component: '@/pages/user/index',
          routes: [
            {
              path: '/user/login',
              component: '@/pages/user/login',
            },
            {
              path: '/user/forget',
              component: '@/pages/user/forget',
            },
          ],
        },
        { path: '/dashboard', component: '@/pages/dashboard' },
        { path: '/article', component: '@/pages/article' },
        { path: '/article/release', component: '@/pages/article/release' },
        { path: '/advert', component: '@/pages/advert' },
        { path: '/payment', component: '@/pages/payment' },
        { path: '/modifyUser', component: '@/pages/user/modify' },
      ],
    },
  ],
})
