import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  // antd:{},
  layout: {
    title: '古籍大数据分析平台',
    logo: false,
    navTheme: 'light',
    layout: 'mix',
    locale: true,
  },
  routes: [
    {
      path: '/book',
      routes: [
        {
          path: '/book/:bookName',
          component: './Book/$dynamic',
        },
      ],
      hideInMenu: true,
    },
    {
      path: '/sentence',
      routes: [
        {
          path: '/sentence/:sentenceID',
          component: './Sentence/$dynamic',
        },
      ],
      hideInMenu: true,
    },
    {
      name: 'search',
      path: '/search',
      component: './Search',
      routes: [
        {
          path: '/search',
          redirect: '/search/content',
        },
        {
          path: '/search/content/',
          component: './Search/Content',
          hideInMenu: true,
        },
        {
          path: '/search/book/',
          component: './Search/Book',
          hideInMenu: true,
        },
      ],
    },
    {
      name: 'reuse',
      path: '/reuse',
      component: './Reuse',
    },
    {
      name: 'frequency',
      path: '/frequency',
      routes: [
        {
          path: '/frequency',
          redirect: '/frequency/ngram',
        },
        {
          name: 'ngram',
          path: '/frequency/ngram',
          component: './Frequency/Ngram',
        },
        {
          name: 'word',
          path: '/frequency/word',
          component: './Frequency/Word',
        },
        {
          name: 'contrast',
          path: '/frequency/contrast',
          component: './Frequency/Contrast',
        },
        {
          name: 'evolution',
          path: '/frequency/evolution',
          component: './Frequency/Evolution',
        },
      ],
    },
    {
      name: 'about',
      path: '/about',
      component: './About',
      // hideInMenu: true,
    },
    {
      path: '/',
      component: '@/pages/index',
    },
  ],
  fastRefresh: {},
  // 开启dva
  // dva: {
  //   immer: true,
  //   hmr: false,
  // },
  locale: {
    default: 'zh-CN',
    antd: true,
    title: true,
    baseNavigator: true,
    baseSeparator: '-',
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  mfsu: {},
});
