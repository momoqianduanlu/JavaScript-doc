module.exports = {
  base: '/JavaScript-list-doc/',
  dest: 'dist',
  title: 'JavaScript知识清单',
  description: '对你的热爱要忠诚，对你的热爱要勤奋',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }], // 增加一个自定义的 favicon(网页标签的图标)
  ],
  themeConfig: {
    nav:[
      // 内部链接 以docs为根目录
      { 
      	text: 'JavaScript', 
      	link: '/chapter1/' 
      },
      { 
      	text: 'Es6', 
      	link: '/chapter2/' 
      },
      
      {
      	text: '前端工具',
      	items: [
          { 
          	text: 'Webpack', 
          	link: '/chapter7/' 
          },
          {
            text: '算法仓库',
            link: 'https://github.com/OBKoro1/Brush_algorithm'
          }
        ]
      },
      // 下拉列表
      {
        text: 'GitHub',
        items: [
          { 
          	text: 'GitHub地址', 
          	link: 'https://github.com/OBKoro1' // 外部链接
          }
        ]
      }        
    ],
    sidebar: [
    	{
    		title: 'JavaScript',
	        collapsable: true,
	        children: [
            ['chapter1/', '深入理解javascript作用域 - 内部原理'],
            'chapter1/scoping',
            'chapter1/function-scoping',
            'chapter1/block-scoping',
            'chapter1/hositing',
            'chapter1/execution-environment-scoping',
            'chapter1/closure',
            'chapter1/closure-IIFE',
            'chapter1/closure-常见的一个循环和闭包的错误详解',
            'chapter1/深入理解 this 机制 - this的四种绑定规则',
            'chapter1/深入理解javascript对象第一篇 - 初识对象',
            'chapter1/深入理解javascript对象第二篇 - 属性操作',
            'chapter1/深入理解javascript对象第三篇 - 神秘的属性描述符',
            'chapter1/javascript中的原始值和复杂值',
            'chapter1/关于图片懒加载 - 原理和实现',
            'chapter1/深入理解JSON对象',
            'chapter1/深入理解ajax[XHR 请求方式 响应解码]',
            'chapter1/深入理解ajax[FormData 进度事件 头部信息]',
            'chapter1/CORS跨域资源共享',
            'chapter1/JSONP跨域'
	        ]
    	},
    	{
    		title: 'Es6',
	        collapsable: true,
	        children: [
	          ['chapter2/', 'let 和 const'],
            'chapter2/function',
            'chapter2/array-function',
            'chapter2/object-extends',
            'chapter2/module',
            'chapter2/class'
	        ]
      }
    ]
  }
}
