## 深入理解闭包 - IIFE

严格来讲，IIFE并不是[闭包](http://localhost:8080/knowledge-list-doc/chapter1/closure.html)，因为它并不满足函数成为闭包的三个条件。但一般地，人们认为IIFE就是闭包，毕竟闭包有多个定义。



## 实现

函数跟随一对圆括号()表示函数调用

~~~javascript
//函数声明语句写法
function test(){};
test();

//函数表达式写法
var test = function(){};
test();
~~~

但有时需要在定义函数之后，立即调用该函数。这种函数就叫做立即执行函数，全称为立即调用的函数表达式IIFE(Imdiately Invoked Function Expression)



【1】函数声明语句需要一个函数名，由于没有函数名，所以报错

~~~javascript
//SyntaxError: Unexpected token (
function(){}();
~~~



【2】函数声明语句后面加上一对圆括号，只是函数声明语句与分组操作符的组合而已。由于分组操作符不能为空，所以报错

~~~javascript
//SyntaxError: Unexpected token )
function foo(){}();

//等价于
function foo(){};
();//SyntaxError: Unexpected token )
~~~



【3】函数声明语句加上一对有值的圆括号，也仅仅是函数声明语句与不报错的分组操作符的组合而已

~~~javascript
function foo(){}(1);

//等价于
function foo(){};
(1);
~~~



所以，解决方法就是不要让function出现在行首，让引擎将其理解成一个函数表达式



**最常用的两种方法**

~~~javascript
(function(){ /* code */ }()); 
(function(){ /* code */ })(); 
~~~



**其他写法**

~~~javascript
var i = function(){ return 10; }();

true && function(){ /* code */ }();

0, function(){ /* code */ }();

!function(){ /* code */ }();
~function(){ /* code */ }();
-function(){ /* code */ }();
+function(){ /* code */ }();

new function(){ /* code */ };
new function(){ /* code */ }();
~~~



## 作用域

对于IIFE来说，通过作用域链来查找变量与普通函数有一些不同的地方



【try-catch】

在下列代码中，标准浏览器下f()函数和IIFE都返回'error'，但IE10-浏览器中的f()函数返回'10'

~~~javascript
try{
    var e = 10;
    throw new Error();
}catch(e){
    function f(){
        console.log(e);
    }
    (function (){
        console.log(e);
    })();
    f();
}
~~~



【具名函数表达式】

在下列代码中，标准浏览器下a()函数返回1，而IIFE返回a函数代码；但IE8-浏览器中，二者都返回1

~~~javascript
function a(){
    a = 1;
    console.log(a);
};
a();
(function a(){
    a = 1;
    console.log(a);
})();
~~~



## 用途

IIFE一般用于构造私有变量，避免全局空间污染

接下来用一个需求实现来更直观地说明IIFE的用途。假设有一个需求，每次调用函数，都返回加1的一个数字(数字初始值为0)



【1】全局变量

一般情况下，我们会使用全局变量来保存该数字状态

```javascript
var a = 0;
function add(){
    return ++a;
}
console.log(add());//1
console.log(add());//2
```



【2】自定义属性

但上面的方法中，变量a实际上只和add函数相关，却声明为全局变量，不太合适。

将变量a更改为函数的自定义属性更为恰当

```javascript
function add(){
    return ++add.count;
}
add.count = 0;
console.log(add());//1
console.log(add());//2
```



【3】IIFE

其实这样做，还是有问题。有些代码可能会无意中将add.count重置

使用IIFE把计数器变量保存为私有变量更安全，同时也可以减少对全局空间的污染

```javascript
var add = (function(){
    var counter = 0;
    return function(){
        return ++counter; 
    }
})();
console.log(add())//1
console.log(add())//2   
```



