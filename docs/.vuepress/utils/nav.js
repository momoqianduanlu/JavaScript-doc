// webpack目录结构
const webpackSidebar = {
  title: 'Webpack',
  collapsable: false,
  children: [
    '/webpack/',
    '/webpack/source.md',
    '/webpack/install.md',
    '/webpack/start.md',
    '/webpack/static.md',
    '/webpack/core.md',
    '/webpack/advanced.md',
    '/webpack/case.md',
    '/webpack/optimization.md',
    '/webpack/loader.md',
    '/webpack/plugin.md'
  ]
}

// http目录结构
const httpSidebar = {
  title: 'Http',
  collapsable: false,
  children: [
    
  ]
}

// typescript目录结构
const typescriptSidebar = {
  title: 'typeScript',
  collapsable: false,
  children: []
}

module.exports = {
  knowUpSidebar,
  webpackSidebar,
  httpSidebar,
  typescriptSidebar
}
