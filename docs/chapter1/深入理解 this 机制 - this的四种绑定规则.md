# 深入理解 this 机制 - this的四种绑定规则

this 关键字是 javascript 中最复杂的机制之一。他是一个很特别的关键字，被自动定义在所有函数的作用域中。但是即使是非常有经验的 javascript 开发者也很难说清楚他到底指向什么。





## this 到底指向什么

之前我们说过 this 是在运行时绑定的，并不是在编写时绑定的，它的上下文取决于函数调用时的各种条件。this 的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式。

当一个函数被调用时，会创建一个活动记录（有时也称为执行上下文）。这个记录会包含函数在那里被调用（调用栈），函数的调用方式，传入的参数等信息。this 就是这个记录的一个属性，会在函数执行的过程中用到。





## 调用位置

在理解 this 的绑定过程之前，首先要理解调用位置：调用位置就是函数在代码中调用的位置（而不是声明的位置）。

通常来说，寻找调用位置就是寻找 "函数被调用的位置"，但是做起来并没有这么简单，因为某些函数式变成可能会隐藏真正的调用位置。

最重要的是分析调用栈（就是为了到达当前执行位置所调用的所有函数）。我们关心的调用位置就在当前正在执行的函数的前一个调用中。





## 默认绑定

首先要介绍的是最常用的函数调用类型：独立函数调用可以把这条规则看作是无法应用其他规则时的默认规则。



全局环境中，this默认绑定到window

~~~javascript
console.log(this === window);//true
~~~



函数独立调用时，this默认绑定到window

```javascript
function foo(){
    console.log(this === window);
}
foo(); //true
```



被嵌套的函数独立调用时，this默认绑定到window

```javascript
//虽然test()函数被嵌套在obj.foo()函数中，但test()函数是独立调用，而不是方法调用。所以this默认绑定到window
var a = 0;
var obj = {
    a : 2,
    foo:function(){
        function test(){
            console.log(this.a);
        }
        test();
    }
}
obj.foo();//0
```



**IIFE**

IIFE 立即执行函数实际上是函数声明后直接调用执行

```javascript
var a = 0;
function foo(){
    (function test(){
        console.log(this.a);
    })()
};
var obj = {
    a : 2,
    foo:foo
}
obj.foo();//0
```



```javascript
//等价于上例
var a = 0;
var obj = {
    a : 2,
    foo:function(){
            function test(){
                console.log(this.a);
            }
            test();
    }
}
obj.foo();//0
```



**闭包**

类似地，test()函数是独立调用，而不是方法调用，所以this默认绑定到window

```javascript
var a = 0;
function foo(){
    function test(){
        console.log(this.a);
    }
    return test;
};
var obj = {
    a : 2,
    foo:foo
}
obj.foo()();//0
```



由于闭包的this默认绑定到window对象，但又常常需要访问嵌套函数的this，所以常常在嵌套函数中使用var that = this，然后在闭包中使用that替代this，使用作用域查找的方法来找到嵌套函数的this值 

```javascript
var a = 0;
function foo(){
    var that = this;
    function test(){
        console.log(that.a);
    }
    return test;
};
var obj = {
    a : 2,
    foo:foo
}
obj.foo()();//2
```



**strict mode**

如果使用严格模式（strict mode），则不能将全局对象用于默认绑定，因此 this 会绑定到 undefined；

~~~javascript
function () {
	"use strict"
	console.log(this.a)
}

var a = 2

foo() // TypeError: this is undefined
~~~



这里有一个重要但是非常重要的细节，虽然 this 的绑定完全取决于调用位置，但是只有 foo() 运行在非 strict mode 下时，默认绑定才能绑定到全局对象，在严格模式下调用 foo() 则不影响默认绑定：

~~~javascript
function foo () {
	console.log(this.a)
}

var a = 2

(function () {
	"use strict"
	foo() // 2
})()
~~~





## 隐式绑定

一般地，被直接对象所包含的函数调用时，也称为方法调用，this隐式绑定到该直接对象

```javascript
function foo(){
    console.log(this.a);
};
var obj1 = {
    a:1,
    foo:foo,
    obj2:{
        a:2,
        foo:foo
    }
}

//foo()函数的直接对象是obj1，this隐式绑定到obj1
obj1.foo();//1

//foo()函数的直接对象是obj2，this隐式绑定到obj2
obj1.obj2.foo();//2
```



**隐式丢失**

隐式丢失是指被隐式绑定的函数丢失绑定对象，从而默认绑定到window。这种情况容易出错却又常见



【函数别名】

```javascript
var a = 0;
function foo(){
    console.log(this.a);
};
var obj = {
    a : 2,
    foo:foo
}
//把obj.foo赋予别名bar，造成了隐式丢失，因为只是把foo()函数赋给了bar，而bar与obj对象则毫无关系
var bar = obj.foo;
bar();//0
```



```javascript
//等价于
var a = 0;
var bar = function foo(){
    console.log(this.a);
}
bar();//0
```



【参数传递】

```javascript
var a = 0;
function foo(){
    console.log(this.a);
};
function bar(fn){
    fn();
}
var obj = {
    a : 2,
    foo:foo
}
//把obj.foo当作参数传递给bar函数时，有隐式的函数赋值fn=obj.foo。与上例类似，只是把foo函数赋给了fn，而fn与obj对象则毫无关系
bar(obj.foo);//0
```



```javascript
//等价于
var a = 0;
function bar(fn){
    fn();
}
bar(function foo(){
    console.log(this.a);
});
```



【内置函数】

　　内置函数与上例类似，也会造成隐式丢失

```
var a = 0;
function foo(){
    console.log(this.a);
};
var obj = {
    a : 2,
    foo:foo
}
setTimeout(obj.foo,100);//0
```



```javascript
//等价于
var a = 0;
setTimeout(function foo(){
    console.log(this.a);
},100);//0
```



【间接引用】

　　 函数的"间接引用"一般都在无意间创建，最容易在赋值时发生，会造成隐式丢失

```javascript
function foo() {
    console.log( this.a );
}
var a = 2;
var o = { a: 3, foo: foo };
var p = { a: 4 };
o.foo(); // 3
//将o.foo函数赋值给p.foo函数，然后立即执行。相当于仅仅是foo()函数的立即执行
(p.foo = o.foo)(); // 2
```



```javascript
function foo() {
    console.log( this.a );
}
var a = 2;
var o = { a: 3, foo: foo };
var p = { a: 4 };
o.foo(); // 3
//将o.foo函数赋值给p.foo函数，之后p.foo函数再执行，是属于p对象的foo函数的执行
p.foo = o.foo;
p.foo();//4
```



【其他情况】

　　在javascript引擎内部，obj和obj.foo储存在两个内存地址，简称为M1和M2。只有obj.foo()这样调用时，是从M1调用M2，因此this指向obj。但是，下面三种情况，都是直接取出M2进行运算，然后就在全局环境执行运算结果（还是M2），因此this指向全局环境



```javascript
var a = 0;
var obj = {
    a : 2,
    foo:foo
};
function foo() {
    console.log( this.a );
};

(obj.foo = obj.foo)();//0

(false || obj.foo)();//0

(1, obj.foo)();//0
```





## 显式绑定

通过call()、apply()、bind()方法把对象绑定到this上，叫做显式绑定。对于被调用的函数来说，叫做间接调用

```javascript
var a = 0;
function foo(){
    console.log(this.a);
}
var obj = {
    a:2
};
foo();//0
foo.call(obj);//2
```



通过 foo.call(..)，我们可以在调用 foo 时强制把它的 this 绑定到 obj 上。

如果你传入了一个原始值（字符串类型，布尔类型或者数字类型）来当作 this 的绑定对象，这个原始值会被转换成他的对象形式（也就是 new String(..)，new Boolean(..)或者 new Number(..)）。这通常被称为 "装箱"。



普通的显式绑定无法解决隐式丢失问题

```javascript
var a = 0;
function foo(){
    console.log(this.a);
}
var obj1 = {
    a:1
};
var obj2 = {
    a:2
};
foo.call(obj1);//1
foo.call(obj2);//2
```



【硬绑定】

　　硬绑定是显式绑定的一个变种，使this不能再被修改

```javascript
var a = 0;
function foo(){
    console.log(this.a);
}
var obj = {
    a:2
};
var bar= function(){
    foo.call(obj);
}
//在bar函数内部手动调用foo.call(obj)。因此，无论之后如何调用函数bar，它总会手动在obj上调用foo
bar();//2
setTimeout(bar,100);//2
bar.call(window);//2
```



【API】

　　javascript中新增了许多内置函数，具有显式绑定的功能，如数组的5个[迭代方法](http://www.cnblogs.com/xiaohuochai/p/5682621.html#anchor10)：map()、forEach()、filter()、some()、every()



```javascript
var id = 'window';
function foo(el){
    console.log(el,this.id);
}
var obj = {
    id: 'fn'
};
[1,2,3].forEach(foo);//1 "window" 2 "window" 3 "window"
[1,2,3].forEach(foo,obj);//1 "fn" 2 "fn" 3 "fn"
```



## new绑定

如果函数或者方法调用之前带有关键字new，它就构成构造函数调用。对于this绑定来说，称为new绑定



【1】构造函数通常不使用return关键字，它们通常初始化新对象，当构造函数的函数体执行完毕时，它会显式返回。在这种情况下，构造函数调用表达式的计算结果就是这个新对象的值

```javascript
function fn(){
    this.a = 2;
}
var test = new fn();
console.log(test);//{a:2}
```

　　

【2】如果构造函数使用return语句但没有指定返回值，或者返回一个原始值，那么这时将忽略返回值，同时使用这个新对象作为调用结果

```javascript
function fn(){
    this.a = 2;
    return;
}
var test = new fn();
console.log(test);//{a:2}
```



【3】如果构造函数显式地使用return语句返回一个对象，那么调用表达式的值就是这个对象

```javascript
var obj = {a:1};
function fn(){
    this.a = 2;
    return obj;
}
var test = new fn();
console.log(test);//{a:1}
```



[注意]尽管有时候构造函数看起来像一个方法调用，它依然会使用这个新对象作为this。也就是说，在表达式new o.m()中，this并不是o

```javascript
var o = {
    m: function(){
        return this;
    }
}
var obj = new o.m();
console.log(obj,obj === o);//{} false
console.log(obj.constructor === o.m);//true
```



















