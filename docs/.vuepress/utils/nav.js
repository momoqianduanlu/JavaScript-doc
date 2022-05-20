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

// javascript目录结构
const JavascriptSidebar = {
  title: 'javascript',
  collapsable: false,
  children: []
}

// typescript目录结构
const typescriptSidebar = {
  title: 'typeScript',
  collapsable: false,
  children: []
}

// vite目录结构
const viteSidebar = {
  title: 'vite',
  collapsable: false,
  children: []
}

module.exports = {
  // webpackSidebar,
  JavascriptSidebar,
  typescriptSidebar,
  viteSidebar
}
