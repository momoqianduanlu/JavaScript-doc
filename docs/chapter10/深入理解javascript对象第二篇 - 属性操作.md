# 深入理解javascript对象第二篇 - 属性操作

对于对象来说，属性操作是绕不开的话题。类似于“增删改查”的基本操作，属性操作分为属性查询、属性设置、属性删除，还包括属性继承。



## 属性查询

属性查询一般有两种方法，包括点运算符和方括号运算符

```javascript
var o = {
  p: 'Hello World'
};
o.p // "Hello World"
o['p'] // "Hello World"
```



【注意变】量中可以存在中文，因为中文相当于字符，与英文字符同样对待，因此可以写成person.白或person['白']

```javascript
var person = {
    白 : 1
}
person.白;//1
person['白'];//1
```





**点运算符**

点运算符是很多面向对象语句的通用写法，由于其比较简单，所以较方括号运算符相比，更常用

由于javascript是弱类型语言，在任何对象中都可以创建任意数量的属性。但当通过点运算符(.)访问对象的属性时，属性名用一个标识符来表示，标识符要符合[变量命名规则](http://www.cnblogs.com/xiaohuochai/p/5549833.html#anchor2)。标识符必须直接出现在javascript程序中，它们不是数据类型，因此程序无法修改它们

```javascript
var o = {
    a:1,
    1:2
};
console.log(o.a);//1
//由于变量不可以以数字开头，所以o.1报错
console.log(o.1);//Uncaught SyntaxError: missing ) after argument list
```





**方括号运算符**

当通过方括号运算符([])来访问对象的属性时，属性名通过字符串来表示。字符串是javascript的数据类型，在程序运行中可以修改和创建它们

使用方括号运算符有两个优点

【1】可以通过变量来访问属性

```javascript
var a = 1;
var o = {
    1: 10
}
o[a];//10
```



【2】属性名称可以为javascript无效标识符

```javascript
var myObject = {
    123:'zero',
    class:'foo'
};
console.log(myObject['123'],myObject['class']);//'zero' 'foo'
console.log(myObject.123);//报错
```





方括号中的值若是非字符串类型会使用 **String()** 隐式转换成字符串再输出；如果是字符串类型，若有引号则原值输出，否则会被识别为变量，若变量未定义，则报错

```javascript
var person = {};
person[0];  //[]中的数字不会报错，而是自动转换成字符串
person[a];  //[]中符合变量命名规则的元素会被当成变量，变量未被定义，而报错
person['']; //[]中的空字符串不会报错，是实际存在的且可以调用，但不会在控制台右侧的集合中显示

person[undefined];//不会报错，而是自动转换成字符串
person[null];//不会报错，而是自动转换成字符串
person[true];//不会报错，而是自动转换成字符串
person[false];//不会报错，而是自动转换成字符串
```





**可计算属性名**

在方括号运算符内部可以使用表达式

```javascript
var a = 1;
var person = {
    3: 'abc'
};
person[a + 2];//'abc'
```



但如果要在对象字面量内部对属性名使用表达式，则需要使用ES6的可计算属性名

```javascript
var a = 1;
//Uncaught SyntaxError: Unexpected token +
var person = {
    a + 3: 'abc'
};
```



ES6增加了可计算属性名，可以在文字中使用[]包裹一个表达式来当作属性名

```javascript
var a = 1;
var person = {
    [a + 3]: 'abc'
};
person[4];//'abc'
```





**属性查询错误**

【1】查询一个不存在的属性不会报错，而是返回undefined

```javascript
var person = {};
console.log(person.a);//undefined
```



【2】如果对象不存在，试图查询这个不存在的对象的属性会报错

```javascript
console.log(person.a);//Uncaught ReferenceError: person is not defined
```





## 属性设置

属性设置又称为属性赋值，与属性查询相同，具有点运算符和方括号运算符这两种方法

```javascript
o.p = 'abc';
o['p'] = 'abc';
```



在给对象设置属性之前，一般要先检测对象是否存在

```javascript
var len = undefined;
if(book){
    if(book.subtitle){
        len = book.subtitle.length;
    }
}
```



上面代码可以简化为

```javascript
var len = book && book.subtitle && book.subtitle.length;
```



[null](http://www.cnblogs.com/xiaohuochai/p/5665637.html#anchor3)和[undefined](http://www.cnblogs.com/xiaohuochai/p/5665637.html#anchor2)不是对象，给它们设置属性会报错

```javascript
null.a = 1;//Uncaught TypeError: Cannot set property 'a' of null
undefined.a = 1;//Uncaught TypeError: Cannot set property 'a' of undefined
```



由于[string](http://www.cnblogs.com/xiaohuochai/p/5599529.html)、[number](http://www.cnblogs.com/xiaohuochai/p/5586166.html)和[boolean](http://www.cnblogs.com/xiaohuochai/p/5616641.html)有对应的[包装对象](http://www.cnblogs.com/xiaohuochai/p/5584647.html)，所以给它们设置属性不会报错

```javascript
'abc'.a = 1;//1
(1).a = 1;//1
true.a = 1;//1
```





## 属性删除

使用delete运算符可以删除对象属性(包括数组元素)

```javascript
var o = {
    a : 1
};
console.log(o.a);//1
console.log('a' in o);//true
console.log(delete o.a);//true
console.log(o.a);//undefined
console.log('a' in o);//false
```



[注意]给对象属性置null或undefined，并没有删除该属性

```javascript
var o = {
    a : 1
};
o.a = undefined;
console.log(o.a);//undefined
console.log('a' in o);//true
console.log(delete o.a);//true
console.log(o.a);//undefined
console.log('a' in o);//false
```



使用delete删除数组元素时，不会改变数组长度

```javascript
var a = [1,2,3];
delete a[2];
2 in a;//false
a.length;//3
```



delete运算符只能删除自有属性，不能删除继承属性 (要删除继承属性必须从定义这个属性的原型对象上删除它，而且这会影响到所有继承自这个原型的对象)

```javascript
var o  = {
    a:1
}
var obj = Object.create(o);
obj.a = 2;

console.log(obj.a);//2
console.log(delete obj.a);//true
console.log(obj.a);//1
console.log(delete obj.a);//true
console.log(obj.a);//1
```



**返回值**

delete操作符的返回值是个布尔值true或false

【1】当使用delete操作符删除对象属性或数组元素删除成功时，返回true

```javascript
var o = {a:1};
var arr = [1];
console.log(delete o.a);//true
console.log(delete arr[0]);//true
```



【2】当使用delete操作符删除不存在的属性或非[左值](http://www.cnblogs.com/xiaohuochai/p/5666530.html#anchor4)时，返回true

```javascript
var o = {};
console.log(delete o.a);//true
console.log(delete 1);//true
console.log(delete {});//true
```



【3】当使用delete操作符删除变量时，返回false，严格模式下会抛出ReferenceError错误

```javascript
var a = 1;
console.log(delete a);//false
console.log(a);//1

'use strict';
var a = 1;
//Uncaught SyntaxError: Delete of an unqualified identifier in strict mode
console.log(delete a);
```



【4】当使用delete操作符删除不可配置的属性时，返回false，严格模式下会抛出TypeError错误

```javascript
var obj = {};
Object.defineProperty(obj,'a',{configurable:false});
console.log(delete obj.a);//false

'use strict';
var obj = {};
Object.defineProperty(obj,'a',{configurable:false});
//Uncaught TypeError: Cannot delete property 'a' of #<Object>
console.log(delete obj.a);
```





## 属性继承

每一个javascript对象都和另一个对象相关联。**“另一个对象”**就是我们熟知的**原型**，每一个对象都从原型继承属性。所有通过对象直接量创建的对象都具有同一个原型对象，并可以通过Object.prototype获得对原型对象的引用

```javascript
var obj = {};
console.log(obj.__proto__ === Object.prototype);//true
```



[注意]Object.prototype的原型对象是null，所以它不继承任何属性

```javascript
console.log(Object.prototype.__proto__ === null);//true
```



对象本身具有的属性叫自有属性(own property)，从原型对象继承而来的属性叫继承属性

```javascript
var o = {a:1};
var obj = Object.create(o);
obj.b = 2;
//继承自原型对象o的属性a
console.log(obj.a);//1
//自有属性b
console.log(obj.b);//2
```



**in**

in操作符可以判断属性在不在该对象上，但无法区别自有还是继承属性

```javascript
var o = {a:1};
var obj = Object.create(o);
obj.b = 2;
console.log('a' in obj);//true
console.log('b' in obj);//true
console.log('b' in o);//false
```



**for-in**

通过[for-in循环](http://www.cnblogs.com/xiaohuochai/p/5673241.html#anchor2)可以遍历出该对象中所有可枚举属性　

```javascript
var o = {a:1};
var obj = Object.create(o);
obj.b = 2;
for(var i in obj){
    console.log(obj[i]);//2 1
}
```



**hasOwnProperty()**

通过hasOwnProperty()方法可以确定该属性是自有属性还是继承属性，自有属性返回 true，继承属性返回 false

```javascript
var o = {a:1};
var obj = Object.create(o);
obj.b = 2;
console.log(obj.hasOwnProperty('a'));//false
console.log(obj.hasOwnProperty('b'));//true
```



**Object.keys()**

Object.keys()方法返回所有可枚举的自有属性

```javascript
var o = {a:1};
var obj = Object.create(o,{
    c:{value:3,configurable: false}
});
obj.b = 2;
console.log(Object.keys(obj));//['b']
```



**Object.getOwnPropertyNames()**

与Object.keys()方法不同，Object.getOwnPropertyNames()方法返回所有自有属性(包括不可枚举的属性)

```javascript
var o = {a:1};
var obj = Object.create(o,{
    c:{value:3,configurable: false}
});
obj.b = 2;
console.log(Object.getOwnPropertyNames(obj));//['c','b']
```



















