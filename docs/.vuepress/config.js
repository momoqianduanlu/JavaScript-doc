module.exports = {
  base: '/JavaScript-doc/',
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
    	// {
    	// 	title: '基础语法-运算符',
	    //     collapsable: true,
	    //     children: [
      //       ['chapter1/', 'let 和 const']
	    //     ]
    	// },
    	// {
    	// 	title: '基础语法-语句',
	    //     collapsable: true,
	    //     children: [
	    //       ['chapter2/', 'let 和 const']
	    //     ]
      // },
      // {
    	// 	title: '数据类型-基础',
	    //     collapsable: true,
	    //     children: [
      //       ['chapter3/', 'let 和 const']
	    //     ]
      // },
      // {
    	// 	title: '数据类型-基础类型',
	    //     collapsable: true,
	    //     children: [
      //       ['chapter4/', 'let 和 const']
	    //     ]
      // },
      // {
    	// 	title: '数据类型-构造器类型',
	    //     collapsable: true,
	    //     children: [
      //       ['chapter5/', 'let 和 const']
	    //     ]
      // },
      // {
    	// 	title: '数据类型-日期对象',
	    //     collapsable: true,
	    //     children: [
      //       ['chapter6/', 'let 和 const']
	    //     ]
      // },
      // {
    	// 	title: '数据类型-类型识别',
	    //     collapsable: true,
	    //     children: [
      //       ['chapter7/', 'let 和 const']
	    //     ]
      // },
      // {
    	// 	title: '数据类型-类型转换',
	    //     collapsable: true,
	    //     children: [
      //       ['chapter8/', 'let 和 const']
	    //     ]
      // },
      // {
    	// 	title: '数据类型-函数',
	    //     collapsable: true,
	    //     children: [
      //       ['chapter9/', 'let 和 const']
	    //     ]
      // },
      {
    		title: '数据类型-对象',
	        collapsable: true,
	        children: [
            ['chapter10/', '深入理解javascript对象第一篇 - 初识对象'],
            'chapter10/深入理解javascript对象第二篇 - 属性操作',
            'chapter10/深入理解javascript对象第三篇 - 神秘的属性描述符',
            'chapter10/对象的深浅拷贝'
	        ]
      },
      {
    		title: '执行环境与作用域',
	        collapsable: true,
	        children: [
            ['chapter11/', '深入理解javascript作用域 - 内部原理'],
            'chapter11/scoping',
            'chapter11/function-scoping',
            'chapter11/block-scoping',
            'chapter11/hositing',
            'chapter11/execution-environment-scoping',
            'chapter11/关于图片懒加载 - 原理和实现'
	        ]
      },
      {
    		title: '闭包',
	        collapsable: true,
	        children: [
            ['chapter12/', '深入理解闭包 - 什么是闭包'],
            'chapter12/closure-IIFE',
            'chapter12/closure-常见的一个循环和闭包的错误详解',
	        ]
      },
      {
    		title: 'this',
	        collapsable: true,
	        children: [
            ['chapter13/', '深入理解 this 机制 - this的四种绑定规则']
	        ]
      },
      // {
    	// 	title: '继承',
	    //     collapsable: true,
	    //     children: [
      //       ['chapter14/', 'let 和 const']
	    //     ]
      // },
      {
    		title: 'ajax和存储',
	        collapsable: true,
	        children: [
            ['chapter15/', '深入理解JSON对象'],
            'chapter15/深入理解ajax[XHR 请求方式 响应解码]',
            'chapter15/深入理解ajax[FormData 进度事件 头部信息]',
            'chapter15/CORS跨域资源共享',
            'chapter15/JSONP跨域'
	        ]
      },
      {
    		title: 'Es6',
	        collapsable: true,
	        children: [
            ['chapter16/', 'let 和 const'],
            'chapter16/function',
            'chapter16/array-function',
            'chapter16/object-extends',
            'chapter16/module',
            'chapter16/class'
	        ]
    	}
    ]
  }
}
