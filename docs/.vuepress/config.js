const nav = require('./utils/nav.js')
const { webpackSidebar } = nav

module.exports = {
  base: '/JavaScript-doc/',
  title: '前端知识清单',
  description: '对你的热爱要忠诚，对你的热爱要勤奋',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }] // 增加一个自定义的 favicon(网页标签的图标)
  ],
  themeConfig: {
    sidebar: 'auto',
    lastUpdated: '最后更新时间',
    nav: [
      // {
      //   text: 'webpack',
      //   link: '/webpack/'
      // },
      {
        text: 'Javascript专题',
        link: '/javascript/'
      },
      {
        text: 'TypeScript',
        link: '/typescript/'
      },
      {
        text: 'Vite',
        link: '/vite/'
      },
      {
        text: '前端书籍',
        items: [
          {
            text: 'JavaScript书籍',
            items: [
              {
                text: '你不知道的JavaScript(上)',
                link: '/books/javascript/knowUp'
              },
              {
                text: '你不知道的JavaScript(中下)',
                link: '/books/javascript/knowDown'
              },
              {
                text: '深入理解Es6',
                link: '/books/es6/es6'
              },
              {
                text: '学习JavaScript数据结构和算法',
                link: '/books/algorithm'
              },
              {
                text: '精通正则表达式',
                link: '/books/regexp/'
              }
            ]
          }
        ]
      }
    ],
    sidebar: {
      '/webpack/': [webpackSidebar]
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@images': '../images'
      }
    }
  }
}
