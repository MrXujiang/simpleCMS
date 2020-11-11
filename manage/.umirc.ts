import path from 'path';
import { defineConfig } from 'umi';

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
  base: '/',
  publicPath: './',
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
    {
      path: '/user',
      component: '@/layouts/index',
      routes: [
        { path: '/user/login', component: '@/pages/dashboard/index', exact: true },
        { path: '/user/modify', component: '@/layouts/user/modify/index', exact: true },
      ],
    },
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        { path: '/dashboard', component: '@/pages/dashboard/index', exact: true },
        { path: '/article', component: '@/pages/article/index', exact: true },
        { path: '/advert', component: '@/pages/advert/index', exact: true },
        { path: '/payment', component: '@/pages/payment/index', exact: true },
      ],
    },
  ],
});
