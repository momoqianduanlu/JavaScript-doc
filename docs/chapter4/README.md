

# ES6 系列之 let 和 const

## 块级作用域的出现

通过 var 声明的变量存在变量提升的特性：

~~~javascript
if (condition) {
    var value = 1;
}
console.log(value);
~~~

刚刚接触 javascript 的人可能会觉得只有当 condition 为 true 的时候，才会创建 value，如果 condition 为 fasle，结果可能是报错，可是结果并不是像我们想的那样，因为变量提升的原因，代码相当于：

~~~javascript
var value;
if (condition) {
    value = 1;
}
console.log(value);
~~~

如果 condition 为 false，结果会是 undefined。

除此之外：在 for 循环中

~~~javascript
for (var i = 0; i < 10; i++) {
    ...
}
console.log(i); // 10
~~~

这段 for 循环其实我是知道 i 如何成为 10 的，

即便循环已经结束了，我们依然可以访问 i 的值。

为了加强对变量生命周期的控制，ECMAScript 6 引入了块级作用域。

- 函数内部
- 块中(字符 { 和 } 之间的区域)

## let 和 const

**块级声明** 用于声明在 指定块的作用域之外无法访问的变量。

let 和 const 都是块级声明的一种。

我们来回顾下 let 和 const 的特点：

**1.不会被提升**

```javascript
if (false) {
    let value = 1;
}
console.log(value); // Uncaught ReferenceError: value is not defined
```

var 命令会发生 **变量提升** 现象

为了纠正这种现象，let 命令改变了语法行为，他所声明的变量一定要在声明后使用，否则便会报错，



**2.重复声明报错**

```javascript
var value = 1;
let value = 2; // Uncaught SyntaxError: Identifier 'value' has already been declared
```

let 不允许在相同作用域内重复声明同一个变量



**3.不绑定全局作用域**

当在全局作用域中使用 var 声明的时候，会创建一个新的全局变量作为全局对象的属性。

```javascript
var value = 1;
console.log(window.value); // 1
```

然而 let 和 const 不会：

```javascript
let value = 1;
console.log(window.value); // undefined
```



再来说下 let 和 const 的区别：

const 用于声明常量，其值一旦被设定不能再被修改，否则会报错。

值得一提的是：const 声明不允许修改绑定，但允许修改值。这意味着当用 const 声明对象时：

```javascript
const data = {
    value: 1
}

// 没有问题
data.value = 2;
data.num = 3;

// 报错
data = {}; // Uncaught TypeError: Assignment to constant variable.
```

## 暂时性死区

临时死区(Temporal Dead Zone)，简写为 TDZ。

let 和 const 声明的变量不会被提升到作用域顶部，如果在声明之前访问这些变量，会导致报错：

```javascript
console.log(typeof value); // Uncaught ReferenceError: value is not defined
let value = 1;
```

这是因为 JavaScript 引擎在扫描代码发现变量声明时，要么将它们提升到作用域顶部(遇到 var 声明)，要么将声明放在 TDZ 中(遇到 let 和 const 声明)。访问 TDZ 中的变量会触发运行时错误。只有执行过变量声明语句后，变量才会从 TDZ 中移出，然后方可访问。

看似很好理解，不保证你不犯错：

```javascript
var value = "global";

// 例子1
(function() {
    console.log(value);

    let value = 'local';
}());

// 例子2
{
    console.log(value);

    const value = 'local';
};
```

两个例子中，结果并不会打印 "global"，而是报错 `Uncaught ReferenceError: value is not defined`，就是因为 TDZ 的缘故。

ES6明确规定，如果区块中存在 let 和 const 命令，则这个区块对这些命令声明的变量从一开始就形成封闭作用域，

只要在声明之前就使用这些变量，就会报错。

## 循环中的块级作用域

```javascript
var funcs = [];
for (var i = 0; i < 3; i++) {
    funcs[i] = function () {
        console.log(i);
    };
}
funcs[0](); // 3
```

上面代码中，变量 i 是 var 声明的，在全局范围内有效，所以全局只有一个变量 i ，每一次循环，变量 i 的值都会发生改变，而循环内，被赋值给数组 funcs 的函数内部的 `console.log(i)`中的 i 指向全局的 i 。也就是说，所有数组 a 的成员中的  i 指向的都是同一个 i ，导致运行时输出的是最后一轮的 i 值，也就是3。



一个老生常谈的面试题，解决方案如下：

```javascript
var funcs = [];
for (var i = 0; i < 3; i++) {
    funcs[i] = (function(i){
        return function() {
            console.log(i);
        }
    }(i))
}
funcs[0](); // 0
```



ES6 的 let 为这个问题提供了新的解决方法：

```javascript
var funcs = [];
for (let i = 0; i < 3; i++) {
    funcs[i] = function () {
        console.log(i);
    };
}
funcs[0](); // 0
```



问题在于，上面讲了 let 不提升，不能重复声明，不能绑定全局作用域等等特性，可是为什么在这里就能正确打印出 i 值呢？

如果是不重复声明，在循环第二次的时候，又用 let 声明了 i，应该报错呀，就算因为某种原因，重复声明不报错，一遍一遍迭代，i 的值最终还是应该是 3 呀，还有人说 for 循环的
设置循环变量的那部分是一个单独的作用域，就比如：

```javascript
for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);
}
// abc
// abc
// abc
```

这个例子是对的，如果我们把 let 改成 var 呢？

```javascript
for (var i = 0; i < 3; i++) {
  var i = 'abc';
  console.log(i);
}
// abc
这里为什么只会输出一个 abc 呢？
因为for( )里面使用var时没有在( )内形成封闭的作用域，i被循环体赋值成'abc'，!!('abc' < 3) === false，循环停止了。
```

为什么结果就不一样了呢，如果有单独的作用域，结果应该是相同的呀……

如果要追究这个问题，就要抛弃掉之前所讲的这些特性！这是因为 let 声明在循环内部的行为是标准中专门定义的，不一定就与 let 的不提升特性有关，其实，在早期的 let 实现中就不包含这一行为。

[https://github.com/mqyqingfeng/Blog/issues/82](查看github)



我们会发现，在 for 循环中使用 let 和 var，底层会使用不同的处理方式。

那么当使用 let 的时候底层到底是怎么做的呢？

简单的来说，就是在 `for (let i = 0; i < 3; i++)` 中，即圆括号之内建立一个隐藏的作用域，这就可以解释为什么:

```javascript
for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);
}
// abc
// abc
// abc
```

然后**每次迭代循环时都创建一个新变量，并以之前迭代中同名变量的值将其初始化**。这样对于下面这样一段代码

```javascript
var funcs = [];
for (let i = 0; i < 3; i++) {
    funcs[i] = function () {
        console.log(i);
    };
}
funcs[0](); // 0
```

就相当于：

```javascript
// 伪代码
(let i = 0) {
    funcs[0] = function() {
        console.log(i)
    };
}

(let i = 1) {
    funcs[1] = function() {
        console.log(i)
    };
}

(let i = 2) {
    funcs[2] = function() {
        console.log(i)
    };
};
```

当执行函数的时候，根据词法作用域就可以找到正确的值，其实你也可以理解为 let 声明模仿了闭包的做法来简化循环过程。



## 循环中的 let 和 const

不过到这里还没有结束，如果我们把 let 改成 const 呢？

```javascript
var funcs = [];
for (const i = 0; i < 10; i++) {
    funcs[i] = function () {
        console.log(i);
    };
}
funcs[0](); // Uncaught TypeError: Assignment to constant variable.
```

结果会是报错，因为虽然我们每次都创建了一个新的变量，然而我们却在迭代中尝试修改 const 的值，所以最终会报错。

说完了普通的 for 循环，我们还有 for in 循环呢~

那下面的结果是什么呢？

```javascript
var funcs = [], object = {a: 1, b: 1, c: 1};
for (var key in object) {
    funcs.push(function(){
        console.log(key)
    });
}

funcs[0]()
```

结果是 'c';

那如果把 var 改成 let 或者 const 呢？

使用 let，结果自然会是 'a'，const 呢？ 报错还是 'a'?

结果是正确打印 'a'，这是因为在 for in 循环中，每次迭代不会修改已有的绑定，而是会创建一个新的绑定。





