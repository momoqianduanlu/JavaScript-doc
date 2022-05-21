---
sidebar: auto
---

# 深入理解ES6
在`ECMAScript6`标准定稿之前，已经开始出现了一些实验性的`转译器(Transpiler)`，例如谷歌的`Traceur`，可以将代码从`ECMAScript6`转换成`ECMAScript5`。但它们大多功能非常有限，或难以插入现有的`JavaScript`构建管道。<br/>
但是，随后出现了新型转译器`6to5`改变了这一切。它易于安装，可以很好的集成现有的工具中，生成的代码可读，于是就像野火一样逐步蔓延开来，`6to5`也就是现在鼎鼎大名的`Babel`。

## 目录

- 类型扩展
  - 数字扩展
  - 字符串扩展
  - 模板字面量
  - 正则扩展
  - 函数扩展
  - 对象扩展
  - Symbol类型
  - Set和Map集合
  - 数组扩展
- 功能扩展
  - 块级作用域
  - 解构赋值
  - 类
  - 模块
  - 修饰器Decorator
- 异步操作
  - 迭代器(Iterator)和生成器(Generator)
  - Promise(源码解析)和异步编程
  - async
  
  

## ES6-数字扩展

### 指数运算符

　　ES2016引入的唯一一个JS语法变化是求幂运算符，它是一种将指数应用于基数的数学运算。JS已有的Math.pow()方法可以执行求幂运算，但它也是为数不多的需要通过方法而不是正式的运算符来进行求幂

　　求幂运算符是两个星号(**)左操作数是基数，右操作数是指数

```javascript
let result = 5 ** 2;
console.log(result) // 25
console.log(result === Math.pow(5,2) ) // true
```

　　指数运算符可以与等号结合，形成一个新的赋值运算符（`**=`）

```javascript
let a = 1.5;
a **= 2;
// 等同于 a = a * a;

let b = 4;
b **= 3;
// 等同于 b = b * b * b;
```

　　[注意]在 V8 引擎中，指数运算符与`Math.pow`的实现不相同，对于特别大的运算结果，两者会有细微的差异

```javascript
Math.pow(99, 99) // 3.697296376497263e+197

99 ** 99 // 3.697296376497268e+197
```

【运算顺序】

　　求幂运算符具有JS中所有二进制运算符的优先级(一元运算符的优先级高于**)，这意味着它首先应用于所有复合操作

```javascript
let result = 2 * 5 ** 2
console.log(result) // 50
```

　　先计算52，然后将得到的值乘以2，最终结果为50

【运算限制】

　　取幂运算符确实有其他运算符没有的一些不寻常的限制，它左侧的一元表达式只能使用++或--

```javascript
//语法错误
let result =-5 ** 2
```

　　此示例中的-5的写法是一个语法错误，因为运算的顺序是不明确的。-是只适用于5呢，还是适用于表达式`5**2`的结果？禁用求幂运算符左侧的二元表达式可以消除歧义。要明确指明意图，需要用括号包裹-5或5**2

```javascript
//可以包裹5**2
let result1 =-(5 ** 2) //-25

//也可以包裹-5
let result2 = (-5) ** 2 // 等于25
```

　　如果在表达式两端放置括号，则-将应用于整个表达式；如果在-5两端放置括号，则表明想计算-5的二次幕

　　在求幕运算符左侧无须用括号就可以使用++和--，因为这两个运算符都明确定义了作用于操作数的行为。前缀++或--会在其他所有操作发生之前更改操作数，而后缀版本直到整个表达式被计算过后才会进行改变。这两个用法在运算付左侧都是安全的

```javascript
let num1 = 2,
    num2 = 2;
console.log(++num1 ** 2) // 9
console.log(num1) // 3
console.log(num2--** 2) // 4
console.log(num2) // 1
```

　　在这个示例中，num1在应用取幂运算符之前先加1，所以num1变为3，运算结果为9；而num2取幂运算的值保持为2，之后再减1

 

### 不同进制

　　ES6 提供了二进制和八进制数值的新的写法，分别用前缀`0b`（或`0B`）和`0o`（或`0O`）表示

```javascript
0b111110111 === 503 // true
0o767 === 503 // true
```

　　从 ES5 开始，在严格模式之中，八进制就不再允许使用前缀`0`表示，ES6 进一步明确，要使用前缀`0o`表示

```javascript
// 非严格模式
(function(){
  console.log(0o11 === 011);
})() // true

// 严格模式
(function(){
  'use strict';
  console.log(0o11 === 011);
})() // Uncaught SyntaxError: Octal literals are not allowed in strict mode.
```

　　如果要将`0b`和`0o`前缀的字符串数值转为十进制，要使用`Number`方法

```javascript
Number('0b111')  // 7
Number('0o10')  // 8
```

 

### Number方法

　　ES6 在`Number`对象上，新提供了`Number.isFinite()`和`Number.isNaN()`两个方法

【`Number.isFinite()`】

`Number.isFinite()`用来检查一个数值是否为有限的（finite）

```javascript
console.log( Number.isFinite(15)); // true
console.log( Number.isFinite(0.8)); // true
console.log( Number.isFinite(NaN)); // false
console.log( Number.isFinite(Infinity)); // false
console.log( Number.isFinite(-Infinity)); // false
console.log( Number.isFinite('foo')); // false
console.log( Number.isFinite('15')); // false
console.log( Number.isFinite(true)); // false
```

　　与原有的isFinite()方法的不同之处在于，Number.isFinite()方法没有隐式的Number()类型转换，对于非数值一律返回`false`

```javascript
console.log(isFinite(15)); // true
console.log(isFinite(0.8)); // true
console.log(isFinite(NaN)); // false
console.log(isFinite(Infinity)); // false
console.log(isFinite(-Infinity)); // false
console.log(isFinite('foo')); // false
console.log(isFinite('15')); // true
console.log(isFinite(true)); // true
```

　　ES5 可以通过下面的代码，部署`Number.isFinite`方法

```javascript
(function (global) {
  var global_isFinite = global.isFinite;

  Object.defineProperty(Number, 'isFinite', {
    value: function isFinite(value) {
      return typeof value === 'number' && global_isFinite(value);
    },
    configurable: true,
    enumerable: false,
    writable: true
  });
})(this);
```

【`Number.isNaN()`】

```javascript
Number.isNaN()`用来检查一个值是否为`NaN
console.log(Number.isNaN('true')); //false
console.log(Number.isNaN('hello')); //false
console.log(Number.isNaN(NaN)); // true
console.log(Number.isNaN(15)); // false
console.log(Number.isNaN('15')); // false
console.log(Number.isNaN(true)); // false
console.log(Number.isNaN('true'/0)); // true
```

　　与原有的isNaN()方法不同，不存在隐式的Number()类型转换，非`NaN`一律返回`false`

```javascript
console.log(isNaN('true')); //true
console.log(isNaN('hello')); //true
console.log(isNaN(NaN)); // true
console.log(isNaN(15)); // false
console.log(isNaN('15')); // false
console.log(isNaN(true)); // false
console.log(isNaN('true'/0)); // true
```

　　ES6 将全局方法`parseInt()`和`parseFloat()`，移植到`Number`对象上面，行为完全保持不变

【parseInt()】

```javascript
// ES5的写法
parseInt('12.34') // 12
parseFloat('123.45#') // 123.45

// ES6的写法
Number.parseInt('12.34') // 12
Number.parseFloat('123.45#') // 123.45
```

　　这样做的目的，是逐步减少全局性方法，使得语言逐步模块化

```javascript
Number.parseInt === parseInt // true
Number.parseFloat === parseFloat // true
```

【`Number.isInteger()`】

`Number.isInteger()`用来判断一个值是否为整数。需要注意的是，在JS内部，整数和浮点数是同样的储存方法，所以3和3.0被视为同一个值

```javascript
Number.isInteger(25) // true
Number.isInteger(25.0) // true
Number.isInteger(25.1) // false
Number.isInteger("15") // false
Number.isInteger(true) // false
```

　　ES5 可以通过下面的代码，部署`Number.isInteger()`

```javascript
(function (global) {
  var floor = Math.floor,
    isFinite = global.isFinite;

  Object.defineProperty(Number, 'isInteger', {
    value: function isInteger(value) {
      return typeof value === 'number' &&
        isFinite(value) &&
        floor(value) === value;
    },
    configurable: true,
    enumerable: false,
    writable: true
  });
})(this);
```

 

### Math对象

　　ES6在Math对象上新增了17个与数学相关的方法。所有这些方法都是静态方法，只能在Math对象上调用

【`Math.trunc`】

`Math.trunc`方法用于去除一个数的小数部分，返回整数部分

```javascript
Math.trunc(4.1) // 4
Math.trunc(4.9) // 4
Math.trunc(-4.1) // -4
Math.trunc(-4.9) // -4
Math.trunc(-0.1234) // -0
```

　　对于非数值，`Math.trunc`内部使用`Number`方法将其先转为数值

```javascript
Math.trunc('123.456')// 123
```

　　对于空值和无法截取整数的值，返回NaN

```javascript
Math.trunc(NaN);      // NaN
Math.trunc('foo');    // NaN
Math.trunc();         // NaN
```

　　对于没有部署这个方法的环境，可以用下面的代码模拟

```javascript
Math.trunc = Math.trunc || function(x) {
  return x < 0 ? Math.ceil(x) : Math.floor(x);
};
```

【`Math.sign`】

`Math.sign`方法用来判断一个数到底是正数、负数、还是零。对于非数值，会先将其转换为数值

　　它会返回以下五种值

```javascript
参数为正数，返回+1；
参数为负数，返回-1；
参数为0，返回0；
参数为-0，返回-0;
其他值，返回NaN。
Math.sign(-5) // -1
Math.sign(5) // +1
Math.sign(0) // +0
Math.sign(-0) // -0
Math.sign(NaN) // NaN
Math.sign('9'); // +1
Math.sign('foo'); // NaN
Math.sign();      // NaN
```

　　对于没有部署这个方法的环境，可以用下面的代码模拟

```javascript
Math.sign = Math.sign || function(x) {
  x = +x; // convert to a number
  if (x === 0 || isNaN(x)) {
    return x;
  }
  return x > 0 ? 1 : -1;
};
```

【`Math.cbrt`】

`Math.cbrt`方法用于计算一个数的立方根

```javascript
Math.cbrt(-1) // -1
Math.cbrt(0)  // 0
Math.cbrt(1)  // 1
Math.cbrt(2)  // 1.2599210498948734
```

　　对于非数值，`Math.cbrt`方法内部也是先使用`Number`方法将其转为数值

```javascript
Math.cbrt('8') // 2
Math.cbrt('hello') // NaN
```

　　对于没有部署这个方法的环境，可以用下面的代码模拟

```javascript
Math.cbrt = Math.cbrt || function(x) {
  var y = Math.pow(Math.abs(x), 1/3);
  return x < 0 ? -y : y;
};
```

【`Math.clz32`】

　　JS的整数使用32位二进制形式表示，`Math.clz32`方法返回一个数的32位无符号整数形式有多少个前导0

```javascript
Math.clz32(0) // 32
Math.clz32(1) // 31
Math.clz32(1000) // 22
Math.clz32(0b01000000000000000000000000000000) // 1
Math.clz32(0b00100000000000000000000000000000) // 2
```

　　上面代码中，0的二进制形式全为0，所以有32个前导0；1的二进制形式是`0b1`，只占1位，所以32位之中有31个前导0；1000的二进制形式是`0b1111101000`，一共有10位，所以32位之中有22个前导0

　　左移运算符（`<<`）与`Math.clz32`方法直接相关

```javascript
Math.clz32(0) // 32
Math.clz32(1) // 31
Math.clz32(1 << 1) // 30
Math.clz32(1 << 2) // 29
Math.clz32(1 << 29) // 2
```

　　对于小数，`Math.clz32`方法只考虑整数部分

```javascript
Math.clz32(3.2) // 30
Math.clz32(3.9) // 30
```

　　对于空值或其他类型的值，`Math.clz32`方法会将它们先转为数值，然后再计算

```javascript
Math.clz32() // 32
Math.clz32(NaN) // 32
Math.clz32(Infinity) // 32
Math.clz32(null) // 32
Math.clz32('foo') // 32
Math.clz32([]) // 32
Math.clz32({}) // 32
Math.clz32(true) // 31
```

【`Math.imul`】

`Math.imul`方法返回两个数以32位带符号整数形式相乘的结果，返回的也是一个32位的带符号整数

```javascript
Math.imul(2, 4)   // 8
Math.imul(-1, 8)  // -8
Math.imul(-2, -2) // 4
```

　　如果只考虑最后32位，大多数情况下，`Math.imul(a, b)`与`a * b`的结果是相同的，即该方法等同于`(a * b)|0`的效果（超过32位的部分溢出）。之所以需要部署这个方法，是因为JS有精度限制，超过2的53次方的值无法精确表示。这就是说，对于那些很大的数的乘法，低位数值往往都是不精确的，`Math.imul`方法可以返回正确的低位数值

```javascript
(0x7fffffff * 0x7fffffff)|0 // 0
```

　　上面这个乘法算式，返回结果为0。但是由于这两个二进制数的最低位都是1，所以这个结果肯定是不正确的，因为根据二进制乘法，计算结果的二进制最低位应该也是1。这个错误就是因为它们的乘积超过了2的53次方，JS无法保存额外的精度，就把低位的值都变成了0。`Math.imul`方法可以返回正确的值1

```javascript
Math.imul(0x7fffffff, 0x7fffffff) // 1
```

【Math.fround】

　　Math.fround方法返回一个数的单精度浮点数形式

```javascript
Math.fround(0)     // 0
Math.fround(1)     // 1
Math.fround(1.337) // 1.3370000123977661
Math.fround(1.5)   // 1.5
Math.fround(NaN)   // NaN
```

　　对于整数来说，`Math.fround`方法返回结果不会有任何不同，区别主要是那些无法用64个二进制位精确表示的小数。这时，`Math.fround`方法会返回最接近这个小数的单精度浮点数

　　对于没有部署这个方法的环境，可以用下面的代码模拟

```javascript
Math.fround = Math.fround || function(x) {
  return new Float32Array([x])[0];
};
```

【`Math.hypot`】

`Math.hypot`方法返回所有参数的平方和的平方根

```javascript
Math.hypot(3, 4);        // 5
Math.hypot(3, 4, 5);     // 7.0710678118654755
Math.hypot();            // 0
Math.hypot(NaN);         // NaN
Math.hypot(3, 4, 'foo'); // NaN
Math.hypot(3, 4, '5');   // 7.0710678118654755
Math.hypot(-3);          // 3
```

　　上面代码中，3的平方加上4的平方，等于5的平方

　　如果参数不是数值，`Math.hypot`方法会将其转为数值。只要有一个参数无法转为数值，就会返回NaN

　　ES6新增了4个对数相关方法

【`Math.expm1`】

```javascript
Math.expm1(x)`返回ex - 1，即`Math.exp(x) - 1
Math.expm1(-1) // -0.6321205588285577
Math.expm1(0)  // 0
Math.expm1(1)  // 1.718281828459045
```

　　对于没有部署这个方法的环境，可以用下面的代码模拟

```javascript
Math.expm1 = Math.expm1 || function(x) {
  return Math.exp(x) - 1;
};
```

【`Math.log1p(x)`】

```javascript
Math.log1p(x)`方法返回`1 + x`的自然对数，即`Math.log(1 + x)`。如果`x`小于-1，返回`NaN
Math.log1p(1)  // 0.6931471805599453
Math.log1p(0)  // 0
Math.log1p(-1) // -Infinity
Math.log1p(-2) // NaN
```

　　对于没有部署这个方法的环境，可以用下面的代码模拟

```javascript
Math.log1p = Math.log1p || function(x) {
  return Math.log(1 + x);
};
```

【`Math.log10(x)`】

`Math.log10(x)`返回以10为底的`x`的对数。如果`x`小于0，则返回NaN

```javascript
Math.log10(2)      // 0.3010299956639812
Math.log10(1)      // 0
Math.log10(0)      // -Infinity
Math.log10(-2)     // NaN
Math.log10(100000) // 5
```

　　对于没有部署这个方法的环境，可以用下面的代码模拟

```javascript
Math.log10 = Math.log10 || function(x) {
  return Math.log(x) / Math.LN10;
};
```

【Math.log2(x)】

`Math.log2(x)`返回以2为底的`x`的对数。如果`x`小于0，则返回NaN

```javascript
Math.log2(3)       // 1.584962500721156
Math.log2(2)       // 1
Math.log2(1)       // 0
Math.log2(0)       // -Infinity
Math.log2(-2)      // NaN
Math.log2(1024)    // 10
Math.log2(1 << 29) // 29
```

　　对于没有部署这个方法的环境，可以用下面的代码模拟

```javascript
Math.log2 = Math.log2 || function(x) {
  return Math.log(x) / Math.LN2;
};
```

　　ES6新增了6个双曲函数方法

```javascript
Math.sinh(x) 返回x的双曲正弦（hyperbolic sine）
Math.cosh(x) 返回x的双曲余弦（hyperbolic cosine）
Math.tanh(x) 返回x的双曲正切（hyperbolic tangent）
Math.asinh(x) 返回x的反双曲正弦（inverse hyperbolic sine）
Math.acosh(x) 返回x的反双曲余弦（inverse hyperbolic cosine）
Math.atanh(x) 返回x的反双曲正切（inverse hyperbolic tangent）
```

## ES6-字符串扩展

　　字符串是编程中重要的数据类型，只有熟练掌握字符串操作才能更高效地开发程序。JS字符串的特性总是落后于其它语言，例如，直到 ES5 中字符串才获得了 trim() 方法。而 ES6 则继续添加新功能以扩展 JS 解析字符串的能力。本文将详细介绍ES6中字符串扩展

 

### 子串识别

　　自从 JS 引入了 indexOf() 方法，开发者们就使用它来识别字符串是否存在于其它字符串中。ES6 包含了以下三个方法来满足这类需求：includes()、startsWith()、endsWith()

【includes()】

　　该方法在给定文本存在于字符串中的任意位置时会返回 true ，否则返回false

【startsWith()】

　　该方法在给定文本出现在字符串起始处时返回 true ，否则返回 false

【endsWith()】

　　该方法在给定文本出现在字符串结尾处时返回 true ，否则返回 false 

　　以上每个方法都接受两个参数：需要搜索的文本，以及可选的搜索起始位置索引

　　当提供了第二个参数(假设为n)时， includes() 与 startsWith() 方法会从该索引位置(n)开始尝试匹配；而endsWith() 方法则从字符串长度减去这个索引值的位置开始尝试匹配

　　当第二个参数未提供时， includes() 与 startsWith() 方法会从字符串起始处开始查找，而 endsWith() 方法则从尾部开始。实际上，第二个参数减少了搜索字符串的次数

```javascript
var msg = "Hello world!";
console.log(msg.startsWith("Hello")); // true
console.log(msg.endsWith("!")); // true
console.log(msg.includes("o")); // true

console.log(msg.startsWith("o")); // false
console.log(msg.endsWith("world!")); // true
console.log(msg.includes("x")); // false

console.log(msg.startsWith("o", 4)); // true
console.log(msg.endsWith("o", 5)); // true
console.log(msg.includes("o", 8)); // false
```

　　虽然这三个方法使得判断子字符串是否存在变得更容易，但它们只返回了一个布尔值。若需要找到它们在字符串中的确切位置，则需要使用 [indexOf()](http://www.cnblogs.com/xiaohuochai/p/5612962.html#anchor7) 和 lastIndexOf() 

　　[注意]如果向 startsWith() 、 endsWith() 或 includes() 方法传入了正则表达式而不是字符串，会抛出错误。而对于indexOf()和lastIndexOf()这两个方法，它们会将正则表达式转换为字符串并搜索它

 

### 字符串重复

【repeat()】

　　ES6为字符串添加了一个 repeat() 方法，它接受一个参数作为字符串的重复次数，返回一个将初始字符串重复指定次数的新字符串

```javascript
console.log("x".repeat(3)); // "xxx"
console.log("hello".repeat(2)); // "hellohello"
console.log("abc".repeat(4)); // "abcabcabcabc"
```

　　参数如果是小数，会被取整

```javascript
console.log('na'.repeat(2.9)); // "nana"
```

　　如果`repeat`的参数是负数或者`Infinity`，会报错

```javascript
//Uncaught RangeError: Invalid count value
console.log('na'.repeat(Infinity));
//Uncaught RangeError: Invalid count value
console.log('na'.repeat(-1));
```

　　如果参数是0到-1之间的小数，则等同于0，这是因为会先进行取整运算。0到-1之间的小数，取整以后等于`-0`，`repeat`视同为0

```javascript
console.log('na'.repeat(-0.9)); // ""
```

　　参数`NaN`等同于0

```javascript
console.log('na'.repeat(NaN)); // ""
```

　　如果`repeat`的参数是字符串，则会先转换成数字

```javascript
console.log('na'.repeat('na')); // ""
console.log('na'.repeat('3'));  // "nanana"
```

【创建缩进级别】

　　此方法比相同目的的其余方法更加方便，在操纵文本时特别有用，尤其是在需要产生缩进的代码格式化工具中

```javascript
// 缩进指定数量的空格
var indent = " ".repeat(4),
indentLevel = 0;
// 需要增加缩进时
var newIndent = indent.repeat(++indentLevel);
```

　　调用第一个repeat()方法创建了一个包含四个空格的字符串，indentLevel变量用来持续追踪缩进的级别。此后，可以通过增加indentLevel的值来调用repeat() 方法，从而改变空格数量

 

### 字符串补全

　　ES2017 引入了字符串补全长度的功能。如果某个字符串不够指定长度，会在头部或尾部补全

【padStart()】

　　头部补全

【padEnd()】

　　尾部补全

`padStart()`和`padEnd()`一共接受两个参数，第一个参数用来指定字符串的最小长度，第二个参数是用来补全的字符串

```javascript
'x'.padStart(5, 'ab') // 'ababx'
'x'.padStart(4, 'ab') // 'abax'

'x'.padEnd(5, 'ab') // 'xabab'
'x'.padEnd(4, 'ab') // 'xaba'
```

　　如果省略第二个参数，默认使用空格补全长度

```javascript
'x'.padStart(4) // '   x'
'x'.padEnd(4) // 'x   '
```

　　如果原字符串的长度，等于或大于指定的最小长度，则返回原字符串

```javascript
'xxx'.padStart(2, 'ab') // 'xxx'
'xxx'.padEnd(2, 'ab') // 'xxx'
```

　　如果用来补全的字符串与原字符串，两者的长度之和超过了指定的最小长度，则会截去超出位数的补全字符串

```javascript
'abc'.padStart(10, '0123456789')// '0123456abc'
```

【应用】

　　`padStart`的常见用途是为数值补全指定位数。下面代码生成10位的数值字符串

```javascript
'1'.padStart(10, '0') // "0000000001"
'12'.padStart(10, '0') // "0000000012"
'123456'.padStart(10, '0') // "0000123456"
```

　　另一个用途是提示字符串格式

```javascript
'12'.padStart(10, 'YYYY-MM-DD') // "YYYY-MM-12"
'09-12'.padStart(10, 'YYYY-MM-DD') // "YYYY-09-12"
```


## ES6-模板字面量

　　JS 的字符串相对其他语言来说功能总是有限的，事实上，ES5中一直缺乏许多特性，如多行字符串、字符串格式化、HTML转义等。ES6通过模板字面量的方式进行了填补，模板字面量试着跳出JS已有的字符串体系，通过一些全新的方法来解决类似的问题。本文将详细介绍ES6模板字面量

 

### 基本用法

　　模板字面量是增强版的字符串，它用反引号（`）标识

```javascript
let message = `Hello world!`;
console.log(message); // "Hello world!"
console.log(typeof message); // "string"
console.log(message.length); // 12
```

　　 以上代码中，使用模板字面量语法创建一个字符串，并赋值给message变量，这时变量的值与一个普通的字符串无异

　　如果想在字符串中包含反引号，只需使用反斜杠（ \ ）转义即可

```javascript
let message = `\`Hello\` world!`;
console.log(message); // "`Hello` world!"
console.log(typeof message); // "string"
console.log(message.length); // 14
```

 

### 多行字符串

　　自javascript诞生起，开发者们就一直在寻找一种能创建多行字符串的方法。如果使用双引号或单引号，字符串一定要在同一行才行

【反斜杠】

　　由于javascript长期以来一直存在一个语法bug，在换行之前的反斜线（ \ ）可以承接下一行的代码，于是可以利用这个bug来创建多行字符串

```javascript
var message = "Multiline \
string";
console.log(message); // "Multiline string"
```

　　message 字符串打印输出时不会有换行，因为反斜线被视为延续符号而不是新行的符号。为了在输出中显示换行，需要手动加入换行符

```javascript
var message = "Multiline \n\
string";
// "Multiline 
// string"
console.log(message); 
```

　　在所有主流的 JS 引擎中，此代码都会输出两行，但是该行为被认定为一个 bug ，并且许多开发者都建议应避免这么做

　　在ES6之前，通常都依靠数组或字符串的拼接来创建多行字符串

```javascript
var message = ["Multiline ","string"].join("\n");
let message = "Multiline \n" +"string";
```

　　JS一直以来都不支持多行字符串，开发者的种种解决方法都不够完美

【反引号】

　　ES6 的模板字面量使多行字符串更易创建，因为它不需要特殊的语法，只需在想要的位置直接换行即可，此处的换行会同步出现在结果中

```javascript
let message = `Multiline
string`;
// "Multiline
// string"
console.log(message); 
console.log(message.length); // 16
```

　　在反引号之内的所有空白符都是字符串的一部分，因此需要特别留意缩进

```javascript
let message = `Multiline
                             string`;
// "Multiline
                            // string"
console.log(message); 
console.log(message.length); //24
```

　　以上代码中，模板字面量第二行前面的所有空白符都被视为字符串自身的一部分

　　如果一定要通过适当的缩进来对齐文本，可以考虑在多行模板字面量的第一行空置并在后面的几行缩进

```javascript
let html = `
<div>
    <h1>Title</h1>
</div>`.trim();
```

　　以上代码中，模板字面量的第一行没有任何文本，第二行才有内容。 HTML标签的缩进增强了可读性，之后再调用trim()方法移除了起始的空行

　　当然，也可以在模板字面量中使用 \n 来指示换行的插入位置

```javascript
let message = `Multiline\nstring`;
// "Multiline
// string" 
console.log(message); 
console.log(message.length); // 16
```

 

### 变量占位符

　　模板字面量看上去仅仅是普通JS字符串的升级版，但二者之间真正的区别在于模板字面量的变量占位符。变量占位符允许将任何有效的JS表达式嵌入到模板字面量中，并将其结果输出为字符串的一部分

　　变量占位符由起始的 ${ 与结束的 } 来界定，之间允许放入任意的 JS 表达式。最简单的变量占位符允许将本地变量直接嵌入到结果字符串中

```javascript
let name = "Nicholas",
message = `Hello, ${name}.`;
console.log(message); // "Hello, Nicholas."
```

　　占位符 ${name} 会访问本地变量 name ，并将其值插入到 message 字符串中。 message变量会立即保留该占位符的结果

　　既然占位符是JS表达式，那么可替换的就不仅仅是简单的变量名。可以轻易嵌入运算符、函数调用等

```javascript
let count = 10,
price = 0.25,
message = `${count} items cost $${(count * price).toFixed(2)}.`;
console.log(message); // "10 items cost $2.50."
function fn() {
  return "Hello World";
}

`foo ${fn()} bar`
// foo Hello World bar
```

　　模板字面量本身也是 JS 表达式，因此可以将模板字面量嵌入到另一个模板字面量内部

```javascript
let name = "Nicholas",
    message = `Hello, ${
        `my name is ${ name }`
    }.`;
console.log(message); // "Hello, my name is Nicholas."
```

 

### 标签模板

　　模板字面量真正的威力来自于标签模板，每个模板标签都可以执行模板字面量上的转换并返回最终的字符串值。标签指的是在模板字面量第一个反引号'`'前方标注的字符串

```javascript
let message = tag`Hello world`;
```

　　在这个示例中， tag 就是应用到 `Hello world` 模板字面量上的模板标签

【定义标签】

　　标签可以是一个函数，调用时传入加工过的模板字面量各部分数据，但必须结合每个部分来创建结果。第一个参数是一个数组，包含Javascript解释过后的字面量字符串，它之后的所有参数都是每一个占位符的解释值

　　标签函数通常使用不定参数特性来定义占位符，从而简化数据处理的过程

```javascript
function tag(literals, ...substitutions) {
  // 返回一个字符串
}
```

　　为了进一步理解传递给tag函数的参数，查看以下代码

```javascript
let count = 10,
price = 0.25,
message = passthru`${count} items cost $${(count * price).toFixed(2)}.`;
```

　　如果有一个名为passthru()的函数，那么作为一个模板字面量标签，它会接受3个参数首先是一个literals数组，包含以下元素

　　1、第一个占位符前的空字符串("")

　　2、第一、二个占位符之间的字符串(" items cost $")

　　3、第二个占位符后的字符串(".")

　　下一个参数是变量count的解释值，传参为10，它也成为了substitutions数组里的第一个元素

　　最后一个参数是(count*price).toFixed(2)的解释值，传参为2.50，它是substitutions数组里的第二个元素

　　[注意]literals里的第一个元素是一个空字符串，这确保了literals[0]总是字符串的始端，就像literals[literals.length-1]总是字符串的结尾一样。substitutions的数量总比literals少一个，这也意味着表达式substitutions. Iength === literals. Iength-1的结果总为true

```javascript
var a = 5;
var b = 10;

tag`Hello ${ a + b } world ${ a * b }`;
// 等同于
tag(['Hello ', ' world ', ''], 15, 50);
```

　　通过这种模式，我们可以将literals和substitutions两个数组交织在一起重组结果字符串。先取出literals中的首个元素，再取出substitution中的首个元素，然后交替继续取出每一个元素，直到字符串拼接完成。于是可以通过从两个数组中交替取值的方式模拟模板字面量的默认行为

```javascript
function passthru(literals, ...substitutions) {
    let result = "";
    // 仅使用 substitution 的元素数量来进行循环
    for (let i = 0; i < substitutions.length; i++) {
        result += literals[i];
        result += substitutions[i];
    }
    // 添加最后一个字面量
    result += literals[literals.length - 1];
    return result;
}
let count = 10,
price = 0.25,
message = passthru`${count} items cost $${(count * price).toFixed(2)}.`;
console.log(message); // "10 items cost $2.50."
```

　　这个示例定义了一个passthru标签，模拟模板字面量的默认行为，展示了一次转换过程。此处的小窍门是使用substitutions.length来为循环计数

【应用】

　　“标签模板”的一个重要应用，就是过滤HTML字符串，防止用户输入恶意内容

```javascript
var message =
  SaferHTML`<p>${sender} has sent you a message.</p>`;
function SaferHTML(templateData) {
  var s = templateData[0];
  for (var i = 1; i < arguments.length; i++) {
    var arg = String(arguments[i]);
    // Escape special characters in the substitution.
    s += arg.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    // Don't escape special characters in the template.
    s += templateData[i];
  }
  return s;
}
```

　　上面代码中，`sender`变量往往是用户提供的，经过`SaferHTML`函数处理，里面的特殊字符都会被转义

```
var sender = '<script>alert("abc")</script>'; // 恶意代码
var message = SaferHTML`<p>${sender} has sent you a message.</p>`;

console.log(message);// <p>&lt;script&gt;alert("abc")&lt;/script&gt; has sent you a message.</p>
```

　　标签模板的另一个应用，就是多语言转换（国际化处理）

```javascript
i18n`Welcome to ${siteName}, you are visitor number ${visitorNumber}!`
// "欢迎访问xxx，您是第xxxx位访问者！"
```

　　模板字符串本身并不能取代模板引擎，因为没有条件判断和循环处理功能，但是通过标签函数，可以自己添加这些功能

```javascript
// 下面的hashTemplate函数
// 是一个自定义的模板处理函数
var libraryHtml = hashTemplate`
  <ul>
    #for book in ${myBooks}
      <li><i>#{book.title}</i> by #{book.author}</li>
    #end
  </ul>
`;
```

 

### raw()

　　`String.raw`方法，往往用来充当模板字面量的处理函数，返回一个斜杠都被转义（即斜杠前面再加一个斜杠）的字符串，对应于替换变量后的模板字面量

```javascript
let message1 = `Multiline\nstring`,
message2 = String.raw`Multiline\nstring`;
console.log(message1); // "Multiline
// string"
console.log(message2); // "Multiline\\nstring"
String.raw`Hi\n${2+3}!`;
// "Hi\\n5!"

String.raw`Hi\u000A!`;
// 'Hi\\u000A!'
```

　　如果原字符串的斜杠已经转义，那么`String.raw`不会做任何处理

```javascript
String.raw`Hi\\n`// "Hi\\n"
```

`String.raw`方法可以作为处理模板字面量的基本方法，它会将所有变量替换，而且对斜杠进行转义，方便下一步作为字符串来使用。

`String.raw`方法也可以作为正常的函数使用。这时，它的第一个参数，应该是一个具有`raw`属性的对象，且`raw`属性的值应该是一个数组

```javascript
String.raw({ raw: 'test' }, 0, 1, 2);// 't0e1s2t'
// 等同于
String.raw({ raw: ['t','e','s','t'] }, 0, 1, 2);
```



## ES6-函数扩展

　　函数是所有编程语言的重要组成部分，在ES6出现前，JS的函数语法一直没有太大的变化，从而遗留了很多问题，导致实现一些基本的功能经常要编写很多代码。ES6大力度地更新了函数特性，在ES5的基础上进行了许多改进，使用JS编程可以更少出错，同时也更加灵活。本文将详细介绍ES6函数扩展

 

### 形参默认值

　　Javascript函数有一个特别的地方，无论在函数定义中声明了多少形参，都可以传入任意数量的参数，也可以在定义函数时添加针对参数数量的处理逻辑，当已定义的形参无对应的传入参数时为其指定一个默认值

【ES5模拟】

　　在ES5中，一般地，通过下列方式创建函数并为参数设置默认值

```javascript
function makeRequest(url, timeout, callback) {
    timeout = timeout || 2000;
    callback = callback || function() {};
    // 函数的剩余部分
}
```

　　在这个示例中，timeout和callback为可选参数，如果不传入相应的参数系统会给它们赋予一个默认值。在含有逻辑或操作符的表达式中，前一个操作数的值为false时，总会返回后一个值。对于函数的命名参数，如果不显式传值，则其值默认为undefined

　　因此我们经常使用逻辑或操作符来为缺失的参数提供默认值

　　然而这个方法也有缺陷，如果我们想给makeRequest函数的第二个形参timeout传入值0，即使这个值是合法的，也会被视为一个false值，并最终将timeout赋值为2000

　　在这种情况下，更安全的选择是通过typeof检查参数类型，如下所示

```javascript
function makeRequest(url, timeout, callback) {
    timeout = (typeof timeout !== "undefined") ? timeout : 2000;
    callback = (typeof callback !== "undefined") ? callback : function() {};
    // 函数的剩余部分
}
```

　　虽然这种方法更安全，但依然为实现一个基本需求而书写了额外的代码。它代表了一种常见的模式，而流行的 JS 库中都充斥着类似的模式进行默认补全

【ES6默认参数】

　　ES6简化了为形参提供默认值的过程，如果没为参数传入值则为其提供一个初始值

```javascript
function makeRequest(url, timeout = 2000, callback = function() {}) {
    // 函数的剩余部分
}
```

　　在这个函数中，只有第一个参数被认为总是要为其传入值的，其他两个参数都有默认值，而且不需要添加任何校验值是否缺失的代码，所以函数代码比较简洁

　　如果调用make Request()方法时传入3个参数，则不使用默认值

```javascript
// 使用默认的 timeout 与 callback
makeRequest("/foo");
// 使用默认的 callback
makeRequest("/foo", 500);
// 不使用默认值
makeRequest("/foo", 500, function(body) {
    doSomething(body);
});
```

【触发默认值】

　　声明函数时，可以为任意参数指定默认值，在已指定默认值的参数后可以继续声明无默认值参数

```javascript
function makeRequest(url, timeout = 2000, callback) {
    console.log(url);
    console.log(timeout);
    console.log(callback);
}
```

　　在这种情况下，只有当不为第二个参数传入值或主动为第二个参数传入undefined时才会使用timeout的默认值

　　[注意]如果传入`undefined`，将触发该参数等于默认值，`null`则没有这个效果

```javascript
function makeRequest(url, timeout = 2000, callback) {
    console.log(timeout);
}
makeRequest("/foo");//2000
makeRequest("/foo", undefined);//2000
makeRequest("/foo", null);//null
makeRequest("/foo", 100);//100
```

　　上面代码中，timeout参数对应`undefined`，结果触发了默认值，`y`参数等于`null`，就没有触发默认值

　　使用参数默认值时，函数不能有同名参数

```javascript
// SyntaxError: Duplicate parameter name not allowed in this context
function foo(x, x, y = 1) {
  // ...
}
```

　　另外，一个容易忽略的地方是，参数默认值不是传值的，而是每次都重新计算默认值表达式的值。也就是说，参数默认值是惰性求值的

```javascript
let x = 99;
function foo(p = x + 1) {
  console.log(p);
}
foo() // 100
x = 100;
foo() // 101
```

　　上面代码中，参数`p`的默认值是`x+1`。这时，每次调用函数`foo`，都会重新计算`x+1`，而不是默认`p`等于100

【length属性】

　　指定了默认值以后，函数的`length`属性，将返回没有指定默认值的参数个数。也就是说，指定了默认值后，`length`属性将失真

```javascript
(function (a) {}).length // 1
(function (a = 5) {}).length // 0
(function (a, b, c = 5) {}).length // 2
```

　　这是因为`length`属性的含义是，该函数预期传入的参数个数。某个参数指定默认值以后，预期传入的参数个数就不包括这个参数了。同理，rest 参数也不会计入`length`属性

```javascript
(function(...args) {}).length // 0
```

　　如果设置了默认值的参数不是尾参数，那么`length`属性也不再计入后面的参数了

```javascript
(function (a = 0, b, c) {}).length // 0
(function (a, b = 1, c) {}).length // 1
```

【arguments】

　　当使用默认参数值时，arguments对象的行为与以往不同。在ES5非严格模式下，函数命名参数的变化会体现在arguments对象中

```javascript
function mixArgs(first, second) {
    console.log(first === arguments[0]);//true
    console.log(second === arguments[1]);//true
    first = "c";
    second = "d";
    console.log(first === arguments[0]);//true
    console.log(second === arguments[1]);//true
}
mixArgs("a", "b");
```

　　在非严格模式下，命名参数的变化会同步更新到arguments对象中，所以当first和second被赋予新值时，arguments[0]和arguments[1]相应更新，最终所有===全等比较的结果为true　　

　　然而，在ES5的严格模式下，取消了arguments对象的这个令人感到困惑的行为，无论参数如何变化，arguments对象不再随之改变

```javascript
function mixArgs(first, second) {
    "use strict";
    console.log(first === arguments[0]);//true
    console.log(second === arguments[1]);//true
    first = "c";
    second = "d"
    console.log(first === arguments[0]);//false
    console.log(second === arguments[1]);//false
}
mixArgs("a", "b");
```

　　这一次更改 first 与 second 就不会再影响 arguments 对象，因此输出结果符合通常的期望

　　在ES6中，如果一个函数使用了默认参数值，则无论是否显式定义了严格模式，arguments对象的行为都将与ES5严格模式下保持一致。默认参数值的存在使得arguments对象保持与命名参数分离，这个微妙的细节将影响使用arguments对象的方式

```javascript
// 非严格模式
function mixArgs(first, second = "b") {
    console.log(first);//a
    console.log(second);//b
    console.log(arguments.length);//1
    console.log(arguments[0]);//a
    console.log(arguments[1]);//undefined
    first = 'aa';
    arguments[1] = 'b';
    console.log(first);//aa
    console.log(second);//b
    console.log(arguments.length);//1
    console.log(arguments[0]);//a
    console.log(arguments[1]);//b
}
mixArgs("a");
```

　　在这个示例中，只给mixArgs()方法传入一个参数，arguments. Iength 的值为 1, arguments[1] 的值为 undefined, first与arguments[0]全等，改变first和second并不会影响arguments对象

【默认参数表达式】

　　关于默认参数值，最有趣的特性可能是非原始值传参了。可以通过函数执行来得到默认参数的值

```javascript
function getValue() {
    return 5;
}
function add(first, second = getValue()) {
    return first + second;
}
console.log(add(1, 1)); // 2
console.log(add(1)); // 6
```

　　在这段代码中，如果不传入最后一个参数，就会调用getvalue()函数来得到正确的默认值。切记，初次解析函数声明时不会调用getvalue()方法，只有当调用add()函数且不传入第二个参数时才会调用

```javascript
let value = 5;
function getValue() {
    return value++;
}
function add(first, second = getValue()) {
    return first + second;
}
console.log(add(1, 1)); // 2
console.log(add(1)); // 6
console.log(add(1)); // 7
```

　　在此示例中，变量value的初始值为5，每次调用getvalue()时加1。第一次调用add(1)返回6，第二次调用add(1)返回7，因为变量value已经被加了1。因为只要调用add()函数就有可能求second的默认值，所以任何时候都可以改变那个值

　　正因为默认参数是在函数调用时求值，所以可以使用先定义的参数作为后定义参数的默认值

```javascript
function add(first, second = first) {
    return first + second;
}
console.log(add(1, 1)); // 2
console.log(add(1)); // 2
```

　　在上面这段代码中，参数second的默认值为参数first的值，如果只传入一个参数，则两个参数的值相同，从而add(1,1)返回2，add(1)也返回2

```javascript
function getValue(value) {
    return value + 5;
}
function add(first, second = getValue(first)) {
    return first + second;
}
console.log(add(1, 1)); // 2
console.log(add(1)); // 7
```

　　在上面这个示例中，声明second=getvalue(first)，所以尽管add(1,1)仍然返回2，但是add(1)返回的是(1+6)也就是7

　　在引用参数默认值的时候，只允许引用前面参数的值，即先定义的参数不能访问后定义的参数

```javascript
function add(first = second, second) {
    return first + second;
}
console.log(add(1, 1)); // 2
console.log(add(undefined, 1)); // 抛出错误
```

　　调用add(undefined,1)会抛出错误，因为second比first晚定义，因此其不能作为first的默认值

【临时死区】

　　在介绍[块级作用域](http://www.cnblogs.com/xiaohuochai/p/7226375.html)时提到过[临时死区TDZ](http://www.cnblogs.com/xiaohuochai/p/7226375.html#anchor4)，其实默认参数也有同样的临时死区，在这里的参数不可访问。与let声明类似，定义参数时会为每个参数创建一个新的标识符绑定，该绑定在初始化之前不可被引用，如果试图访问会导致程序抛出错误。当调用函数时，会通过传入的值或参数的默认值初始化该参数

```javascript
function getValue(value) {
    return value + 5;
}
function add(first, second = getValue(first)) {
    return first + second;
}
console.log(add(1, 1)); // 2
console.log(add(1)); // 7
```

　　调用add(1,1)和add(1)时实际上相当于执行以下代码来创建first和second参数值

```javascript
// JS 调用 add(1, 1) 可表示为
let first = 1;
let second = 1;
// JS 调用 add(1) 可表示为
let first = 1;
let second = getValue(first);
```

　　当初次执行函数add()时，first和second被添加到一个专属于函数参数的临时死区(与let的行为类似)。由于初始化second时first已经被初始化，所以它可以访问first的值，但是反过来就错了

```javascript
function add(first = second, second) {
    return first + second;
}
console.log(add(1, 1)); // 2
console.log(add(undefined, 1)); // 抛出错误
```

　　在这个示例中，调用add(1,1)和add(undefined,1)相当于在引擎的背后做了如下事情

```javascript
// JS 调用 add(1, 1) 可表示为
let first = 1;
let second = 1;
// JS 调用 add(1) 可表示为
let first = second;
let second = 1;
```

　　在这个示例中，调用add(undefined,1)函数，因为当first初始化时second尚未初始化，所以会导致程序抛出错误，此时second尚处于临时死区中，所有引用临时死区中绑定的行为都会报错

【形参与自由变量】

　　下列代码中，y是形参，需要考虑临时死区的问题；而x是自由变量，不需要考虑。所以调用函数时，由于未传入参数，执行y=x，x是自由变量，通过作用域链，在全局作用域找到x=1，并赋值给y，于是y取值1

```javascript
let x = 1;
function f(y = x) {}
f() // 1
```

　　下列代码中，x和y是形参，需要考虑临时死区的问题。因为没有自由变量，所以不考虑作用域链寻值的问题。调用函数时，由于未传入参数，执行y=x，由于x正处于临时死区内，所有引用临时死区中绑定的行为都会报错

```javascript
let x = 1;
function f(y = x,x) {}
f()// ReferenceError: x is not defined
```

　　类似地，下列代码也报错

```javascript
let x = 1;
function foo(x = x) {}
foo() // ReferenceError: x is not defined
```

 

### 不定参数

　　无论函数已定义的命名参数有多少，都不限制调用时传入的实际参数数量，调用时总是可以传入任意数量的参数。当传入更少数量的参数时，默认参数值的特性可以有效简化函数声明的代码；当传入更多数量的参数时，ES6同样也提供了更好的方案。

【ES5】

 　早先，Javascript提供arguments对象来检查函数的所有参数，从而不必定义每一个要用的参数。尽管arguments对象检査在大多数情况下运行良好，但是实际使用起来却有些笨重

```javascript
function pick(object) {
    let result = Object.create(null);
    // 从第二个参数开始处理
    for (let i = 1, len = arguments.length; i < len; i++) {
        result[arguments[i]] = object[arguments[i]];
    }
    return result;
}
let book = {
    title: "ES6",
    author: "huochai",
    year: 2017
};
let bookData = pick(book, "author", "year");
console.log(bookData.author); // "huochai"
console.log(bookData.year); // 2017
```

　　这个函数模仿了Underscore.js库中的pick()方法，返回一个给定对象的副本，包含原始对象属性的特定子集。在这个示例中只定义了一个参数，第一个参数传入的是被复制属性的源对象，其他参数为被复制属性的名称

　　关于pick()函数应该注意这样几件事情：首先，并不容易发现这个函数可以接受任意数量的参数，当然，可以定义更多的参数，但是怎么也达不到要求；其次，因为第一个参数为命名参数且已被使用，要查找需要拷贝的属性名称时，不得不从索引1而不是索引0开始遍历arguments对象

【ES6】

　　在ES6中，通过引入不定参数(rest parameters)的特性可以解决这些问题，不定参数也称为剩余参数或rest参数

　　在函数的命名参数前添加三个点(...)就表明这是一个不定参数，该参数为一个数组，包含着自它之后传入的所有参数，通过这个数组名即可逐一访问里面的参数

```javascript
function pick(object, ...keys) {
    let result = Object.create(null);
    for (let i = 0, len = keys.length; i < len; i++) {
        result[keys[i]] = object[keys[i]];
    }
    return result;
}
```

　　在这个函数中，不定参数keys包含的是object之后传入的所有参数，而arguments对象包含的则是所有传入的参数，包括object。这样一来，就可以放心地遍历keys对象了。这种方法还有另一个好处，只需看一眼函数就可以知道该函数可以处理的参数数量

【使用限制】

　　不定参数有两条使用限制

　　1、每个函数最多只能声明一个不定参数，而且一定要放在所有参数的末尾

```javascript
// 语法错误：不能在剩余参数后使用具名参数
function pick(object, ...keys, last) {
    let result = Object.create(null);
    for (let i = 0, len = keys.length; i < len; i++) {
        result[keys[i]] = object[keys[i]];
    }
    return result;
}
```

　　2、不定参数不能在对象字面量的 setter 属性中使用

```javascript
let object = {
    // 语法错误：不能在 setter 中使用剩余参数
    set name(...value) {
        // 一些操作
    }
};
```

　　之所以存在这条限制，是因为对象字面量setter的参数有且只能有一个。而在不定参数的定义中，参数的数量可以无限多，所以在当前上下文中不允许使用不定参数

【arguments】

　　不定参数的设计初衷是代替JS的arguments对象。起初，在ES4草案中，arguments对象被移除并添加了不定参数的特性，从而可以传入不限数量的参数。但是ES4从未被标准化，这个想法被搁置下来，直到重新引入了ES6标准，唯一的区别是arguments对象依然存在

```javascript
function checkArgs(n,...args) {
    console.log(args.length);//2
    console.log(arguments.length);//3
    console.log(args);//['b','c']
    console.log(arguments);//['a','b','c']
}
checkArgs("a", "b", "c");
```

【应用】

　　不定参数中的变量代表一个数组，所以数组特有的方法都可以用于这个变量

```javascript
// arguments变量的写法
function sortNumbers() {
  return Array.prototype.slice.call(arguments).sort();
}

// 不定参数的写法
const sortNumbers = (...numbers) => numbers.sort();
```

　　上面代码的两种写法，比较后可以发现，不定参数的写法更自然也更简洁

 

### 展开运算符

　　在所有的新功能中，与不定参数最相似的是展开运算符。不定参数可以指定多个各自独立的参数，并通过整合后的数组来访问；而展开运算符可以指定一个数组，将它们打散后作为各自独立的参数传入函数。JS内建的Math.max()方法可以接受任意数量的参数并返回值最大的那一个

```javascript
let value1 = 25,
value2 = 50;
console.log(Math.max(value1, value2)); // 50
```

　　如上例所示，如果只处理两个值，那么Math.max()非常简单易用。传入两个值后返回更大的那一个。但是如果想从一个数组中挑选出最大的那个值应该怎么做呢?Math.max()方法不允许传入数组，所以在ES5中，可能需要手动实现从数组中遍历取值，或者使用apply()方法

```javascript
let values = [25, 50, 75, 100]
console.log(Math.max.apply(Math, values)); // 100
```

　　这个解决方案确实可行，但却让人很难看懂代码的真正意图

　　使用ES6中的展开运算符可以简化上述示例，向Math.max()方法传入一个数组，再在数组前添加不定参数中使用的...符号，就无须再调用apply()方法了。JS引擎读取这段程序后会将参数数组分割为各自独立的参数并依次传入

```javascript
let values = [25, 50, 75, 100]
// 等价于 console.log(Math.max(25, 50, 75, 100));
console.log(Math.max(...values)); // 100
```

　　使用apply()方法需要手动指定this的绑定，如果使用展开运算符可以使这种简单的数学运算看起来更加简洁

　　可以将展开运算符与其他正常传入的参数混合使用。假设限定Math.max()返回的最小值为0，可以单独传入限定值，其他的参数仍然使用展开运算符得到

```javascript
let values = [-25, -50, -75, -100]
console.log(Math.max(...values, 0)); // 0
```

　　在这个示例中，Math.max()函数先用展开运算符传入数组中的值，又传入了参数0

　　展开运算符可以简化使用数组给函数传参的编码过程，在大多数使用apply()方法的情况下展开运算符可能是一个更合适的方案

 

### 严格模式

　　从 ES5 开始，函数内部可以设定为严格模式

```javascript
function doSomething(a, b) {
  'use strict';
  // code
}
```

　　ES7做了一点修改，规定只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错

```javascript
// 报错
function doSomething(a, b = a) {
  'use strict';
  // code
}

// 报错
const doSomething = function ({a, b}) {
  'use strict';
  // code
};

// 报错
const doSomething = (...a) => {
  'use strict';
  // code
};

const obj = {
  // 报错
  doSomething({a, b}) {
    'use strict';
    // code
  }
};
```

　　这样规定的原因是，函数内部的严格模式，同时适用于函数体和函数参数。但是，函数执行的时候，先执行函数参数，然后再执行函数体。这样就有一个不合理的地方，只有从函数体之中，才能知道参数是否应该以严格模式执行，但是参数却应该先于函数体执行

```javascript
// 报错
function doSomething(value = 070) {
  'use strict';
  return value;
}
```

　　上面代码中，参数`value`的默认值是八进制数`070`，但是严格模式下不能用前缀`0`表示八进制，所以应该报错。但是实际上，JS引擎会先成功执行`value = 070`，然后进入函数体内部，发现需要用严格模式执行，这时才会报错

　　虽然可以先解析函数体代码，再执行参数代码，但是这样无疑就增加了复杂性。因此，标准索性禁止了这种用法，只要参数使用了默认值、解构赋值、或者扩展运算符，就不能显式指定严格模式。

　　两种方法可以规避这种限制：

　　1、设定全局性的严格模式

```javascript
'use strict';
function doSomething(a, b = a) {
  // code
}
```

　　2、把函数包在一个无参数的立即执行函数里面

```javascript
const doSomething = (function () {
  'use strict';
  return function(value = 42) {
    return value;
  };
}());
```

 

### 构造函数

　　Function构造函数是JS语法中很少被用到的一部分，通常我们用它来动态创建新的函数。这种构造函数接受字符串形式的参数，分别为函数参数及函数体

```javascript
var add = new Function("first", "second", "return first + second");
console.log(add(1, 1)); // 2
```

　　ES6增强了Function构造函数的功能，支持在创建函数时定义默认参数和不定参数。唯一需要做的是在参数名后添加一个等号及一个默认值

```javascript
var add = new Function("first", "second = first","return first + second");
console.log(add(1, 1)); // 2
console.log(add(1)); // 2
```

　　在这个示例中，调用add(1)时只传入一个参数，参数second被赋值为first的值。这种语法与不使用Function声明函数很像

　　定义不定参数，只需在最后一个参数前添加...

```javascript
var pickFirst = new Function("...args", "return args[0]");
console.log(pickFirst(1, 2)); // 1
```

　　在这段创建函数的代码中，只定义了一个不定参数，函数返回传入的第一个参数。对于Function构造函数，新增的默认参数和不定参数这两个特性使其具备了与声明式创建函数相同的能力

 

### 参数尾逗号

　　ES8允许函数的最后一个参数有尾逗号（trailing comma）。

　　此前，函数定义和调用时，都不允许最后一个参数后面出现逗号

```javascript
function clownsEverywhere(
  param1,
  param2
) { /* ... */ }

clownsEverywhere(
  'foo',
  'bar'
);
```

　　上面代码中，如果在`param2`或`bar`后面加一个逗号，就会报错。

　　如果像上面这样，将参数写成多行（即每个参数占据一行），以后修改代码的时候，想为函数`clownsEverywhere`添加第三个参数，或者调整参数的次序，就势必要在原来最后一个参数后面添加一个逗号。这对于版本管理系统来说，就会显示添加逗号的那一行也发生了变动。这看上去有点冗余，因此新的语法允许定义和调用时，尾部直接有一个逗号

```javascript
function clownsEverywhere(
  param1,
  param2,
) { /* ... */ }

clownsEverywhere(
  'foo',
  'bar',
);
```

　　这样的规定使得函数参数与数组和对象的尾逗号规则保持一致了

 

### name属性

　　由于在JS中有多种定义函数的方式，因而辨别函数就是一项具有挑战性的任务。此外，匿名函数表达式的广泛使用更是加大了调试的难度，开发者们经常要追踪难以解读的栈记录。为了解决这些问题，ES6为所有函数新增了name属性

　　ES6中所有的函数的name属性都有一个合适的值 

```javascript
function doSomething() {
    // ...
}
var doAnotherThing = function() {
    // ...
};
console.log(doSomething.name); // "doSomething"
console.log(doAnotherThing.name); // "doAnotherThing"
```

　　在这段代码中，dosomething()函数的name属性值为"dosomething"，对应着声明时的函数名称；匿名函数表达式doAnotherThing()的name属性值为"doAnotherThing"，对应着被赋值为该匿名函数的变量的名称

【特殊情况】

　　尽管确定函数声明和函数表达式的名称很容易，ES6还是做了更多的改进来确保所有函数都有合适的名称

```javascript
var doSomething = function doSomethingElse() {
    // ...
};
var person = {
    get firstName() {
        return "huochai"
    },
    sayName: function() {
        console.log(this.name);
    }
}
console.log(doSomething.name); // "doSomethingElse"
console.log(person.sayName.name); // "sayName"
var descriptor = Object.getOwnPropertyDescriptor(person, "firstName");
console.log(descriptor.get.name); // "get firstName"
```

　　在这个示例中，dosomething.name的值为"dosomethingElse"，是由于函数表达式有一个名字，这个名字比函数本身被赋值的变量的权重高

　　person.sayName()的name属性的值为"sayName"，因为其值取自对象字面量。与之类似，person.firstName实际上是一个getter函数，所以它的名称为"get firstName"，setter函数的名称中当然也有前缀"set"

　　还有另外两个有关函数名称的特例：通过bind()函数创建的函数，其名称将带有"bound"前缀；通过Function构造函数创建的函数，其名称将带有前缀"anonymous"

```javascript
var doSomething = function() {
    // ...
};
console.log(doSomething.bind().name); // "bound doSomething"
console.log((new Function()).name); // "anonymous"
```

　　绑定函数的name属性总是由被绑定函数的name属性及字符串前缀"bound"组成，所以绑定函数dosomething()的name属性值为"bound dosomething"

　　[注意]函数name属性的值不一定引用同名变量，它只是协助调试用的额外信息，所以不能使用name属性的值来获取对于函数的引用

 

### 判断调用

　　ES5中的函数结合new使用，函数内的this值将指向一个新对象，函数最终会返回这个新对象

```javascript
function Person(name) {
    this.name = name;
}
var person = new Person("huochai");
var notAPerson = Person("huochai");
console.log(person); // "[Object object]"
console.log(notAPerson); // "undefined"
```

　　给notAperson变量赋值时，没有通过new关键字来调用person()，最终返回undefined(如果在非严格模式下，还会在全局对象中设置一个name属性)。只有通过new关键字调用person()时才能体现其能力，就像常见的JS程序中显示的那样

　　而在ES6中，函数混乱的双重身份终于将有一些改变

　　JS函数有两个不同的内部方法：[[Call]]和[[Construct]]

　　当通过new关键字调用函数时，执行的是[[construct]]函数，它负责创建一个通常被称作实例的新对象，然后再执行函数体，将this绑定到实例上

　　如果不通过new关键字调用函数，则执行[[call]]函数，从而直接执行代码中的函数体

　　具有[[construct]]方法的函数被统称为构造函数

　　[注意]不是所有函数都有[[construct]]方法，因此不是所有函数都可以通过new来调用

【ES5判断函数被调用】

　　在ES5中，如果想确定一个函数是否通过new关键字被调用，或者说，判断该函数是否作为构造函数被调用，最常用的方式是使用instanceof操作符

```javascript
function Person(name) {
    if (this instanceof Person) {
        this.name = name; // 使用 new
    } else {
        throw new Error("You must use new with Person.")
    }
}
var person = new Person("huochai");
var notAPerson = Person("huochai"); // 抛出错误
```

　　在这段代码中，首先检查this的值，看它是否为构造函数的实例，如果是，则继续正常执行。如果不是，则抛出错误。由于[[construct]]方法会创建一个person的新实例，并将this绑定到新实例上，通常来讲这样做是正确的

　　但这个方法也不完全可靠，因为有一种不依赖new关键字的方法也可以将this绑定到person的实例上

```javascript
function Person(name) {
    if (this instanceof Person) {
        this.name = name; // 使用 new
    } else {
        throw new Error("You must use new with Person.")
    }
}
var person = new Person("huochai");
var notAPerson = Person.call(person, "huochai"); // 不报错
```

　　调用person.call()时将变量person传入作为第一个参数，相当于在person函数里将this设为了person实例。对于函数本身，无法区分是通过person.call()(或者是person.apply())还是new关键字调用得到的person的实例

【元属性new.target】

　　为了解决判断函数是否通过new关键字调用的问题，ES6引入了new.target这个元属性。元属性是指非对象的属性，其可以提供非对象目标的补充信息(例如new)。当调用函数的[[construct]]方法时，new.target被赋值为new操作符的目标，通常是新创建对象实例，也就是函数体内this的构造函数；如果调用[[call]]方法，则new.target的值为undefined

　　有了这个元属性，可以通过检查new.target是否被定义过，检测一个函数是否是通过new关键字调用的

```javascript
function Person(name) {
    if (typeof new.target !== "undefined") {
        this.name = name; // 使用 new
    } else {
        throw new Error("You must use new with Person.")
    }
}
var person = new Person("huochai");
var notAPerson = Person.call(person, "match"); // 出错！
```

　　也可以检查new.target是否被某个特定构造函数所调用

```javascript
function Person(name) {
    if (new.target === Person) {
        this.name = name; // 使用 new
    } else {
        throw new Error("You must use new with Person.")
    }
}
function AnotherPerson(name) {
    Person.call(this, name);
}
var person = new Person("huochai");
var anotherPerson = new AnotherPerson("huochai"); // 出错！
```

　　在这段代码中，如果要让程序正确运行，new.target一定是person。当调用 new Anotherperson("huochai") 时, 真正的调用Person. call(this,name)没有使用new关键字，因此new.target的值为undefined会抛出错误

　　[注意]在函数外使用new.target是一个语法错误

### 块级函数

　　在ES3中，在代码块中声明一个函数(即块级函数)严格来说应当是一个语法错误， 但所有的浏览器都支持该语法。不幸的是，每个浏览器对这个特性的支持都稍有不同，所以最好不要在代码块中声明函数，更好的选择是使用函数表达式

　　 为了遏制这种不兼容行为， ES5的严格模式为代码块内部的函数声明引入了一个错误

```javascript
"use strict";
if (true) {
    // 在 ES5 会抛出语法错误， ES6 则不会
    function doSomething() {
        // ...
    }
}
```

　　在ES5中，代码会抛出语法错误。而在ES6中，会将dosomething()函数视为一个块级声明，从而可以在定义该函数的代码块内访问和调用它

```javascript
"use strict";
if (true) {
    console.log(typeof doSomething); // "function"
    function doSomething() {
        // ...
    }
    doSomething();
}
console.log(typeof doSomething); // "undefined"
```

　　在定义函数的代码块内，块级函数会被提升至顶部，所以typeof dosomething的值为"function"，这也佐证了，即使在函数定义的位置前调用它，还是能返回正确结果。但是一旦if语句代码块结束执行，dosomething()函数将不再存在

【使用场景】

　　块级函数与let函数表达式类似，一旦执行过程流出了代码块，函数定义立即被移除。二者的区别是，在该代码块中，块级函数会被提升至块的顶部，而用let定义的函数表达式不会被提升

```javascript
"use strict";
if (true) {
    console.log(typeof doSomething); // 抛出错误
    let doSomething = function () {
        // ...
    }
    doSomething();
}
console.log(typeof doSomething);
```

　　在这段代码中，当执行到typeof dosomething时，由于此时尚未执行let声明语句，dosomething()还在当前块作用域的临时死区中，因此程序被迫中断执行

　　因此，如果需要函数提升至代码块顶部，则选择块级函数；如果不需要，则选择let表达式

【非严格模式】

　　在ES6中，即使处于非严格模式下，也可以声明块级函数，但其行为与严格模式下稍有不同。这些函数不再提升到代码块的顶部，而是提升到外围函数或全局作用域的顶部

```javascript
// ES6 behavior
if (true) {
    console.log(typeof doSomething); // "function"
    function doSomething() {
        // ...
    }
    doSomething();
}
console.log(typeof doSomething); // "function"
```

　　在这个示例中，dosomething()函数被提升至全局作用域，所以在if代码块外也可以访问到。ES6将这个行为标准化了，移除了之前存在于各浏览器间不兼容的行为，所以所有ES6的运行时环境都将执行这一标准

 

### 箭头函数

　　在ES6中，箭头函数是其中最有趣的新增特性。顾名思义，箭头函数是一种使用箭头(=>)定义函数的新语法，但是它与传统的JS函数有些许不同，主要集中在以下方面 

　　1、没有this、super、arguments和new.target

　　绑定箭头函数中的this、super、arguments和new.target这些值由外围最近一层非箭头函数决定

　　2、不能通过new关键字调用

　　箭头函数没有[[construct]]方法，不能被用作构造函数，如果通过new关键字调用箭头函数，程序抛出错误

　　3、没有原型

　　由于不可以通过new关键字调用箭头函数，因而没有构建原型的需求，所以箭头函数不存在prototype这个属性

　　4、不可以改变this绑定

　　函数内部的this值不可被改变，在函数的生命周期内始终保持一致

　　5、不支持arguments对象

　　箭头函数没有arguments绑定，必须通过命名参数和不定参数这两种形式访问函数的参数

　　6、不支持重复的命名参数

　　无论在严格还是非严格模式下，箭头函数都不支持重复的命名参数；而在传统函数的规定中，只有在严格模式下才不能有重复的命名参数

　　在箭头函数内，其余的差异主要是减少错误以及理清模糊不清的地方。这样一来，JS引擎就可以更好地优化箭头函数的执行过程

　　这些差异的产生有如下几个原因

　　1、最重要的是，this绑定是JS程序中一个常见的错误来源，在函数内很容易对this的值失去控制，其经常导致程序出现意想不到的行为，箭头函数消除了这方面的烦恼

　　2、如果限制箭头函数的this值，简化代码执行的过程，则JS引擎可以更轻松地优化这些操作，而常规函数往往同时会作为构造函数使用或者以其他方式对其进行修改

　　[注意]箭头函数同样也有一个name属性，这与其他函数的规则相同

【语法】

　　箭头函数的语法多变，根据实际的使用场景有多种形式。所有变种都由函数参数、箭头、函数体组成，根据使用的需求，参数和函数体可以分别采取多种不同的形式

```javascript
var reflect = value => value;
// 有效等价于：
var reflect = function(value) {
    return value;
};
```

　　当箭头函数只有一个参数时，可以直接写参数名，箭头紧随其后，箭头右侧的表达式被求值后便立即返回。即使没有显式的返回语句，这个箭头函数也可以返回传入的第一个参数

　　如果要传入两个或两个以上的参数，要在参数的两侧添加一对小括号

```javascript
var sum = (num1, num2) => num1 + num2;
// 有效等价于：
var sum = function(num1, num2) {
    return num1 + num2;
};
```

　　这里的sum()函数接受两个参数，将它们简单相加后返回最终结果，它与reflect()函数唯一的不同是，它的参数被包裹在小括号中，并且用逗号进行分隔(类似传统函数)

　　如果函数没有参数，也要在声明的时候写一组没有内容的小括号

```javascript
var getName = () => "huochai";
// 有效等价于：
var getName = function() {
    return "huochai";
};
```

　　如果希望为函数编写由多个表达式组成的更传统的函数体，那么需要用花括号包裹函数体，并显式地定义一个返回值

```javascript
var sum = (num1, num2) => {
    return num1 + num2;
};
// 有效等价于：
var sum = function(num1, num2) {
    return num1 + num2;
};
```

　　除了arguments对象不可用以外，某种程度上都可以将花括号里的代码视作传统的函数体定义

　　如果想创建一个空函数，需要写一对没有内容的花括号

```javascript
var doNothing = () => {};
// 有效等价于：
var doNothing = function() {};
```

　　花括号代表函数体的部分，但是如果想在箭头函数外返回一个对象字面量，则需要将该字面量包裹在小括号里

```javascript
var getTempItem = id => ({ id: id, name: "Temp" });
// 有效等价于：
var getTempItem = function(id) {
    return {
        id: id,
        name: "Temp"
    };
};
```

　　将对象字面量包裹在小括号中是为了将其与函数体区分开来

【IIFE】

　　JS函数的一个流行的使用方式是创建立即执行函数表达式(IIFE)，可以定义一个匿名函数并立即调用，自始至终不保存对该函数的引用。当创建一个与其他程序隔离的作用域时，这种模式非常方便

```javascript
let person = function(name) {
    return {
        getName: function() {
            return name;
        }
    };
}("huochai");
console.log(person.getName()); // "huochai"
```

　　在这段代码中，IIFE通过getName()方法创建了一个新对象，将参数name作为该对象的一个私有成员返回给函数的调用者

　　只要将箭头函数包裹在小括号里，就可以用它实现相同的功能

```javascript
let person = ((name) => {
    return {
        getName: function() {
            return name;
        }
    };
})("huochai");
console.log(person.getName()); // "huochai"
```

　　[注意]小括号只包裹箭头函数定义，没有包含("huochai")，这一点与正常函数有所不同，由正常函数定义的立即执行函数表达式既可以用小括号包裹函数体，也可以额外包裹函数调用的部分

【this】

　　函数内的this绑定是JS中最常出现错误的因素，函数内的this值可以根据函数调用的上下文而改变，这有可能错误地影响其他对象

```javascript
var PageHandler = {
    id: "123456",
    init: function() {
        document.addEventListener("click", function(event) {
            this.doSomething(event.type); // 错误
        }, false);
    },
    doSomething: function(type) {
        console.log("Handling " + type + " for " + this.id);
    }
};
```

　　在这段代码中，对象pageHandler的设计初衷是用来处理页面上的交互，通过调用init()方法设置交互，依次分配事件处理程序来调用this.dosomething()。然而，这段代码并没有如预期的正常运行

　　实际上，因为this绑定的是事件目标对象的引用(在这段代码中引用的是document)，而没有绑定pageHandler，且由于this.dosonething()在目标document中不存在，所以无法正常执行，尝试运行这段代码只会使程序在触发事件处理程序时抛出错误

　　可以使用bind()方法显式地将this绑定到pageHandler函数上来修正这个问题

```javascript
var PageHandler = {
    id: "123456",
    init: function() {
        document.addEventListener("click", (function(event) {
            this.doSomething(event.type); // 错误
        }).bind(this), false);
    },
    doSomething: function(type) {
        console.log("Handling " + type + " for " + this.id);
    }
};
```

　　现在代码如预期的运行，但可能看起来仍然有点奇怪。调用bind(this)后，事实上创建了一个新函数，它的this被绑定到当前的this，也就是page Handler

　　可以通过一个更好的方式来修正这段代码：使用箭头函数

　　箭头函数中没有this绑定，必须通过查找作用城链来决定其值。如果箭头函数被非箭头函数包含，则this绑定的是最近一层非箭头函数的this；否则，this的值会被设置为undefined

```javascript
var PageHandler = {
    id: "123456",
    init: function() {
        document.addEventListener("click",
            event => this.doSomething(event.type), false);
        },
    doSomething: function(type) {
        console.log("Handling " + type + " for " + this.id);
    }
};
```

　　这个示例中的事件处理程序是一个调用了this.doSomething()的箭头函数，此处的this与init()函数里的this一致，所以此版本代码的运行结果与使用bind(this)一致。虽然dosomething()方法不返回值，但是它仍是函数体内唯一的一条执行语句，所以不必用花括号将它包裹起来

　　箭头函数缺少正常函数所拥有的prototype属性，它的设计初衷是即用即弃，所以不能用它来定义新的类型。如果尝试通过new关键字调用一个箭头函数，会导致程序抛出错误

```javascript
var MyType = () => {},
object = new MyType(); // 错误：不能对箭头函数使用 'new'
```

　　在这段代码中，MyType是一个没有[[Construct]]方法的箭头函数，所以不能正常执行new MyType()。也正因为箭头函数不能与new关键字混用，所以JS引擎可以进一步优化它们的行为。同样，箭头函数中的this值取决于该函数外部非箭头函数的this值，且不能通过call()、apply()或bind()方法来改变this的值

【数组】 

　　箭头函数的语法简洁，非常适用于数组处理。如果想给数组排序，通常需要写一个自定义的比较器

```javascript
var result = values.sort(function(a, b) {
    return a - b;
});
```

　　只想实现一个简单功能，但这些代码实在太多了。用箭头函数简化如下

```javascript
var result = values.sort((a, b) => a - b);
```

　　诸如sort()、map()及reduce()这些可以接受回调函数的数组方法，都可以通过箭头函数语法简化编码过程并减少编码量

```javascript
// 正常函数写法
[1,2,3].map(function (x) {
  return x * x;
});

// 箭头函数写法
[1,2,3].map(x => x * x);
```

【arguments】

　　箭头函数没有自己的arguments对象，且未来无论函数在哪个上下文中执行，箭头函数始终可以访问外围函数的arguments对象

```javascript
function createArrowFunctionReturningFirstArg() {
    return () => arguments[0];
}
var arrowFunction = createArrowFunctionReturningFirstArg(5);
console.log(arrowFunction()); // 5
```

　　在createArrowFunctionReturningFirstArg()中，箭头函数引用了外围函数传入的第一个参数arguments[0]，也就是后续执行过程中传入的数字5。即使函数箭头此时已不再处于创建它的函数的作用域中，却依然可以访问当时的arguments对象，这是arguments标识符的作用域链解决方案所规定的

【辨识方法】

　　尽管箭头函数与传统函数的语法不同，但它同样可以被识别出来

```javascript
var comparator = (a, b) => a - b;
console.log(typeof comparator); // "function"
console.log(comparator instanceof Function); // true
```

　　同样地，仍然可以在箭头函数上调用call()、apply()及bind()方法，但与其他函数不同的是，箭头函数的this值不会受这些方法的影响

```javascript
var sum = (num1, num2) => num1 + num2;
console.log(sum.call(null, 1, 2)); // 3
console.log(sum.apply(null, [1, 2])); // 3
var boundSum = sum.bind(null, 1, 2);
console.log(boundSum()); // 3
```

　　包括回调函数在内所有使用匿名函数表达式的地方都适合用箭头函数来改写

【函数柯里化】

　　柯里化是一种把接受多个参数的函数变换成接受一个单一参数的函数，并且返回（接受余下的参数而且返回结果的）新函数的技术

　　如果使用ES5的语法来写，如下所示

```javascript
function add(x){
  return function(y){
    return y + x;
  };
}

var addTwo = add(2);
addTwo(3);          // => 5
add(10)(11);        // => 21
```

　　使用ES6的语法来写，如下所示

```javascript
var add = (x) => (y) => x+y
```

　　一般来说，出现连续地箭头函数调用的情况，就是在使用函数柯里化的技术

 

### 尾调用优化

　　ES6关于函数最有趣的变化可能是尾调用系统的引擎优化。尾调用指的是函数作为另一个函数的最后一条语句被调用

```javascript
function doSomething() {
    return doSomethingElse(); // 尾调用
}
```

　　尾调用之所以与其他调用不同，就在于它的特殊的调用位置

　　我们知道，函数调用会在内存形成一个“调用记录”，又称“调用帧”（call frame），保存调用位置和内部变量等信息。如果在函数`A`的内部调用函数`B`，那么在`A`的调用帧上方，还会形成一个`B`的调用帧。等到`B`运行结束，将结果返回到`A`，`B`的调用帧才会消失。如果函数`B`内部还调用函数`C`，那就还有一个`C`的调用帧，以此类推。所有的调用帧，就形成一个“调用栈”（call stack）

　　尾调用由于是函数的最后一步操作，所以不需要保留外层函数的调用帧，因为调用位置、内部变量等信息都不会再用到了，只要直接用内层函数的调用帧，取代外层函数的调用帧就可以了

　　尾调用优化（Tail call optimization），即只保留内层函数的调用帧。如果所有函数都是尾调用，那么完全可以做到每次执行时，调用帧只有一项，这将大大节省内存

　　ES6缩减了严格模式下尾调用栈的大小(非严格模式下不受影响)，如果满足以下条件，尾调用不再创建新的栈帧，而是清除并重用当前栈帧

　　1、尾调用不访问当前栈帧的变量(也就是说函数不是一个闭包)

　　2、在函数内部，尾调用是最后一条语句

　　3、尾调用的结果作为函数值返回

　　以下这段示例代码满足上述的三个条件，可以被JS引擎自动优化

```javascript
"use strict";
function doSomething() {
    // 被优化
    return doSomethingElse();
}
```

　　在这个函数中，尾调用doSomethingElse()的结果立即返回，不调用任何局部作用域变量。如果做一个小改动，不返回最终结果，那么引擎就无法优化当前函数

```javascript
"use strict";
function doSomething() {
    // 未被优化：缺少 return
    doSomethingElse();
}
```

　　同样地，如果定义了一个函数，在尾调用返回后执行其他操作，则函数也无法得到优化

```javascript
"use strict";
function doSomething() {
    // 未被优化：在返回之后还要执行加法
    return 1 + doSomethingElse();
}
```

　　如果把函数调用的结果存储在一个变量里，最后再返回这个变量，则可能导致引擎无法优化

```javascript
"use strict";
function doSomething() {
    // 未被优化：调用并不在尾部
    var result = doSomethingElse();
    return result;
}
```

　　可能最难避免的情况是闭包的使用，它可以访问作用域中所有变量，因而导致尾调用优化失效

```javascript
"use strict";
function doSomething() {
    var num = 1,
    func = () => num;
    // 未被优化：此函数是闭包
    return func();
}
```

　　在示例中，闭包func()可以访问局部变量num，即使调用func()后立即返回结果，也无法对代码进行优化

【应用】

　　实际上，尾调用的优化发生在引擎背后，除非尝试优化一个函数，否则无须思考此类问题。递归函数是其最主要的应用场景，此时尾调用优化的效果最显著

```javascript
function factorial(n) {
    if (n <= 1) {
        return 1;
    } else {
        // 未被优化：在返回之后还要执行乘法
        return n * factorial(n - 1);
    }
}
```

　　由于在递归调用前执行了乘法操作，因而当前版本的阶乘函数无法被引擎优化。如果n是一个非常大的数，则调用栈的尺寸就会不断增长并存在最终导致栈溢出的潜在风险

　　优化这个函数，首先要确保乘法不会在函数调用后执行，可以通过默认参数来将乘法操作移出return语句，结果函数可以携带着临时结果进入到下一个迭代中

```javascript
function factorial(n, p = 1) {
    if (n <= 1) {
        return 1 * p;
    } else {
        let result = n * p;
        // 被优化
        return factorial(n - 1, result);
    }
}
```

　　在这个重写后的factorial()函数中，第一个参数p的默认值为1，用它来保存乘法结果，下一次迭代中可以取出它用于计算，不再需要额外的函数调用。当n大于1时，先执行一轮乘法计算，然后将结果传给第二次factorial()调用的参数。现在，ES6引擎就可以优化递归调用了

　　写递归函数时，最好得用尾递归优化的特性，如果递归函数的计算量足够大，则尾递归优化可以大幅提升程序的性能

　　另一个常见的事例是Fibonacci数列

```javascript
function Fibonacci (n) {
  if ( n <= 1 ) {return 1};
  return Fibonacci(n - 1) + Fibonacci(n - 2);
}

Fibonacci(10) // 89
Fibonacci(100) // 堆栈溢出
Fibonacci(500) // 堆栈溢出
```

　　尾递归优化过的 Fibonacci 数列实现如下

```javascript
function Fibonacci2 (n , ac1 = 1 , ac2 = 1) {
  if( n <= 1 ) {return ac2};
  return Fibonacci2 (n - 1, ac2, ac1 + ac2);
}

Fibonacci2(100) // 573147844013817200000
Fibonacci2(1000) // 7.0330367711422765e+208
Fibonacci2(10000) // Infinity
```

　　由此可见，“尾调用优化”对递归操作意义重大，所以一些函数式编程语言将其写入了语言规格。ES6 是如此，第一次明确规定，所有 ECMAScript 的实现，都必须部署“尾调用优化”。这就是说，ES6 中只要使用尾递归，就不会发生栈溢出，相对节省内存

## ES6-数组扩展

　　数组是一种基础的JS对象，随着时间推进，JS中的其他部分一直在演进，而直到ES5标准才为数组对象引入一些新方法来简化使用。ES6标准继续改进数组，添加了很多新功能。本文将详细介绍ES6数组扩展

 

### 静态方法

　　在ES6以前，创建数组的方式主要有两种，一种是调用Array构造函数，另一种是用数组字面量语法，这两种方法均需列举数组中的元素，功能非常受限。如果想将一个类数组对象(具有数值型索引和length属性的对象)转换为数组，可选的方法也十分有限，经常需要编写额外的代码。为了进一步简化JS数组的创建过程，ES6新增了Array.of()和Array.from()两个方法

【Array.of()】

　　ES6之所以向JS添加新的创建方法，是要帮助开发者们规避通过Array构造函数创建数组时的怪异行为

```javascript
let items = new Array(2);
console.log(items.length); // 2
console.log(items[0]); // undefined
console.log(items[1]); // undefined
items = new Array("2");
console.log(items.length); // 1
console.log(items[0]); // "2"
items = new Array(1, 2);
console.log(items.length); // 2
console.log(items[0]); // 1
console.log(items[1]); // 2
items = new Array(3, "2");
console.log(items.length); // 2
console.log(items[0]); // 3
console.log(items[1]); // "2"
```

　　如果给Array构造函数传入一个数值型的值，那么数组的length属性会被设为该值。如果传入多个值，此时无论这些值是不是数值型的，都会变为数组的元素。这个特性令人感到困惑，不可能总是注意传入数据的类型，所以存在一定的风险

　　ES6通过引入Array.of()方法来解决这个问题。Array.of()与Array构造函数的工作机制类似，只是不存在单一数值型参数值的特例，无论有多少参数，无论参数是什么类型的，Array.of()方法总会创建一个包含所有参数的数组

```javascript
let items = Array.of(1, 2);
console.log(items.length); // 2
console.log(items[0]); // 1
console.log(items[1]); // 2
items = Array.of(2);
console.log(items.length); // 1
console.log(items[0]); // 2
items = Array.of("2");
console.log(items.length); // 1
console.log(items[0]); // "2"
```

　　要用Array.of()方法创建数组，只需传入希望在数组中包含的值。第一个示例创建了一个包含两个数字的数组；第二个数组包含一个数宇；最后一个数组包含一个字符串。这与数组字面量的使用方法很相似，在大多数时候，可以用数组字面量来创建原生数组，但如果需要给一个函数传入Array的构造函数，则可能更希望传入Array.of()来确保行为一致

```javascript
function createArray(arrayCreator, value) {
    return arrayCreator(value);
}
let items = createArray(Array.of, value);
```

　　在这段代码中心createArray()函数接受两个参数，一个是数组创造者函数，另一个是要插入数组的值。可以传入Array.of()作为createArray()方法的第一个参数来创建新数组，如果不能保证传入的值一定不是数字，那么直接传入Array会非常危险

　　[注意]Array.of()方法不通过Symbol.species属性确定返回值的类型，它使用当前构造函数(也就是of()方法中的this值)来确定正确的返回数据的类型

【Array.from()】

　　JS不支持直接将非数组对象转换为真实数组，arguments就是一种类数组对象，如果要把它当作数组使用则必须先转换该对象的类型。在ES5中，可能需要编写如下函数来把类数组对象转换为数组

```javascript
function makeArray(arrayLike) {
    var result = [];
    for (var i = 0, len = arrayLike.length; i < len; i++) {
        result.push(arrayLike[i]);
    }
    return result;
}
function doSomething() {
    var args = makeArray(arguments);
    // 使用 args
}
```

　　这种方法先是手动创建一个result数组，再将arguments对象里的每一个元素复制到新数组中。尽管这种方法有效，但需要编写很多代码才能完成如此简单的操作。最终，开发者们发现了一种只需编写极少代码的新方法，调用数组原生的slice()方法可以将非数组对象转换为数组

```javascript
function makeArray(arrayLike) {
    return Array.prototype.slice.call(arrayLike);
}
function doSomething() {
    var args = makeArray(arguments);
    // 使用 args
}
```

　　这段代码的功能等价于之前的示例，将slice()方法执行时的this值设置为类数组对象，而slice()对象只需数值型索引和length属性就能够正确运行，所以任何类数组对象都能被转换为数组

　　尽管这项技术不需要编写很多代码，但是我们调用Array.prototype.slice.call(arrayLike)时不能直觉地想到这是在将arrayLike转换成一个数组。所幸，ES6添加了一个语义清晰、语法简洁的新方法Array.from()来将对象转化为数组

　　Array.from()方法可以接受可迭代对象或类数组对象作为第一个参数，最终返回一个数组

```javascript
function doSomething() {
    var args = Array.from(arguments);
    // 使用 args
}
```

　　Array.from()方法调用会基于arguments对象中的元素创建一个新数组，args是Array的一个实例，包含arguments对象中同位置的相同值

　　[注意]Array.from()方法也是通过this来确定返回数组的类型的

**映射转换**

　　如果想要进一步转化数组，可以提供一个映射函数作为Array.from()的第二个参数，这个函数用来将类数组对象中的每一个值转换成其他形式，最后将这些结果储存在结果数组的相应索引中

```javascript
function translate() {
    return Array.from(arguments, (value) => value + 1);
}
let numbers = translate(1, 2, 3);
console.log(numbers); // 2,3,4
```

　　在这段代码中，为Array.from()方法传入映射函数(value)=>value+1，数组中的每个元素在储存前都会被加1。如果用映射函数处理对象，也可以给Array.from()方法传入第三个参数来表示映射函数的this值

```javascript
let helper = {
    diff: 1,
    add(value) {
        return value + this.diff;
    }
};
function translate() {
    return Array.from(arguments, helper.add, helper);
}
let numbers = translate(1, 2, 3);
console.log(numbers); // 2,3,4
```

　　此示例传入helper.add()作为转换用的映射函数，由于该方法使用了this.diff属性，因此需要为Array.from()方法提供第三个参数来指定this的值，从而无须通过调用bind()方法或其他方式来指定this的值了

**用Array.from()转换可迭代对象**

　　Array.from()方法可以处理类数组对象和可迭代对象，也就是说该方法能够将所有含有Symbol.iterator属性的对象转换为数组

```javascript
let numbers = {
    *[Symbol.iterator]() {
        yield 1;
        yield 2;
        yield 3;
    }
};
let numbers2 = Array.from(numbers, (value) => value + 1);
console.log(numbers2); // 2,3,4
```

　　由于numbers是一个可迭代对象，因此可以直接将它传入Array.from()来转换成数组。此处的映射函数将每一个数字加1，所以结果数组最终包含的值为2、3和4

　　[注意]如果一个对象既是类数组又是可迭代的，那么Array.from()方法会根据迭代器来决定转换哪个值

 

### 实例方法

　　ES6延续了ES5的一贯风格，也为数组添加了几个新的方法：includes()方法返回一个布尔值，表示数组是否包含给定的值；find()方法和findIndex()方法可以协助开发者在数组中查找任意值；fill()方法和copyWithin()方法的灵感则来自于定型数组的使用过程，定型数组也是ES6中的新特性，是一种只包含数字的数组

【includes()】

`Array.prototype.includes`方法返回一个布尔值，表示某个数组是否包含给定的值，与字符串的`includes`方法类似。ES2016 引入了该方法

```javascript
javascript[1, 2, 3].includes(2)     // true
[1, 2, 3].includes(4)     // false
[1, 2, NaN].includes(NaN) // true
```

　　该方法的第二个参数表示搜索的起始位置，默认为`0`。如果第二个参数为负数，则表示倒数的位置，如果这时它大于数组长度（比如第二个参数为`-4`，但数组长度为`3`），则会重置为从`0`开始

```javascript
[1, 2, 3].includes(3, 3);  // false
[1, 2, 3].includes(3, -1); // true
```

　　没有该方法之前，我们通常使用数组的`indexOf`方法，检查是否包含某个值

```javascript
if (arr.indexOf(el) !== -1) {
  // ...
}
```

`indexOf`方法有两个缺点，一是不够语义化，它的含义是找到参数值的第一个出现位置，所以要去比较是否不等于`-1`，表达起来不够直观。二是，它内部使用严格相等运算符（`===`）进行判断，这会导致对`NaN`的误判

```javascript
[NaN].indexOf(NaN)// -1
```

`includes`使用的是不一样的判断算法，就没有这个问题

```javascript
[NaN].includes(NaN)// true
```

　　下面代码用来检查当前环境是否支持该方法，如果不支持，部署一个简易的替代版本

```javascript
const contains = (() =>
  Array.prototype.includes
    ? (arr, value) => arr.includes(value)
    : (arr, value) => arr.some(el => el === value)
)();
contains(['foo', 'bar'], 'baz'); // => false
```

　　另外，Map 和 Set 数据结构有一个`has`方法，需要注意与`includes`区分

　　1、Map 结构的`has`方法，是用来查找键名的，比如`Map.prototype.has(key)`、`WeakMap.prototype.has(key)`、`Reflect.has(target, propertyKey)`

　　2、Set 结构的`has`方法，是用来查找值的，比如`Set.prototype.has(value)`、`WeakSet.prototype.has(value)`

【find()和findIndex()】

　　由于没有内建的数组搜索方法，因此ES5正式添加了indexOf()和lastIndexOf()两个方法，可以用它们在数组中查找特定的值。虽然这是一个巨大的进步，但这两种方法仍有局限之处，即每次只能查找一个值，如果想在系列数字中查找第一个偶数，则必须自己编写代码来实现。于是ES6引入了find()方法和findIndex()方法来解决这个问题

　　find()方法和findIndex()方法都接受两个参数：一个是回调函数；另一个是可选参数，用于指定回调函数中this的值。执行回调函数时，传入的参数分别为数组中的某个元素、该元素在数组中的索引和数组本身，与传入map()和forEach()方法的参数相同。如果给定的值满足定义的标准，回调函数应返回true。一旦回调函数返回true，find()方法和findIndex()方法都会立即停止搜索数组剩余的部分

　　二者间唯一的区别是，find()方法返回查找到的值，findIndex()方法返回查找到的值的索引

```javascript
let numbers = [25, 30, 35, 40, 45];
console.log(numbers.find(n => n > 33)); // 35
console.log(numbers.findIndex(n => n > 33)); // 2
```

　　这段代码通过调用find()方法和findIndex()方法来定位numbers数组中第一个比33大的值，调用find()方法返回的是35，而调用findIndex()方法返回的是35在numbeps数组中的位置2

　　如果要在数组中根据某个条件查找匹配的元素，那么find()方法和findIndex()方法可以很好地完成任务；如果只想查找与某个值匹配的元素，则indexOf()方法和lastIndexOf()方法是更好的选择

【fill()】

　　fill()方法可以用指定的值填充一至多个数组元素。当传入一个值时，fill()方法会用这个值重写数组中的所有值

```javascript
let numbers = [1, 2, 3, 4];
numbers.fill(1);
console.log(numbers.toString()); // 1,1,1,1
```

　　在此示例中，调用numbers.fill(1)方法后numbers中所有的值会变成1，如果只想改变数组某一部分的值，可以传入开始索引和不包含结束索引(不包含结束索引当前值)这两个可选参数

```javascript
let numbers = [1, 2, 3, 4];
numbers.fill(1, 2);
console.log(numbers.toString()); // 1,2,1,1
numbers.fill(0, 1, 3);
console.log(numbers.toString()); // 1,0,0,1
```

　　在numbers.fill(1,2)调用中，参数2表示从索引2开始填充元素，由于未传入第三个参数作为不包含结束索引，因此使用numbers.length作为不包含结束索引，因而numbers数组的最后两个元素被填充为1。操作numbers.fill(0,1,3)会将数组中位于索引1和2的元素填充为0。调用fill()时若传入第二个和第三个参数则可以只填充数组中的部分元素

　　[注意]如果开始索引或结束索引为负值，那么这些值会与数组的length属性相加来作为最终位置。例如，如果开始位置为-1，那么索引的值实际为array.length-1，array为调用fill()方法的数组

【copyWithin()】

　　copyWithin()方法与fill()方法相似，其也可以同时改变数组中的多个元素。fill()方法是将数组元素赋值为一个指定的值，而copyWithin()方法则是从数组中复制元素的值。调用copyWithin()方法时需要传入两个参数：一个是该方法开始填充值的索引位置，另一个是开始复制值的索引位置

　　比如复制数组前两个元素的值到后两个元素

```javascript
let numbers = [1, 2, 3, 4];
// 从索引 2 的位置开始粘贴
// 从数组索引 0 的位置开始复制数据
numbers.copyWithin(2, 0);
console.log(numbers.toString()); // 1,2,1,2
```

　　这段代码从numbers的索引2开始粘贴值，所以索引2和3将被重写。给CopyWithin()传入第二个参数0表示，从索引0开始复制值并持续到没有更多可复制的值

　　默认情况下，copyWithin()会一直复制直到数组末尾的值，但是可以提供可选的第三个参数来限制被重写元素的数量。第三个参数是不包含结束索引，用于指定停止复制值的位置

```javascript
let numbers = [1, 2, 3, 4];
// 从索引 2 的位置开始粘贴
// 从数组索引 0 的位置开始复制数据
// 在遇到索引 1 时停止复制
numbers.copyWithin(2, 0, 1);
console.log(numbers.toString()); // 1,2,1,4
```

　　在这个示例中，由于可选的结束索引被设置为了1，因此只有位于索引0的值被复制了，数组中的最后一个元素保持不变

　　[注意]正如fill()方法一样，copyWithin()方法的所有参数都接受负数值，并且会自动与数组长度相加来作为最终使用的索引

　　fill()和copyWithin()这两个方法起源于[定型数组](http://www.cnblogs.com/xiaohuochai/p/7261022.html)，为了保持数组方法的一致性才添加到常规数组中的。如果使用定型数组来操作数字的比较，这些方法将大显身手



## ES6对象扩展

　　随着JS应用复杂度的不断增加，开发者在程序中使用对象的数量也在持续增长，因此对象使用效率的提升就变得至关重要。ES6通过多种方式来加强对象的使用，通过简单的语法扩展，提供更多操作对象及与对象交互的方法。本章将详细介绍ES6对象扩展

 

### 对象类别

　　在浏览器这样的执行环境中，对象没有统一的标准，在标准中又使用不同的术语描述对象，ES6规范清晰定义了每一个类别的对象，对象的类别如下

　　1、普通(Ordinary)对象

　　具有JS对象所有的默认内部行为

　　2、特异(Exotic)对象

　　具有某些与默认行为不符的内部行为

　　3、标准(Standard)对象

　　ES6规范中定义的对象，例如，Array、Date等。标准对象既可以是普通对象，也可以是特异对象

　　4、内建对象

　　脚本开始执行时存在于JS执行环境中的对象，所有标准对象都是内建对象

 

### 对象简写

【属性初始值简写】

　　在ES5中，对象字面量只是简单的键值对集合，这意味着初始化属性值时会有一些重复

```javascript
function createPerson(name, age) {
    return {
        name: name,
        age: age
    };
}
```

　　这段代码中的createPerson()函数创建了一个对象，其属性名称与函数的参数相同，在返回的结果中，name和age分别重复了两遍，只是其中一个是对象属性的名称，另外一个是为属性赋值的变量

　　在ES6中，通过使用属性初始化的简写语法，可以消除这种属性名称与局部变量之间的重复书写。当一个对象的属性与本地变量同名时，不必再写冒号和值，简单地只写属性名即可

```javascript
function createPerson(name, age) {
    return {
        name,
        age
    };
}
```

　　当对象字面量里只有一个属性的名称时，JS引擎会在可访问作用域中查找其同名变量；如果找到，则该变量的值被赋给对象字面量里的同名属性。在本示例中，对象字面量属性name被赋予了局部变量name的值

　　在JS中，为对象字面量的属性赋同名局部变量的值是一种常见的做法，这种简写方法有助于消除命名错误

【对象方法简写】

　　在ES5中，如果为对象添加方法，必须通过指定名称并完整定义函数来实现

```javascript
var person = {
    name: "Nicholas",
    sayName: function() {
        console.log(this.name);
    }
};
```

　　而在ES6中，语法更简洁，消除了冒号和function关键字

```javascript
var person = {
    name: "Nicholas",
    sayName() {
        console.log(this.name);
    }
};
```

　　在这个示例中，通过对象方法简写语法，在person对象中创建一个sayName()方法，该属性被赋值为一个匿名函数表达式，它拥有在ES5中定义的对象方法所具有的全部特性

　　二者唯一的区别是，简写方法可以使用super关键字，而普通方法不可以

　　[注意]通过对象方法简写语法创建的方法有一个name属性，其值为小括号前的名称

 

### 可计算属性名

　　在ES5版本中，如果想要通过计算得到属性名，就需要用方括号代替点记法

```javascript
var person = {},
lastName = "last name";
person["first name"] = "huochai";
person[lastName] = "match";
console.log(person["first name"]); // "huochai"
console.log(person[lastName]); // "match"
```

　　变量lastName被赋值为字符串"last name"，引用的两个属性名称中都含有空格，因而不可使用点记法引用这些属性，却可以使用方括号，因为它支持通过任何字符串值作为名称访问属性的值。此外，在对象字面量中，可以直接使用字符串字面量作为属性名称

```javascript
var person = {
    "first name": "huochai"
};
console.log(person["first name"]); // "huochai"
```

　　这种模式适用于属性名提前已知或可被字符串字面量表示的情况。然而，如果属性名称"first name"被包含在一个变量中，或者需要通过计算才能得到该变量的值，那么在ES5中是无法为一个对象字面量定义该属性的

　　在ES6中，可在对象字面量中使用可计算属性名称，其语法与引用对象实例的可计算属性名称相同，也是使用方括号

```javascript
var lastName = "last name";
var person = {
    "first name": "huochai",
    [lastName]: "match"
};
console.log(person["first name"]); // "huochai"
console.log(person[lastName]); // "match"
```

　　在对象字面量中使用方括号表示的该属性名称是可计算的，它的内容将被名称求值并被最终转化为一个字符串，因而同样可以使用表达式作为属性的可计算名称

```javascript
var suffix = " name";
var person = {
    ["first" + suffix]: "huochai",
    ["last" + suffix]: "match"
};
console.log(person["first name"]); // "huochai"
console.log(person["last name"]); // "match"
```

　　这些属性被求值后为字符串"first name"和"last name"，然后它们可用于属性引用。任何可用于对象实例括号记法的属性名，也可以作为字面量中的计算属性名

 

### 判断相等

【Object.is()】

　　在JS中比较两个值时，可能习惯于使用相等运算符(==)或全等运算符(===)，使用后者可以避免触发强制类型转换的行为。但是，即使使用全等运算符也不完全准确

```javascript
console.log(+0 === -0);//true
console.log(NaN === NaN);//false
```

　　ES6引入了Object.is()方法来弥补全等运算符的不准确运算。这个方法接受两个参数，如果这两个参数类型相等且具有相同的值，则返回true，否则返回false

```javascript
console.log(+0 == -0); // true
console.log(+0 === -0); // true
console.log(Object.is(+0, -0)); // false
console.log(NaN == NaN); // false
console.log(NaN === NaN); // false
console.log(Object.is(NaN, NaN)); // true
console.log(5 == 5); // true
console.log(5 == "5"); // true
console.log(5 === 5); // true
console.log(5 === "5"); // false
console.log(Object.is(5, 5)); // true
console.log(Object.is(5, "5")); // false
```

　　对于Object.is()方法来说，其运行结果在大部分情况中与"==="运算符相同，唯一的区别在于+0和-0被识别为不相等并且NaN与NaN等价。但是大可不必抛弃等号运算符，是否选择用Object.is()方法而不是==或===取决于那些特殊情况如何影响代码

 

### 对象合并

【Object.assign()】

　　混合(Mixin)是JS实现对象组合最流行的一种模式。在一个mixin方法中，一个对象接收来自另一个对象的属性和方法，许多JS库中都有类似的minix方法

```javascript
function mixin(receiver, supplier) {
    Object.keys(supplier).forEach(function(key) {
        receiver[key] = supplier[key];
    });
    return receiver;
}
```

　　mixin()函数遍历supplier的自有属性并复制到receiver中(此处的复制行为是浅复制，当属性值为对象时只复制对象的引用)。这样一来，receiver不通过继承就可以获得新属性

```javascript
function EventTarget() { /*...*/ }
EventTarget.prototype = {
    constructor: EventTarget,
    emit: function() { /*...*/ },
    on: function() { /*...*/ }
};
var myObject = {};
mixin(myObject, EventTarget.prototype);
myObject.emit("somethingChanged");
```

　　在这段代码中，myObject继承EventTarget.prototype对象的所有行为，从而使myObject可以分别通过emit()方法发布事件或通过on()方法订阅事件

　　这种混合模式非常流行，因而ES6添加了object.assign()方法来实现相同的功能，这个方法接受一个接收对象和任意数量的源对象，最终返回接收对象

```javascript
function EventTarget() { /*...*/ }
EventTarget.prototype = {
    constructor: EventTarget,
    emit: function() { /*...*/ },
    on: function() { /*...*/ }
}
var myObject = {}
Object.assign(myObject, EventTarget.prototype);
myObject.emit("somethingChanged");
```

【对象合并】

　　Object.assign()方法不叫对象复制，或对象拷贝，而叫对象合并，是因为源对象本身的属性和方法仍然存在

```javascript
var target = { a: 1 };
var source1 = { b: 2 };
var source2 = { c: 3 };

Object.assign(target, source1, source2);
target // {a:1, b:2, c:3}
```

　　Object.assign()方法可以接受任意数量的源对象，并按指定的顺序将属性复制到接收对象中。如果目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性

```javascript
var target = { a: 1, b: 1 };
var source1 = { b: 2, c: 2 };
var source2 = { c: 3 };

Object.assign(target, source1, source2);
target // {a:1, b:2, c:3}
```

【浅拷贝】

　　在对象合并的过程中，`Object.assign()`拷贝的属性是有限制的，只拷贝源对象的自身属性（不拷贝继承属性），也不拷贝不可枚举的属性（`enumerable: false`）

```javascript
Object.assign({b: 'c'},
  Object.defineProperty({}, 'invisible', {
    enumerable: false,
    value: 'hello'
  })
)
// { b: 'c' }
```

 `Object.assign()`方法实行的是浅拷贝，而不是深拷贝。也就是说，如果源对象某个属性的值是对象，那么目标对象拷贝得到的是这个对象的引用

```javascript
var obj1 = {a: {b: 1}};
var obj2 = Object.assign({}, obj1);

obj1.a.b = 2;
obj2.a.b // 2
```

 

### 属性名重复

　　ES5严格模式中加入了对象字面量重复属性的校验，当同时存在多个同名属性时会抛出错误

```javascript
"use strict";
var person = {
    name: "huochai",
    name: "match" // 在 ES5 严格模式中是语法错误
};
```

　　当运行在ES5严格模式下时，第二个name属性会触发二个语法错误

　　但在ES6中，重复属性检查被移除了，无论是在严格模式还是非严格模式下，代码不再检查重复属性，对于每一组重复属性，都会选取最后一个取值

```javascript
"use strict";
var person = {
    name: "huochai",
    name: "match" 
};
console.log(person.name); // "match"
```

　　在这个示例中，属性person.name取最后一次赋值"match"

 

### 枚举顺序

　　ES5中未定义对象属性的枚举顺序，由JS引擎厂商自行决定。然而，ES6严格规定了对象的自有属性被枚举时的返回顺序，这会影响到Object.getOwnPropertyNames()方法及Reflect.ownKeys返回属性的方式，Object.assign()方法处理属性的顺序也将随之改变

　　自有属性枚举顺序的基本规则是

　　1、所有数字键按升序排序

　　2、所有字符串键按照它们被加入对象的顺序排序

　　3、所有symbol键按照它们被加入对象的顺序排序

```javascript
var obj = {
    a: 1,
    0: 1,
    c: 1,
    2: 1,
    b: 1,
    1: 1
};
obj.d = 1;
console.log(Object.getOwnPropertyNames(obj).join("")); // "012acbd"
```

　　Object.getOwnPropertyNames()方法按照0、1、2、a、c、b、d的顺序依次返回对象obj中定义的属性。对于数值键，尽管在对象字面量中的顺序是随意的，但在枚举时会被重新组合和排序。字符串键紧随数值键，并按照在对象obj中定义的顺序依次返回，所以随后动态加入的字符串键最后输出

　　[注意]对于for-in循环，由于并非所有厂商都遵循相同的实现方式，因此仍未指定一个明确的枚举顺序而Object.keys()方法和JSON.stringify()方法都指明与for-in使用相同的枚举顺序，因此它们的枚举顺序目前也不明晰

　　对于JS，枚举顺序的改变其实微不足道，但是有很多程序都需要明确指定枚举顺序才能正确运行。ES6中通过明确定义枚举顺序，确保用到枚举的代码无论处于何处都可以正确地执行

 

### 对象原型

　　原型是JS继承的基础，在早期版本中，JS严重限制了原型的使用。随着语言逐渐成熟，开发者们也更加熟悉原型的运行方式，他们希望获得更多对于原型的控制力，并以更简单的方式来操作原型。于是，ES6针对原型进行了改进

【**proto**】

`__proto__`属性（前后各两个下划线），用来读取或设置当前对象的`prototype`对象。目前，所有浏览器(包括IE11)都部署了这个属性

```javascript
// es6的写法
var obj = {
  method: function() { ... }
};
obj.__proto__ = someOtherObj;

// es5的写法
var obj = Object.create(someOtherObj);
obj.method = function() { ... };
```

　　标准明确规定，只有浏览器必须部署这个属性，其他运行环境不一定需要部署，而且新的代码最好认为这个属性是不存在的。因此，无论从语义的角度，还是从兼容性的角度，都不要使用这个属性，而是使用下面的`Object.setPrototypeOf()`（写操作）、`Object.getPrototypeOf()`（读操作）、`Object.create()`（生成操作）代替

【Object.getPrototypeOf()】

　　该方法与`Object.setPrototypeOf()`方法配套，用于读取一个对象的原型对象

```javascript
Object.getPrototypeOf(obj);
```

【Object.setPrototypeOf()】

　　ES6添加了Object.setPrototypeOf()方法，与**proto**作用相同，通过这个方法可以改变任意指定对象的原型，它接受两个参数：被改变原型的对象及替代第一个参数原型的对象，它是ES6正式推荐的设置原型对象的方法

```javascript
// 格式
Object.setPrototypeOf(object, prototype)

// 用法
var o = Object.setPrototypeOf({}, null);
```

　　例子如下

```javascript
let person = {
    getGreeting() {
        return "Hello";
    }
};
let dog = {
    getGreeting() {
        return "Woof";
    }
};
// 原型为 person
let friend = Object.create(person);
console.log(friend.getGreeting()); // "Hello"
console.log(Object.getPrototypeOf(friend) === person); // true
// 将原型设置为 dog
Object.setPrototypeOf(friend, dog);
console.log(friend.getGreeting()); // "Woof"
console.log(Object.getPrototypeOf(friend) === dog); // true
```

　　这段代码中定义了两个基对象：person和dog。二者都有getGreeting()方法，且都返回一个字符串。friend对象先继承person对象，调用getGreeting()方法输出"Hello"；当原型被变更为dog对象时，原先与person对象的关联被解除，调用person.getGreeting()方法时输出的内容就变为了"Woof"

　　对象原型的真实值被储存在内部专用属性[[protơtype]]中，调用Object.getPrototypeOf()方法返回储存在其中的值，调用Object.setPrototypeOf()方法改变其中的值。然而，这不是操作[[prototype]]值的唯一方法

【简化原型访问的Super引用】

　　ES6引入了Super引用，使用它可以更便捷地访问对象原型

　　如果想重写对象实例的方法，又需要调用与它同名的原型方法，则在ES5中可以这样实现

```javascript
let person = {
    getGreeting() {
        return "Hello";
    }
};
let dog = {
    getGreeting() {
        return "Woof";
    }
};
let friend = {
    getGreeting() {
        return Object.getPrototypeOf(this).getGreeting.call(this) + ", hi!";
    }
};
// 将原型设置为 person
Object.setPrototypeOf(friend, person);
console.log(friend.getGreeting()); // "Hello, hi!"
console.log(Object.getPrototypeOf(friend) === person); // true
// 将原型设置为 dog
Object.setPrototypeOf(friend, dog);
console.log(friend.getGreeting()); // "Woof, hi!"
console.log(Object.getPrototypeOf(friend) === dog); // true
```

　　在这个示例中，friend对象的getGreeting()方法调用了同名的原型方法。object.getPrototypeOf()方法可以确保调用正确的原型，并向输出字符串叠加另一个字符串；后面的.call(this)可以确保正确设置原型方法中的this值

　　要准确记得如何使用Object.getPrototypeOf()方法和call(this)方法来调用原型上的方法实在有些复杂，所以ES6引入了Super关键字。简单来说，Super引用相当于指向对象原型的指针，实际上也就是Object.getPrototypeOf(this)的值。于是，可以这样简化上面的getGreeting()方法

```javascript
let friend = {
    getGreeting() {
        // 这相当于上个例子中的：
        // Object.getPrototypeOf(this).getGreeting.call(this)
        return super.getGreeting() + ", hi!";
    }
};
```

　　调用super.getGreeting()方法相当于在当前上下文中调用Object.getPrototypeOf(this).getGreeting.call(this)。同样，可以通过Super引用调用对象原型上所有其他的方法。当然，必须要在使用简写方法的对象中使用Super引用，如果在其他方法声明中使用会导致语法错误

```javascript
let friend = {
    getGreeting: function() {
        // 语法错误
        return super.getGreeting() + ", hi!";
    }
};
```

　　在这个示例中用匿名function定义一个属性，由于在当前上下文中Super引用是非法的，因此当调用super.getGreeting()方法时会抛出语法错误

　　Super引用在多重继承情况下非常有用，因为在这种情况下，使用Object.getPrototypeOf()方法将会出现问题

```javascript
let person = {
    getGreeting() {
        return "Hello";
    }
};
// 原型为 person
let friend = {
    getGreeting() {
        return Object.getPrototypeOf(this).getGreeting.call(this) + ", hi!";
    }
};
Object.setPrototypeOf(friend, person);
// 原型为 friend
let relative = Object.create(friend);
console.log(person.getGreeting()); // "Hello"
console.log(friend.getGreeting()); // "Hello, hi!"
console.log(relative.getGreeting()); // error!
```

　　this是relative，relative的原型是friend对象，当执行relative的getGreeting()方法时，会调用friend的getGreeting()方法，而此时的this值为relative。object.getPrototypeOf(this)又会返回friend对象。所以就会进入递归调用直到触发栈溢出报错

　　在ES5中很难解决这个问题，但在ES6中，使用Super引用便可以迎刃而解

```javascript
let person = {
    getGreeting() {
        return "Hello";
    }
};
// 原型为 person
let friend = {
    getGreeting() {
        return super.getGreeting() + ", hi!";
    }
};
Object.setPrototypeOf(friend, person);
// 原型为 friend
let relative = Object.create(friend);
console.log(person.getGreeting()); // "Hello"
console.log(friend.getGreeting()); // "Hello, hi!"
console.log(relative.getGreeting()); // "Hello, hi!"
```

　　Super引用不是动态变化的，它总是指向正确的对象，在这个示例中，无论有多少其他方法继承了getGreeting()方法，super.getGreeting()始终指向person.getGreeting()方法

 

### 方法定义

　　在ES6以前从未正式定义过"方法"的概念，方法仅仅是一个具有功能而非数据的对象属性。而在ES6中正式将方法定义为一个函数，它会有一个内部的[[HomeObject]]属性来容纳这个方法从属的对象

```javascript
let person = {
    // 方法
    getGreeting() {
        return "Hello";
    }
};
// 并非方法
function shareGreeting() {
    return "Hi!";
}
```

　　这个示例中定义了person对象，它有一个getGreeting()方法，由于直接把函数赋值给了person对象，因而getGreetingo方法的[[HomeObject]]属性值为person。而创建shareGreeting()函数时，由于未将其赋值给一个对象，因而该方法没有明确定义[[HomeObject]]属性。在大多数情况下这点小差别无关紧要，但是当使用Super引用时就变得非常重要了

　　Super的所有引用都通过[[HomeObject]]属性来确定后续运行过程。第一步是在[[HomeObject]]属性上调用Object.getprototypeof()方法来检索原型的引用，然后搜寻原型找到同名函数，最后设置this绑定并且调用相应方法

```javascript
let person = {
    getGreeting() {
        return "Hello";
    }
};
// 原型为 person
let friend = {
    getGreeting() {
        return super.getGreeting() + ", hi!";
    }
};
Object.setPrototypeOf(friend, person);
console.log(friend.getGreeting()); // "Hello, hi!"
```

　　调用friend.getGreeting()方法会将person.getGreeting()的返回值与"，hi!"拼接成新的字符串并返回。friend.getGreeting()方法的[[HomeObject]]属性值是friend，friend的原型是person，所以super.getGreeting()等价于Person.getGreeting.call(this) 

 

### 对象遍历

【Object.keys()】

　　ES5 引入了`Object.keys()`方法，返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键名

```javascript
var obj = { foo: 'bar', baz: 42 };
console.log(Object.keys(obj));// ["foo", "baz"]
```

　　ES2017 引入了跟`Object.keys`配套的`Object.values`和`Object.entries`，作为遍历一个对象的补充手段，供`for...of`循环使用

```javascript
let {keys, values, entries} = Object;
let obj = { a: 1, b: 2, c: 3 };

for (let key of keys(obj)) {
  console.log(key); // 'a', 'b', 'c'
}

for (let value of values(obj)) {
  console.log(value); // 1, 2, 3
}

for (let [key, value] of entries(obj)) {
  console.log([key, value]); // ['a', 1], ['b', 2], ['c', 3]
}
```

【Object.values()】

`Object.values()`方法返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值

```javascript
var obj = { foo: 'bar', baz: 42 };
console.log(Object.values(obj));// ["bar", 42]
```

`Object.values()`只返回对象自身的可遍历属性

```javascript
var obj = Object.create({}, {p: {value: 42}});
console.log(Object.values(obj)); // []
```

　　上面代码中，`Object.create()`方法的第二个参数添加的对象属性（属性`p`），如果不显式声明，默认是不可遍历的，因为`p`的属性描述对象的`enumerable`默认是`false`，`Object.values()`不会返回这个属性。只要把`enumerable`改成`true`，`Object.values`就会返回属性`p`的值

```javascript
var obj = Object.create({}, {p:
  {
    value: 42,
    enumerable: true
  }
});
console.log(Object.values(obj)); // [42]
```

【Object.entries()】

`Object.entries()`方法返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值对数组

```javascript
var obj = { foo: 'bar', baz: 42 };
console.log(Object.entries(obj));// [ ["foo", "bar"], ["baz", 42] ]
```

　　除了返回值不一样，该方法的行为与`Object.values`基本一致

`Object.entries()`的基本用途是遍历对象的属性

```javascript
let obj = { one: 1, two: 2 };
for (let [k, v] of Object.entries(obj)) {
  console.log(
    `${JSON.stringify(k)}: ${JSON.stringify(v)}`
  );
}
// "one": 1
// "two": 2
```



## ES6中的Symbol类型

　　ES5中包含5种原始类型：[字符串](http://www.cnblogs.com/xiaohuochai/p/5599529.html)、[数字](http://www.cnblogs.com/xiaohuochai/p/5586166.html)、[布尔值](http://www.cnblogs.com/xiaohuochai/p/5616641.html)、[null](http://www.cnblogs.com/xiaohuochai/p/5665637.html#anchor3)和[undefined](http://www.cnblogs.com/xiaohuochai/p/5665637.html#anchor2)。ES6引入了第6种原始类型——Symbol

　　ES5的对象属性名都是字符串，很容易造成属性名冲突。比如，使用了一个他人提供的对象，想为这个对象添加新的方法，新方法的名字就有可能与现有方法产生冲突。如果有一种机制，保证每个属性的名字都是独一无二的，这样就从根本上防止了属性名冲突。这就是ES6引入`Symbol`的原因，本文将详细介绍ES6中的Symbol类型

 

### 创建

　　Symbol 值通过`Symbol`函数生成。这就是说，对象的属性名可以有两种类型：一种是字符串，另一种是Symbol类型。凡是属性名属于 Symbol 类型，就都是独一无二的，可以保证不会与其他属性名产生冲突

```javascript
let firstName = Symbol();
let person = {};
person[firstName] = "huochai";
console.log(person[firstName]); // "huochai"
```

　　[注意]`Symbol`函数前不能使用`new`命令，否则会报错。因为生成的 Symbol 是一个原始类型的值，不是对象

```javascript
//Uncaught TypeError: Symbol is not a constructor
let firstName = new Symbol();
```

　　Symbol函数接受一个可选参数，可以添加一段文本来描述即将创建的Symbol，这段描述不可用于属性访问，但是建议在每次创建Symbol时都添加这样一段描述，以便于阅读代码和调试Symbol程序

```javascript
let firstName = Symbol("first name");
let person = {};
person[firstName] = "huochai";
console.log("first name" in person); // false
console.log(person[firstName]); // "huochai"
console.log(firstName); // "Symbol(first name)"
```

　　Symbol的描述被存储在内部[[Description]]属性中，只有当调用Symbol的toString()方法时才可以读取这个属性。在执行console.log()时隐式调用了firstName的toString()方法，所以它的描述会被打印到日志中，但不能直接在代码里访问[[Description]]

【类型检测】

　　Symbol是原始值，ES6扩展了typeof操作符，返回"symbol"。所以可以用typeof来检测变量是否为symbol类型

```javascript
let symbol = Symbol("test symbol");
console.log(typeof symbol); // "symbol"
```

 

### 使用

　　由于每一个Symbol值都是不相等的，这意味着Symbol值可以作为标识符，用于对象的属性名，就能保证不会出现同名的属性。这对于一个对象由多个模块构成的情况非常有用，能防止某一个键被不小心改写或覆盖

　　所有使用可计算属性名的地方，都可以使用Symbol

```javascript
let firstName = Symbol("first name");
// 使用一个需计算字面量属性
let person = {
    [firstName]: "huochai"
};
// 让该属性变为只读
Object.defineProperty(person, firstName, { writable: false });
let lastName = Symbol("last name");
Object.defineProperties(person, {
    [lastName]: {
        value: "match",
        writable: false
    }
});
console.log(person[firstName]); // "huochai"
console.log(person[lastName]); // "match"
```

　　在此示例中，首先通过可计算对象字面量属性语法为person对象创建了个Symbol属性firstName。后面一行代码将这个属性设置为只读。随后，通过Object.defineProperties()方法创建一个只读的Symbol属性lastName，此处再次使用了对象字面量属性，但却是作为object.defineProperties()方法的第二个参数使用　　

　　[注意]Symbol 值作为对象属性名时，不能用点运算符

```javascript
var mySymbol = Symbol();
var a = {};

a.mySymbol = 'Hello!';
a[mySymbol] // undefined
a['mySymbol'] // "Hello!"
```

　　由上面结果看出，a.mySymbol和a['mySymbol']里的mySymbol是字符串类型的属性名，a[mySymbol]里的mySymbol才是Symbol类型的属性名。虽然都叫mySymbol，但值不相同

　　尽管在所有使用可计算属性名的地方，都可以使用Symbol来代替，但是为了在不同代码片段间有效地共享这些Symbol，需要建立一个体系

 

### 共享体系

　　有时希望在不同的代码中共享同一个Symbol，例如，在应用中有两种不同的对象类型，但是希望它们使用同一个Symbol属性来表示一个独特的标识符。一般而言，在很大的代码库中或跨文件追踪Symbol非常困难而且容易出错，出于这些原因，ES6提供了一个可以随时访问的全局Symbol注册表

【Symbol.for()】

　　如果想创建一个可共享的Symbol，要使用Symbol.for()方法。它只接受一个参数，也就是即将创建的Symbol的字符串标识符，这个参数同样也被用作Symbol的描述

```javascript
let uid = Symbol.for("uid");
let object = {};
object[uid] = "12345";
console.log(object[uid]); // "12345"
console.log(uid); // "Symbol(uid)"
```

　　Symbol.for()方法首先在全局Symbol注册表中搜索键为"uid"的Symbol是否存在。如果存在，直接返回已有的Symbol，否则，创建一个新的Symbol，并使用这个键在Symbol全局注册表中注册，随即返回新创建的Symbol

　　后续如果再传入同样的键调用Symbol.for()会返回相同的Symbol

```javascript
let uid = Symbol.for("uid");
let object = {
    [uid]: "12345"
};
console.log(object[uid]); // "12345"
console.log(uid); // "Symbol(uid)"
let uid2 = Symbol.for("uid");
console.log(uid === uid2); // true
console.log(object[uid2]); // "12345"
console.log(uid2); // "Symbol(uid)
```

　　在这个示例中，uid和uid2包含相同的Symbol并且可以互换使用。第一次调用Symbol.for()方法创建这个Symbol，第二次调用可以直接从Symbol的全局注册表中检索到这个Symbol

【Symbol.keyFor()】

　　还有一个与Symbol共享有关的特性：可以使用Symbol.keyFor()方法在Symbol全局注册表中检索与Symbol有关的键

```javascript
let uid = Symbol.for("uid");
console.log(Symbol.keyFor(uid)); // "uid"
let uid2 = Symbol.for("uid");
console.log(Symbol.keyFor(uid2)); // "uid"
let uid3 = Symbol("uid");
console.log(Symbol.keyFor(uid3)); // undefined
```

　　uid和uid2都返回了"uid"这个键，而在Symbol全局注册表中不存在uid3这个Symbol，也就是不存在与之有关的键，所以最终返回undefined

　　[注意]`Symbol.for`为Symbol值登记的名字，是全局环境的，可以在不同的 iframe 或 service worker 中取到同一个值

```javascript
let iframe = document.createElement('iframe');
iframe.src = String(window.location);
document.body.appendChild(iframe);

console.log(iframe.contentWindow.Symbol.for('foo') === Symbol.for('foo'));// true
```

　　上面代码中，iframe 窗口生成的 Symbol 值，可以在主页面得到

　　Symbol全局注册表是一个类似全局作用域的共享环境，也就是说不能假设目前环境中存在哪些键。当使用第三方组件时，尽量使用Symbol键的命名空间以减少命名冲突。例如，jQuery的代码可以为所有键添加"jquery"前缀，就像"jquery.element"或其他类似的键

 

### 类型转换

　　类型转换是JS中的一个重要语言特性，然而其他类型没有与Symbol逻辑等价的值，因而Symbol使用起来不是很灵活

　　使用console.log()方法来输出Symbol的内容，它会调用Symbol的String()方法并输出有用的信息。也可以像这样直接调用string()方法来获得相同的内容

```javascript
let uid = Symbol.for("uid"),
    desc = String(uid);
console.log(desc); // "Symbol(uid)"
```

　　String()函数调用了uid.toString()方法，返回字符串类型的Symbol描述里的内容。但是，如果尝试将Symbol与一个字符串拼接，会导致程序抛出错误

```javascript
let uid = Symbol.for("uid"),
desc = uid + ""; // 引发错误！
```

　　将uid与空字符串拼接，首先要将uid强制转换为一个字符串，而Symbol不可以被转换为字符串，故程序直接抛出错误

　　同样，也不能将Symbol强制转换为数字类型。将Symbol与每一个数学运算符混合使用都会导致程序抛出错误

```javascript
let uid = Symbol.for("uid"),
sum = uid / 1; // 引发错误！
```

　　尝试将Symbol除1，程序直接抛出错误。而且无论使用哪一个数学操作符，都无法正常运行

　　[注意]布尔值除外，因为Symbol与JS中的非空值类似，其等价布尔值为true

```javascript
let uid = Symbol.for("uid");
console.log(uid);//'Symbol(uid)'
console.log(!uid);//false
console.log(Boolean(uid));//true
```

 

### 属性检索

　　Symbol作为属性名，该属性不会出现在for...in、for...of循环中，也不会被Object.getOwnPropertyNames()、Object.keys()、JSON.stringify()返回。于是，在ES6中添加了一个Object.getOwnpropertySymbols()方法来检索对象中的Symbol属性

　　Object.getOwnPropertySymbols()方法的返回值是一个包含所有Symbol自有属性的数组

```javascript
let uid = Symbol.for("uid");
let object = {
    [uid]: "12345"
};
let symbols = Object.getOwnPropertySymbols(object);
console.log(symbols.length); // 1
console.log(symbols[0]); // "Symbol(uid)"
console.log(object[symbols[0]]); // "12345"
```

　　在这段代码中，object对象有一个名为uid的Symbol属性，object.getOwnPropertySymbols()方法返回了包含这个属性的数组

　　另一个新的API——`Reflect.ownKeys()`方法可以返回所有类型的键名，包括常规键名和 Symbol 键名

```javascript
let obj = {
  [Symbol('my_key')]: 1,
  enum: 2,
  nonEnum: 3
};
console.log(Reflect.ownKeys(obj));//  ["enum", "nonEnum", Symbol(my_key)]
```

　　由于以 Symbol 值作为名称的属性，不会被常规方法遍历得到。可以利用这个特性，为对象定义一些非私有的、但又希望只用于内部的方法

```javascript
var size = Symbol('size');
class Collection {
  constructor() {
    this[size] = 0;
  }
  add(item) {
    this[this[size]] = item;
    this[size]++;
  }
  static sizeOf(instance) {
    return instance[size];
  }
}
var x = new Collection();
Collection.sizeOf(x) // 0
x.add('foo');
Collection.sizeOf(x) // 1
Object.keys(x) // ['0']
Object.getOwnPropertyNames(x) // ['0']
Object.getOwnPropertySymbols(x) // [Symbol(size)]
```

　　上面代码中，对象x的size属性是一个Symbol值，所以Object.keys(x)、Object.getOwnPropertyNames(x)都无法获取它。这就造成了一种非私有的内部方法的效果

 

### 内置Symbol

　　除了定义自己使用的Symbol值以外，ES6还提供了11个内置的Symbol值，指向语言内部使用的方法

　　1、Symbol.haslnstance

　　一个在执行instanceof时调用的内部方法，用于检测对象的继承信息

　　2、Symbol.isConcatSpreadable

　　一个布尔值，用于表示当传递一个集合作为Array.prototype.concat()方法的参数时，是否应该将集合内的元素规整到同一层级

　　3、Symbol.iterator

　　一个返回迭代器的方法

　　4、Symbol.match

　　一个在调用String.prototype.match()方法时调用的方法，用于比较字符串

　　5、Symbol.replace

　　一个在调用String.prototype.replace()方法时调用的方法，用于替换字符串的子串

　　6、Symbol.search

　　一个在调用String.prototype.search()方法时调用的方法，用于在字符串中定位子串

　　7、Symbol.species

　　用于创建派生类的构造函数

　　8、Symbol.split

　　一个在调用String.prototype.split()方法时调用的方法，用于分割字符串

　　9、Symbol.toprimitive

　　一个返回对象原始值的方法

　　10、Symbol.ToStringTag

　　一个在调用Object.prototype.toString()方法时使用的字符串，用于创建对象描述

　　11、Symbol.unscopables

　　一个定义了一些不可被with语句引用的对象属性名称的对象集合

【Symbol.haslnstance】

　　每个函数都有一个Symbol.haslnstance方法，用于确定对象是否为函数的实例。该方法在Function.prototype中定义，所有函数都继承了instanceof属性的默认行为。为了确保Symbol.haslnstance不会被意外重写，该方法被定义为不可写、不可配置并且不可枚举

　　Symbol.haslnstance方法只接受一个参数，即要检查的值。如果传入的值是函数的实例，则返回true

```javascript
obj instanceof Array;
```

　　以上这行代码等价于下面这行

```javascript
Array[Symbol.hasInstance](obj);
```

　　本质上，ES6只是将instanceof操作符重新定义为此方法的简写语法。现在引入方法调用后，就可以随意改变instanceof的运行方式了

```javascript
class MyClass {
  [Symbol.hasInstance](foo) {
    return foo instanceof Array;
  }
}
console.log([1, 2, 3] instanceof new MyClass()); // true
```

　　假设定义一个无实例的函数，就可以将Symbol.haslnstance的返回值硬编码为false

```javascript
function MyObject() {
    // ...
}
Object.defineProperty(MyObject, Symbol.hasInstance, {
    value: function(v) {
        return false;
    }
});
let obj = new MyObject();
console.log(obj instanceof MyObject); // false
```

　　只有通过Object.defineProperty()方法才能够改写一个不可写属性，上面的示例调用这个方法来改写symbol.haslnstance，为其定义一个总是返回false的新函数，即使obj实际上确实是Myobject类的实例，在调用过object.defineProperty()方法之后，instanceof运算符返回的也是false

　　当然，也可以基于任意条件，通过值检查来确定被检测的是否为实例。例如，可以将1～100的数字定义为一个特殊数字类型的实例，具体实现的代码如下

```javascript
function SpecialNumber() {
　　// empty
}
Object.defineProperty(SpecialNumber, Symbol.hasInstance, {
    value: function(v) {
        return (v instanceof Number) && (v >=1 && v <= 100);
    }
});
let two = new Number(2),
zero = new Number(0);
console.log(two instanceof SpecialNumber); // true
console.log(zero instanceof SpecialNumber); // false
```

　　在这段代码中定义了一个symbol.hasInstance方法，当值为Number的实例且其值在1～100之间时返回true。所以即使SpecialNumber函数和变量two之间没有直接关系，变量two也被确认为specialNumber的实例

　　如果要触发Symbol.haslnstance调用，instanceof的左操作数必须是一个对象，如果左操作数为非对象会导致instanceof总是返回false　　

　　当然，可以重写所有内建函数(如Date和Error函数)默认的symbol.haslnstance属性。但是这样做的后果是代码的运行结果变得不可预期且有可能令人感到困惑，所以不推荐这样做，最好的做法是，只在必要情况下改写自己声明的函数的Symbol.haslnstance属性

【Symbol.isConcatSpreadable】

　　对象的Symbol.isConcatSpreadable属性是布尔值，表示该对象使用Array.prototype.concat()时，是否可以展开

```javascript
let arr1 = ['c', 'd'];
['a', 'b'].concat(arr1, 'e') // ['a', 'b', 'c', 'd', 'e']
arr1[Symbol.isConcatSpreadable] // undefined

let arr2 = ['c', 'd'];
arr2[Symbol.isConcatSpreadable] = false;
['a', 'b'].concat(arr2, 'e') // ['a', 'b', ['c','d'], 'e']
```

　　上面代码说明，数组的默认行为是可以展开。`Symbol.isConcatSpreadable`属性等于undefined或true，都有这个效果

　　类数组对象也可以展开，但它的`Symbol.isConcatSpreadable`属性默认为`false`，必须手动打开

```javascript
let obj = {length: 2, 0: 'c', 1: 'd'};
['a', 'b'].concat(obj, 'e') // ['a', 'b', obj, 'e']

obj[Symbol.isConcatSpreadable] = true;
['a', 'b'].concat(obj, 'e') // ['a', 'b', 'c', 'd', 'e']
```

　　对于一个类来说，`Symbol.isConcatSpreadable`属性必须写成实例的属性

```javascript
class A1 extends Array {
  constructor(args) {
    super(args);
    this[Symbol.isConcatSpreadable] = true;
  }
}
class A2 extends Array {
  constructor(args) {
    super(args);
    this[Symbol.isConcatSpreadable] = false;
  }
}
let a1 = new A1();
a1[0] = 3;
a1[1] = 4;
let a2 = new A2();
a2[0] = 5;
a2[1] = 6;
[1, 2].concat(a1).concat(a2)
// [1, 2, 3, 4, [5, 6]]
```

　　上面代码中，类`A1`是可展开的，类`A2`是不可展开的，所以使用`concat`时有不一样的结果

【Symbol.species】

　　对象的`Symbol.species`属性，指向当前对象的构造函数。创造实例时，默认会调用这个方法，即使用这个属性返回的函数当作构造函数，来创造新的实例对象

```javascript
class MyArray extends Array {
  // 覆盖父类 Array 的构造函数
  static get [Symbol.species]() { return Array; }
}
```

　　上面代码中，子类`MyArray`继承了父类`Array`。创建`MyArray`的实例对象时，本来会调用它自己的构造函数，但是由于定义了`Symbol.species`属性，所以会使用这个属性返回的的函数，创建`MyArray`的实例

　　这个例子也说明，定义`Symbol.species`属性要采用`get`读取器。默认的`Symbol.species`属性等同于下面的写法

```javascript
static get [Symbol.species]() {
  return this;
}
```

　　下面是一个例子

```javascript
class MyArray extends Array {
  static get [Symbol.species]() { return Array; }
}
var a = new MyArray(1,2,3);
var mapped = a.map(x => x * x);

mapped instanceof MyArray // false
mapped instanceof Array // true
```

　　上面代码中，由于构造函数被替换成了`Array`。所以，`mapped`对象不是`MyArray`的实例，而是`Array`的实例

【Symbol.match】

　　对象的`Symbol.match`属性，指向一个函数。当执行`str.match(myObject)`时，如果该属性存在，会调用它，返回该方法的返回值

```javascript
String.prototype.match(regexp)
// 等同于
regexp[Symbol.match](this)
class MyMatcher {
  [Symbol.match](string) {
    return 'hello world'.indexOf(string);
  }
}
'e'.match(new MyMatcher()) // 1
```

【Symbol.replace】

　　对象的`Symbol.replace`属性，指向一个方法，当该对象被`String.prototype.replace`方法调用时，会返回该方法的返回值

```javascript
String.prototype.replace(searchValue, replaceValue)
// 等同于
searchValue[Symbol.replace](this, replaceValue)
```

　　下面是一个例子

```javascript
const x = {};
x[Symbol.replace] = (...s) => console.log(s);

'Hello'.replace(x, 'World') // ["Hello", "World"]
Symbol.replace`方法会收到两个参数，第一个参数是`replace`方法正在作用的对象，上面例子是`Hello`，第二个参数是替换后的值，上面例子是`World
```

【Symbol.search】

　　对象的`Symbol.search`属性，指向一个方法，当该对象被`String.prototype.search`方法调用时，会返回该方法的返回值

```javascript
String.prototype.search(regexp)
// 等同于
regexp[Symbol.search](this)

class MySearch {
  constructor(value) {
    this.value = value;
  }
  [Symbol.search](string) {
    return string.indexOf(this.value);
  }
}
'foobar'.search(new MySearch('foo')) // 0
```

【Symbol.split】

　　对象的`Symbol.split`属性，指向一个方法，当该对象被`String.prototype.split`方法调用时，会返回该方法的返回值

```javascript
String.prototype.split(separator, limit)
// 等同于
separator[Symbol.split](this, limit)
```

　　下面是一个例子

```javascript
class MySplitter {
  constructor(value) {
    this.value = value;
  }
  [Symbol.split](string) {
    var index = string.indexOf(this.value);
    if (index === -1) {
      return string;
    }
    return [
      string.substr(0, index),
      string.substr(index + this.value.length)
    ];
  }
}
'foobar'.split(new MySplitter('foo'))// ['', 'bar']
'foobar'.split(new MySplitter('bar'))// ['foo', '']
'foobar'.split(new MySplitter('baz'))// 'foobar'
```

　　上面方法使用`Symbol.split`方法，重新定义了字符串对象的`split`方法的行为

【Symbol.iterator】

　　对象的`Symbol.iterator`属性，指向该对象的默认遍历器方法

```javascript
var myIterable = {};
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};

[...myIterable] // [1, 2, 3]
```

　　对象进行`for...of`循环时，会调用`Symbol.iterator`方法，返回该对象的默认遍历器

```javascript
class Collection {
  *[Symbol.iterator]() {
    let i = 0;
    while(this[i] !== undefined) {
      yield this[i];
      ++i;
    }
  }
}

let myCollection = new Collection();
myCollection[0] = 1;
myCollection[1] = 2;

for(let value of myCollection) {
  console.log(value);
}
// 1
// 2
```

【Symbol.toPrimitive】

　　对象的`Symbol.toPrimitive`属性，指向一个方法。该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值

`Symbol.toPrimitive`被调用时，会接受一个字符串参数，表示当前运算的模式，一共有三种模式

　　1、Number：该场合需要转成数值

　　2、String：该场合需要转成字符串

　　3、Default：该场合可以转成数值，也可以转成字符串

```javascript
let obj = {
  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case 'number':
        return 123;
      case 'string':
        return 'str';
      case 'default':
        return 'default';
      default:
        throw new Error();
     }
   }
};

2 * obj // 246
3 + obj // '3default'
obj == 'default' // true
String(obj) // 'str'
```

【String.toStringTag】

　　对象的`Symbol.toStringTag`属性，指向一个方法。在该对象上面调用`Object.prototype.toString`方法时，如果这个属性存在，它的返回值会出现在`toString`方法返回的字符串之中，表示对象的类型。也就是说，这个属性可以用来定制`[object Object]`或`[object Array]`中`object`后面的那个字符串

```javascript
// 例一
({[Symbol.toStringTag]: 'Foo'}.toString())
// "[object Foo]"

// 例二
class Collection {
  get [Symbol.toStringTag]() {
    return 'xxx';
  }
}
var x = new Collection();
Object.prototype.toString.call(x) // "[object xxx]"
```

　　ES6新增内置对象的`Symbol.toStringTag`属性值如下、

```javascript
    JSON[Symbol.toStringTag]：'JSON'
    Math[Symbol.toStringTag]：'Math'
    Module[Symbol.toStringTag]：'Module'
    ArrayBuffer.prototype[Symbol.toStringTag]：'ArrayBuffer'
    DataView.prototype[Symbol.toStringTag]：'DataView'
    Map.prototype[Symbol.toStringTag]：'Map'
    Promise.prototype[Symbol.toStringTag]：'Promise'
    Set.prototype[Symbol.toStringTag]：'Set'
    %TypedArray%.prototype[Symbol.toStringTag]：'Uint8Array'
    WeakMap.prototype[Symbol.toStringTag]：'WeakMap'
    WeakSet.prototype[Symbol.toStringTag]：'WeakSet'
    %MapIteratorPrototype%[Symbol.toStringTag]：'Map Iterator'
    %SetIteratorPrototype%[Symbol.toStringTag]：'Set Iterator'
    %StringIteratorPrototype%[Symbol.toStringTag]：'String Iterator'
    Symbol.prototype[Symbol.toStringTag]：'Symbol'
    Generator.prototype[Symbol.toStringTag]：'Generator'
    GeneratorFunction.prototype[Symbol.toStringTag]：'GeneratorFunction'
```

【Symbol.unscopables】

　　对象的`Symbol.unscopables`属性，指向一个对象。该对象指定了使用`with`关键字时，哪些属性会被`with`环境排除。

```javascript
Array.prototype[Symbol.unscopables]
// {
//   copyWithin: true,
//   entries: true,
//   fill: true,
//   find: true,
//   findIndex: true,
//   includes: true,
//   keys: true
// }

Object.keys(Array.prototype[Symbol.unscopables])
// ['copyWithin', 'entries', 'fill', 'find', 'findIndex', 'includes', 'keys']
```

　　上面代码说明，数组有7个属性，会被`with`命令排除

```javascript
// 没有 unscopables 时
class MyClass {
  foo() { return 1; }
}
var foo = function () { return 2; };
with (MyClass.prototype) {
  foo(); // 1
}
// 有 unscopables 时
class MyClass {
  foo() { return 1; }
  get [Symbol.unscopables]() {
    return { foo: true };
  }
}
var foo = function () { return 2; };

with (MyClass.prototype) {
  foo(); // 2
}
```

　　上面代码通过指定`Symbol.unscopables`属性，使得`with`语法块不会在当前作用域寻找`foo`属性，即`foo`将指向外层作用域的变量



## ES6-块级作用域

　　过去，javascript缺乏块级作用域，var声明时的声明提升，属性变量，等行为让人困惑。ES6的新语法可以帮助我们更好地控制作用域。本文将详细介绍ES6新引入的块级作用域绑定机制、let和const声明机制。

### var声明

【变量提升】

```javascript
var`声明会发生”变量提升“现象，即变量可以在声明之前使用，值为`undefined
function getValue(condition){
    if(condition){
        var value = 'blue';
        return value;
    }else{
　　　　 //此处可访问变量value，值为undefined
        return null;
    }
　　　　//此处可访问变量value，值为undefined
}
```

　　如果没有javascript开发经验，可能会认为只有condition为true时，才会创建变量value

　　但实际上，在预编译阶段，javascript引擎会将上面的函数修改成下面这样

```javascript
function getValue(condition){
    var value;
    if(condition){
        value = 'blue';
        return value;
    }else{
        return null;
    }
}
```

　　变量value的声明被提升到函数顶部，而初始化操作依然留在原处。如果不注意，很可能引起错误。为此，ES6引入了块级作用域来强化对变量生命周期的控制

【块级声明】

　　块级声明用于声明在指定块的作用域之外无法访问的变量，它存在于

　　1、函数内部

　　2、{}之间的块区域内

 

### let声明

　　let声明的用法与var声明相同。用let代替var来声明变量，就可以把变量的作用域限制在当前代码块中

```javascript
function getValue(condition){
    if(condition){
        let value = 'blue';
        return value;
    }else{
         //变量value在此处不存在
        return null;
    }
    //变量value在此处不存在
}
```

　　变量value改由关键字let进行声明后，不再被提升到函数顶部。执行流离开if块时，value立刻被销毁。如果condition的值为false，就永远不会声明并初始化value

【禁止重声明】

　　假设作用域中已经存在某个标识符，此时再使用let关键字声明它就会抛出错误

```javascript
var count = 30;
//抛出语法错误
//Uncaught SyntaxError: Identifier 'count' has already been declared
let count = 40;
```

 

### const声明

　　使用const声明的是常量，其值一旦被设定后不可更改。因此，每个通过const声明的常量必须进行初始化

```javascript
const num = 30;
//抛出语法错误
//Uncaught SyntaxError: Missing initializer in const declaration
const name;
```

　　const与let声明老师块级标识符，所以常量也只在当前代码块中有效，一旦执行到块外会立即被销毁。常量同样也不会被提升到作用域顶部

```javascript
if(condition){
    const num = 30;    
}
//此处无法访问num
```

【禁止重声明】

　　与let类似，在同一作用域内用const声明已经存在的标识符也会导致语法错误，无论该标识符是使用var，还是let声明的

```javascript
var message = 'hello';
let num = 10;

//这两条语句都会抛出错误
const message = "goobye";
const num = 30;
```

【无法再赋值】

　　const与let声明最大的不同之处在于，const声明的常量无法再赋值

```javascript
let num1 = 10;
num1= 20;

const num2 = 10;
//Uncaught TypeError: Assignment to constant variable.
num2 = 20;
```

【可修改对象属性】

　　const声明不允许修改绑定，但允许修改值。这也就意味着用const声明对象后，可以修改该对象的属性值

```javascript
const person = {
    name: 'huochai'
};
//可以修改对象属性的值
person.name = 'match';
//Object {name: "match"}
console.log(person);

//抛出语法错误
//Uncaught TypeError: Assignment to constant variable.
person = {
    name: 'match'
}
```

 

### 临时死区

　　与var不同，let和const声明的变量不会被提升到作用域顶部，如果在声明之前访问这些变量，会引发错误。而从作用域顶部到声明变量语句之前的这个区域，被称为临时死区(temporal dead zone)，简称为TDZ

```javascript
if(true){
    //undefined
    console.log(typeof value);
    var value = "blue";
}

if(true){
    //Uncaught ReferenceError: value is not defined
    console.log(typeof value);
    let value = "blue";
}
```

　　但是，在let或const声明的作用域之外使用该变量就不会报错

```javascript
//undefined
console.log(typeof value);
if(true){
    let value = "blue";
}
```

 

### 循环绑定

【var声明】

　　长久以来，var声明使得在循环中创建函数异常困难，因为变量到了循环之外仍能访问

```javascript
var funcs = [];
for(var i = 0; i < 10; i++){
    funcs.push(function(){
        //输出10次10
        console.log(i);
    });
}
funcs.forEach(function(func){
    func();
})
```

　　上面代码中，预期的结果是输出数字0-9，但它却一连串输出了10次10，这是因为循环里的每次迭代同时共享着变量i，循环内部创建的函数全都保留了对相同变量的引用，循环结束时变量i的值为10，所以每次调用console.log(i)时就会输出10

【IIFE】

　　为解决这个问题，可以在循环中使用立即调用函数表达式(IIFE)，以强制生成计数器变量的副本

```javascript
var funcs = [];
for(var i = 0; i < 10; i++){
    funcs.push((function(value){
        return function(){
            //0
            //1
            //...
            //9
            console.log(value);
        }
    })(i));
}
funcs.forEach(function(func){
    func();
})
```

　　在循环内部，IIFE表达式为接受的每一个变量i都创建了一个副本并存储为变量value，这个变量的值就是相应迭代创建的函数所使用的值，因此调用每个函数都会像从0-9循环一样得到期望的值

【let】

　　let声明模仿上例中IIFE所做的一切来简化循环过程。每次迭代循环都会创建一个新变量，并以之前迭代中同名变量的值将其初始化

```javascript
var funcs = [];
for(let i = 0; i < 10; i++){
    funcs.push(function(){
        //0
        //1
        //...
        //9
        console.log(i);
    });
}
funcs.forEach(function(func){
    func();
})
```

　　以上这段循环相比之下更为简洁，每次循环时let声明都会创建一个新变量i，并将其初始化为i的当前值，所以循环内部创建的每个函数都能得到属于他们自己的i的副本

　　对于for-in循环和for-of循环来说也是一样的

```javascript
var funcs = [];
obj = {
    a:true,
    b:true,
    c:true
}
for(let key in obj){
    funcs.push(function(){
        //a
        //b
        //c
        console.log(key);
    })
}
funcs.forEach(function(func){
    func();
})
```

【const】

　　对于const声明来说，由于其无法改变变量的值，所以无法使用普通的for循环

```javascript
var funcs = [];
for(const i = 0; i < 10; i++){
    funcs.push(function(){
            //Uncaught TypeError: Assignment to constant variable.
        console.log(i);
    });
}
funcs.forEach(function(func){
    func();
})
```

　　由于for-in循环中每次迭代不会修改已有绑定，而是创建一个新绑定，所以在for-in循环中可以使用const

```javascript
var funcs = [];
obj = {
    a:true,
    b:true,
    c:true
}
for(const key in obj){
    funcs.push(function(){
        //a
        //b
        //c
        console.log(key);
    })
}
funcs.forEach(function(func){
    func();
})
```

 

### 属性变量

　　对var声明的变量来说，如果处于全局作用域，它们会自动成为window对象的属性。这意味着用var很可能无意中覆盖一个已经存在的全局变量

```javascript
//function RegExp() { [native code] }
console.log(RegExp);
var RegExp = "hello";
console.log(RegExp);//'hello'
console.log(window.RegExp);//'hello'
```

　　如果使用let或const声明的变量，不会成为window对象的属性

```javascript
let RegExp = "hello";
console.log(RegExp);//'hello'
console.log(window.RegExp);//function RegExp() { [native code] }
```

　　因此，如果希望在window对象下定义变量，要使用var声明。如果不希望，则使得let或const

 

### 最佳实践

　　默认使用const，只有确实需要改变变量的值时使用let

　　因为大部分变量的值在初始化后不应再改变，而预料外的变量值的改变是很多bug的源头


## ES6-解构赋值

　　我们经常定义许多对象和数组，然后有组织地从中提取相关的信息片段。在ES6中添加了可以简化这种任务的新特性：解构。解构是一种打破数据结构，将其拆分为更小部分的过程。本文将详细介绍ES6解构赋值

 

### 引入

　　在ES5中，开发者们为了从对象和数组中获取特定数据并赋值给变量，编写了许多看起来同质化的代码

```javascript
let options = {
    repeat: true,
    save: false
};
// 从对象中提取数据
let repeat = options.repeat,
save = options.save;
```

　　这段代码从options对象中提取repeat和save的值，并将其存储为同名局部变量，提取的过程极为相似

　　如果要提取更多变量，则必须依次编写类似的代码来为变量赋值，如果其中还包含嵌套结构，只靠遍历是找不到真实信息的，必须要深入挖掘整个数据结构才能找到所需数据

　　所以ES6添加了解构功能，将数据结构打散的过程变得更加简单，可以从打散后更小的部分中获取所需信息

 

### 对象解构

　　对象字面量的语法形式是在一个赋值操作符左边放置一个对象字面量

```javascript
let node = {
    type: "Identifier",
    name: "foo"
};
let { type, name } = node;
console.log(type); // "Identifier"
console.log(name); // "foo"
```

　　在这段代码中，node.type的值被存储在名为type的变量中；node.name的值被存储在名为name的变量中

【解构赋值】

　　到目前为止，我们已经将对象解构应用到了变量的声明中。然而，我们同样可以在给变量赋值时使用解构语法

```javascript
let node = {
    type: "Identifier",
    name: "foo"
},
type = "Literal",
name = 5;
// 使用解构来分配不同的值
({ type, name } = node);
console.log(type); // "Identifier"
console.log(name); // "foo"
```

　　在这个示例中，声明变量type和name时初始化了一个值，在后面几行中，通过解构赋值的方法，从node对象读取相应的值重新为这两个变量赋值

　　[注意]一定要用一对小括号包裹解构赋值语句，JS引擎将一对开放的花括号视为一个代码块。语法规定，代码块语句不允许出现在赋值语句左侧，添加小括号后可以将块语句转化为一个表达式，从而实现整个解构赋值过程

　　解构赋值表达式的值与表达式右侧(也就是=右侧)的值相等，如此一来，在任何可以使用值的地方都可以使用解构赋值表达式

```javascript
let node = {
    type: "Identifier",
    name: "foo"
},
type = "Literal",
name = 5;
function outputInfo(value) {
    console.log(value === node); // true
}
outputInfo({ type, name } = node);
console.log(type); // "Identifier"
console.log(name); // "foo"
```

　　调用outputlnfo()函数时传入了一个解构表达式，由于JS表达式的值为右侧的值，因而此处传入的参数等同于node，且变量type和name被重新赋值，最终将node传入outputlnfo()函数

　　[注意]解构赋值表达式(也就是=右侧的表达式)如果为null或undefined会导致程序抛出错误。也就是说，任何尝试读取null或undefined的属性的行为都会触发运行时错误

【默认值】

　　使用解构赋值表达式时，如果指定的局部变量名称在对象中不存在，那么这个局部变量会被赋值为undefined

```javascript
let node = {
    type: "Identifier",
    name: "foo"
};
let { type, name, value } = node;
console.log(type); // "Identifier"
console.log(name); // "foo"
console.log(value); // undefined
```

　　这段代码额外定义了一个局部变量value，然后尝试为它赋值，然而在node对象上，没有对应名称的属性值，所以像预期中的那样将它赋值为undefined

　　当指定的属性不存在时，可以随意定义一个默认值，在属性名称后添加一个等号(=)和相应的默认值即可

```javascript
let node = {
    type: "Identifier",
    name: "foo"
};
let { type, name, value = true } = node;
console.log(type); // "Identifier"
console.log(name); // "foo"
console.log(value); // true
```

　　在此示例中，为变量value设置了默认值true，只有当node上没有该属性或者该属性值为undefined时该值才生效。此处没有node.value属性，因为value使用了预设的默认值

【为非同名局部变量赋值】

　　如果希望使用不同命名的局部变量来存储对象属性的值，ES6中的一个扩展语法可以满足需求，这个语法与完整的对象字面量属性初始化程序的很像

```javascript
let node = {
    type: "Identifier",
    name: "foo"
};
let { type: localType, name: localName } = node;
console.log(localType); // "Identifier"
console.log(localName); // "foo"
```

　　这段代码使用了解构赋值来声明变量localType和localName，这两个变量分别包含node.type和node.name属性的值。type:localType语法的含义是读取名为type的属性并将其值存储在变量localType中，这种语法实际上与传统对象字面量的语法相悖，原来的语法名称在冒号左边，值在右边；现在值在冒号右边，而对象的属性名在左边

　　当使用其他变量名进行赋值时也可以添加默认值，只需在变量名后添加等号和默认值即可

```javascript
let node = {
    type: "Identifier"
};
let { type: localType, name: localName = "bar" } = node;
console.log(localType); // "Identifier"
console.log(localName); // "bar"
```

　　在这段代码中，由于node.name属性不存在，变量被默认赋值为"bar"

【嵌套对象解构】

　　解构嵌套对象仍然与对象字面量的语法相似，可以将对象拆解以获取想要的信息

```javascript
let node = {
    type: "Identifier",
    name: "foo",
    loc: {
        start: {
            line: 1,
            column: 1
        },
    end: {
        line: 1,
        column: 4
    }
}
};
let { loc: { start }} = node;
console.log(start.line); // 1
console.log(start.column); // 1
```

　　在这个示例中，我们在解构模式中使用了花括号，其含义为在找到node对象中的loc属性后，应当深入一层继续查找start属性。在上面的解构示例中，所有冒号前的标识符都代表在对象中的检索位置，其右侧为被赋值的变量名；如果冒号后是花括号，则意味着要赋予的最终值嵌套在对象内部更深的层级中

　　更进一步，也可以使用一个与对象属性名不同的局部变量名

```javascript
let node = {
    type: "Identifier",
    name: "foo",
    loc: {
        start: {
            line: 1,
            column: 1
        },
        end: {
            line: 1,
            column: 4
        }
    }
};
// 提取 node.loc.start
let { loc: { start: localStart }} = node;
console.log(localStart.line); // 1
console.log(localStart.column); // 1
```

　　在这个版本中，node.loc.start被存储在了新的局部变量localStart中。解构模式可以应用于任意层级深度的对象，且每一层都具备同等的功能

 

### 数组解构

　　与对象解构的语法相比，数组解构就简单多了，它使用的是数组字面量，且解构操作全部在数组内完成，而不是像对象字面量语法一样使用对象的命名属性

```javascript
let colors = [ "red", "green", "blue" ];
let [ firstColor, secondColor ] = colors;
console.log(firstColor); // "red"
console.log(secondColor); // "green"
```

　　在这段代码中，我们从colors数组中解构出了"red"和"green"这两个值，并分别存储在变量firstColor和变量secondColor中。在数组解构语法中，我们通过值在数组中的位置进行选取，且可以将其存储在任意变量中，未显式声明的元素都会直接被忽略

　　在解构模式中，也可以直接省略元素，只为感兴趣的元素提供变量名

```javascript
let colors = [ "red", "green", "blue" ];
let [ , , thirdColor ] = colors;
console.log(thirdColor); // "blue"
```

　　这段代码使用解构赋值语法从colors中获取第3个元素，thirdColor前的逗号是前方元素的占位符，无论数组中的元素有多少个，都可以通过这种方法提取想要的元素，不需要为每一个元素都指定变量名

【解构赋值】

　　数组解构也可用于赋值上下文，但不需要用小括号包裹表达式，这一点与对象解构不同

```javascript
let colors = [ "red", "green", "blue" ],
firstColor = "black",
secondColor = "purple";
[ firstColor, secondColor ] = colors;
console.log(firstColor); // "red"
console.log(secondColor); // "green"
```

　　这段代码中的解构赋值与上一个数组解构示例相差无几，唯一的区别是此处的firstColor变量和secondColor变量已经被定义了

【变量交换】

　　数组解构语法还有一个独特的用例：交换两个变量的值。在排序算法中，值交换是一个非常常见的操作，如果要在ES5中交换两个变量的值，则须引入第三个临时变量

```javascript
// 在 ES5 中互换值
let a = 1,
　　b = 2,
　　tmp;
tmp = a;
a = b;
b = tmp;
console.log(a); // 2
console.log(b); // 1
```

　　在这种变量交换的方式中，中间变量tmp不可或缺。如果使用数组解构赋值语法，就不再需要额外的变量了

```javascript
// 在 ES6 中互换值
let a = 1,
    b = 2;
[ a, b ] = [ b, a ];
console.log(a); // 2
console.log(b); // 1
```

　　在这个示例中，数组解构赋值看起来像是一个镜像：赋值语句左侧(也就是等号左侧)与其他数组解构示例一样，是一个解构模式；右侧是一个为交换过程创建的临时数组字面量。代码执行过程中，先解构临时数组，将b和a的值复制到左侧数组的前两个位置，最终结果是变量互换了它们的值

　　[注意]如果右侧数组解构赋值表达式的值为null或undefined，则会导致程序抛出错误

【默认值】

　　也可以在数组解构赋值表达式中为数组中的任意位置添加默认值，当指定位置的属性不存在或其值为undefined时使用默认值

```javascript
let colors = [ "red" ];
let [ firstColor, secondColor = "green" ] = colors;
console.log(firstColor); // "red"
console.log(secondColor); // "green"
```

　　在这段代码中，colors数组中只有一个元素，secondColor没有对应的匹配值，但是它有一个默认值"green"，所以最终secondColor的输出结果不会是undefined

【嵌套数组解构】

　　嵌套数组解构与嵌套对象解构的语法类似，在原有的数组模式中插入另一个数组模式，即可将解构过程深入到下一个层级

```javascript
let colors = [ "red", [ "green", "lightgreen" ], "blue" ];
// 随后
let [ firstColor, [ secondColor ] ] = colors;
console.log(firstColor); // "red"
console.log(secondColor); // "green"
```

　　在此示例中，变量secondColor引用的是colors数组中的值"green"，该元素包含在数组内部的另一个数组中，所以seconColor两侧的方括号是一个必要的解构模式。同样，在数组中也可以无限深入去解构，就像在对象中一样

【不定元素】

　　函数具有不定参数，而在数组解构语法中有一个相似的概念——不定元素。在数组中，可以通过...语法将数组中的其余元素赋值给一个特定的变量

```javascript
let colors = [ "red", "green", "blue" ];
let [ firstColor, ...restColors ] = colors;
console.log(firstColor); // "red"
console.log(restColors.length); // 2
console.log(restColors[0]); // "green"
console.log(restColors[1]); // "blue"
```

　　数组colors中的第一个元素被赋值给了firstColor，其余的元素被赋值给restColors数组，所以restColors中包含两个元素："green"和"blue"。不定元素语法有助于从数组中提取特定元素并保证其余元素可用

【数组复制】

　　在ES5中，开发者们经常使用concat()方法来克隆数组

```javascript
// 在 ES5 中克隆数组
var colors = [ "red", "green", "blue" ];
var clonedColors = colors.concat();
console.log(clonedColors); //"[red,green,blue]"
```

　　concat()方法的设计初衷是连接两个数组，如果调用时不传递参数就会返回当前函数的副本

　　在ES6中，可以通过不定元素的语法来实现相同的目标

```javascript
// 在 ES6 中克隆数组
let colors = [ "red", "green", "blue" ];
let [ ...clonedColors ] = colors;
console.log(clonedColors); //"[red,green,blue]"
```

　　在这个示例中，我们通过不定元素的语法将colors数组中的值复制到clonedColors数组中

　　[注意]在被解构的数组中，不定元素必须为最后一个条目，在后面继续添加逗号会导致程序抛出语法错误

 

### 混合解构

　　可以混合使用对象解构和数组解构来创建更多复杂的表达式，如此一来，可以从任何混杂着对象和数组的数据结构中提取想要的信息

```javascript
let node = {
    type: "Identifier",
    name: "foo",
    loc: {
        start: {
            line: 1,
            column: 1
        },
        end: {
            line: 1,
            column: 4
        }
    },
    range: [0, 3]
};
let {
    loc: { start },
    range: [ startIndex ]
} = node;
console.log(start.line); // 1
console.log(start.column); // 1
console.log(startIndex); // 0
```

　　这段代码分别将node.loc.start和node.range[0]提取到变量start和startlndex中

　　解构模式中的loc和range仅代表它们在node对象中所处的位置(也就是该对象的属性)。当使用混合解构的语法时，则可以从node提取任意想要的信息。这种方法极为有效，尤其是从JSON配置中提取信息时，不再需要遍历整个结构了

【解构参数】

　　解构可以用在函数参数的传递过程中，这种使用方式更特别。当定义一个接受大量可选参数的JS函数时，通常会创建一个可选对象，将额外的参数定义为这个对象的属性

```javascript
// options 上的属性表示附加参数
function setCookie(name, value, options) {
    options = options || {};
    let secure = options.secure,
        path = options.path,
        domain = options.domain,
        expires = options.expires;
        // 设置 cookie 的代码
}
// 第三个参数映射到 options
setCookie("type", "js", {
    secure: true,
    expires: 60000
});
```

　　许多JS库中都有类似的setCookie()函数，而在示例函数中，name和value是必需参数，而secure、path、domain和expires则不然，这些参数相对而言没有优先级顺序，将它们列为额外的命名参数也不合适，此时为options对象设置同名的命名属性是一个很好的选择。现在的问题是，仅查看函数的声明部分，无法辨识函数的预期参数，必须通过阅读函数体才可以确定所有参数的情况

　　如果将options定义为解构参数，则可以更清晰地了解函数预期传入的参数。解构参数需要使用对象或数组解构模式代替命名参数

```javascript
function setCookie(name, value, { secure, path, domain, expires }) {
// 设置 cookie 的代码
}
setCookie("type", "js", {
    secure: true,
    expires: 60000
});
```

　　这个函数与之前示例中的函数具有相似的特性，只是现在使用解构语法代替了第3个参数来提取必要的信息，其他参数保持不变，但是对于调用setCookie()函数的使用者而言，解构参数变得更清晰了

【必须传值的解构参数】

　　解构参数有一个奇怪的地方，默认情况下，如果调用函数时不提供被解构的参数会导致程序抛出错误

```javascript
// 出错！
setCookie("type", "js");
```

　　缺失的第3个参数，其值为undefined，而解构参数只是将解构声明应用在函数参数的一个简写方法，其会导致程序抛出错误。当调用setCookie()函数时，JS引擎实际上做了以下这些事情

```javascript
function setCookie(name, value, options) {
    let { secure, path, domain, expires } = options;
    // 设置 cookie 的代码
}
```

　　如果解构赋值表达式的右值为null或undefined，则程序会报错。同理，若调用setCookie()函数时不传入第3个参数，也会导致程序抛出错误

　　如果解构参数是必需的，大可忽略掉这些问题；但如果希望将解构参数定义为可选的，那么就必须为其提供默认值来解决这个问题

```javascript
function setCookie(name, value, { secure, path, domain, expires } = {}) {
    // ...
}
```

　　这个示例中为解构参数添加了一个新对象作为默认值，secure、path、domain及expires这些变量的值全部为undefined，这样即使在调用setCookie()时未传递第3个参数，程序也不会报错

【默认值】

　　可以为解构参数指定默认值，就像在解构赋值语句中那样，只需在参数后添加等号并且指定一个默认值即可

```javascript
function setCookie(name, value,
    {
        secure = false,
        path = "/",
        domain = "example.com",
        expires = new Date(Date.now() + 360000000)
    } = {}
) {
    // ...
}
```

　　在这段代码中，解构参数的每一个属性都有默认值，从而无须再逐一检查每一个属性是否都有默认值。然而，这种方法也有很多缺点。首先，函数声明变得比以前复杂了；其次，如果解构参数是可选的，那么仍然要给它添加一个空对象作为参数，否则像setCookie("type","js")这样的调用会导致程序抛出错误

　　对于对象类型的解构参数，最好为其赋予相同解构的默认参数

```javascript
function setCookie(name, value,
    {
        secure = false,
        path = "/",
        domain = "example.com",
        expires = new Date(Date.now() + 360000000)
    } = {
        secure : false,
        path : "/",
        domain : "example.com",
        expires : new Date(Date.now() + 360000000)        
    }
) {
    // ...
}
```

　　现在函数变得更加完整了，第一个对象字面量是解构参数，第二个为默认值。但是这会造成非常多的代码冗余，可以将默认值提取到一个独立对象中，并且使用该对象作为解构和默认参数的一部分，从而消除这些冗余

```javascript
const setCookieDefaults = {
    secure : false,
    path : "/",
    domain : "example.com",
    expires : new Date(Date.now() + 360000000)    
}
function setCookie(name, value,{
        secure = setCookieDefaults.secure,
        path = setCookieDefaults.path,
        domain = setCookieDefaults.domain,
        expires = setCookieDefaults.expires        
    }=setCookieDefaults) {
    // ...
}
```

　　在这段代码中，默认值已经被放到setCookieDefaults对象中，除了作为默认参数值外，在解构参数中可以直接使用这个对象来为每一个绑定设置默认参数。使用解构参数后，不得不面对处理默认参数的复杂逻辑，但它也有好的一面，如果要改变默认值，可以立即在setCookieDefaults中修改，改变的数据将自动同步到所有出现过的地方

 

### 其他解构

【字符串解构】

　　字符串也可以解构赋值。这是因为，字符串被转换成了一个类似数组的对象

```javascript
const [a, b, c, d, e] = 'hello';
console.log(a);//"h"
console.log(b);//"e"
console.log(c);//"l"
console.log(d);//"l"
console.log(e);//"o"
```

　　类似数组的对象都有一个`length`属性，因此还可以对这个属性解构赋值

```javascript
const {length} = 'hello';
console.log(length);//5
```

【数值和布尔值解构】

　　解构赋值时，如果等号右边是数值和布尔值，则会先转为对象

```javascript
let {toString:s1} = 123;
console.log(s1 === Number.prototype.toString);//true
let {toString:s2} = true;
console.log(s2 === Boolean.prototype.toString);//true
```

　　解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。由于`undefined`和`null`无法转为对象，所以对它们进行解构赋值，都会报错

```javascript
let { prop: x } = undefined; // TypeError
let { prop: y } = null; // TypeError
```



## ES6中的模块

JS用"共享一切"的方法加载代码，这是该语言中最易出错且容易令人感到困惑的地方。在ES6以前，在应用程序的每一个JS中定义的一切都共享一个全局作用域。随着web应用程序变得更加复杂，JS代码的使用量也开始增长，这一做法会引起问题，如命名冲突和安全问题。ES6的一个目标是解决作用域问题，也为了使JS应用程序显得有序，于是引进了模块。本文将详细介绍ES6中的模块

 

### 概述

　　模块是自动运行在严格模式下并且没有办法退出运行的JS代码。与共享一切架构相反的是，在模块顶部创建的变量不会自动被添加到全局共享作用域，这个变量仅在模块的顶级作用域中存在，而且模块必须导出一些外部代码可以访问的元素，如变量或函数。模块也可以从其他模块导入绑定

　　另外两个模块的特性与作用域关系不大，但也很重要。首先，在模块的顶部，this的值是undefined；其次，模块不支持HTML风格的代码注释，这是从早期浏览器残余下来的JS特性

　　脚本，也就是任何不是模块的JS代码，则缺少这些特性。模块和其他JS代码之间的差异可能乍一看不起眼，但是它们代表了JS代码加载和求值的一个重要变化。模块真正的魔力所在是仅导出和导入需要的绑定，而不是将所用东西都放到一个文件。只有很好地理解了导出和导入才能理解模块与脚本的区别

###  导出

　　可以用export关键字将一部分己发布的代码暴露给其他模块，在最简单的用例中，可以将export放在任何变量、函数或类声明的前面，以将它们从模块导出

```javascript
// 导出数据
export var color = "red";
export let name = "Nicholas";
export const magicNumber = 7;
// 导出函数
export function sum(num1, num2) {
    return num1 + num1;
}
// 导出类
export class Rectangle {
    constructor(length, width) {
        this.length = length;
        this.width = width;
    }
}
// 此函数为模块私有
function subtract(num1, num2) {
    return num1 - num2;
}
// 定义一个函数……
function multiply(num1, num2) {
    return num1 * num2;
}
// ……稍后将其导出
export { multiply };
```

　　在这个示例中需要注意几个细节，除了export关键字外，每一个声明与脚本中的一模一样。因为导出的函数和类声明需要有一个名称，所以代码中的每一个函数或类也确实有这个名称。除非用default关键字，否则不能用这个语法导出匿名函数或类

　　另外，在定义multiply()函数时没有马上导出它。由于不必总是导出声明，可以导出引用，因此这段代码可以运行。此外，这个示例并未导出subtract()函数，任何未显式导出的变量、函数或类都是模块私有的，无法从模块外部访问



### 导入

　　从模块中导出的功能可以通过import关键字在另一个模块中访问，import语句的两个部分分别是要导入的标识符和标识符应当从哪个模块导入

　　这是该语句的基本形式

```javascript
import { identifier1, identifier2 } from "./example.js";
```

　　`import` 后面的大括号表示从给定模块导入的绑定(binding)，关键字from表示从哪个模块导入给定的绑定，该模块由表示模块路径的字符串指定(被称作模块说明符)。浏览器使用的路径格式与传给 `script` 元素的相同，也就是说，必须把文件扩展名也加上。另一方面，Nodejs则遵循基于文件系统前缀区分本地文件和包的惯例。例如，example是一个包而./example.js是一个本地文件

　　当从模块中导入一个绑定时，它就好像使用const定义的一样。无法定义另一个同名变量(包括导入另一个同名绑定)，也无法在import语句前使用标识符或改变绑定的值

【导入单个绑定】

　　假设前面的示例在一个名为"example.js"的模块中，我们可以导入并以多种方式使用这个模块中的绑定

```javascript
// 单个导入
import { sum } from "./example.js";
console.log(sum(1, 2)); // 3
sum = 1; // 出错
```

　　尽管example.js导出的函数不止一个，但这个示例导入的却只有sum()函数。如果尝试给sum赋新值，结果是抛出一个错误，因为不能给导入的绑定重新赋值

　　为了最好地兼容多个浏览器和Node.js环境，一定要在字符串之前包含/、./或../来表示要导入的文件

【导入多个绑定】

　　如果想从示例模块导入多个绑定，则可以明确地将它们列出如下

```javascript
// 多个导入
import { sum, multiply, magicNumber } from "./example.js";
console.log(sum(1, magicNumber)); // 8
console.log(multiply(1, 2)); // 2
```

　　在这段代码中，从example模块导入3个绑定sum、multiply和magicNumber。之后使用它们，就像它们在本地定义的一样

【导入整个模块】

　　特殊情况下，可以导入整个模块作为一个单一的对象。然后所有的导出都可以作为对象的属性使用

```javascript
// 完全导入
import * as example from "./example.js";
console.log(example.sum(1,example.magicNumber)); // 8
console.log(example.multiply(1, 2)); // 2
```

　　在这段代码中，从example.js中导出的所有绑定被加载到一个被称作example的对象中。指定的导出(sum()函数、mutiply()函数和magicNumber)之后会作为example的属性被访问。这种导入格式被称作命名空间导入(namespaceimport)。因为example.js文件中不存在example对象，故而它作为example.js中所有导出成员的命名空间对象而被创建

　　但是，不管在import语句中把一个模块写了多少次，该模块将只执行一次。导入模块的代码执行后，实例化过的模块被保存在内存中，只要另一个import语句引用它就可以重复使用它

```javascript
import { sum } from "./example.js";
import { multiply } from "./example.js";
import { magicNumber } from "./example.js";
```

　　尽管在这个模块中有3个import语句，但example加载只执行一次。如果同一个应用程序中的其他模块也从example.js导入绑定，那么那些模块与此代码将使用相同的模块实例

【导入绑定的一个微妙怪异之处】

　　ES6的import语句为变量、函数和类创建的是只读绑定，而不是像正常变量一样简单地引用原始绑定。标识符只有在被导出的模块中可以修改，即便是导入绑定的模块也无法更改绑定的值

```javascript
export var name = "huochai";
export function setName(newName) {
    name = newName;
}
```

　　当导入这两个绑定后，setName()函数可以改变name的值

```javascript
import { name, setName } from "./example.js";
console.log(name); // "huochai"
setName("match");
console.log(name); // "match"
name = "huochai"; // error
```

　　调用setName("match")时会回到导出setName()的模块中去执行，并将name设置为"match"。此更改会自动在导入的name绑定上体现。其原因是，name是导出的name标识符的本地名称。本段代码中所使用的name和模块中导入的name不是同一个



### 重命名

　　有时候，从一个模块导入变量、函数或者类时，可能不希望使用它们的原始名称。幸运的是，可以在导出过程和导入过程中改变导出元素的名称

　　假设要使用不同的名称导出一个函数，则可以用as关键字来指定函数在模块外的名称

```javascript
function sum(num1, num2) {
    return num1 + num2;
}
export { sum as add };
```

　　在这里，函数sum()是本地名称，add()是导出时使用的名称。也就是说，当另一个模块要导入这个函数时，必须使用add这个名称

```javascript
import { add } from "./example.js";
```

　　如果模块想使用不同的名称来导入函数，也可以使用as关键字

```javascript
import { add as sum } from "./example.js";
console.log(typeof add); // "undefined"
console.log(sum(1, 2)); // 3
```

　　这段代码导入add()函数时使用了一个导入名称来重命名sum()函数(当前上下文中的本地名称)。导入时改变函数的本地名称意味着即使模块导入了add()函数，在当前模块中也没有add()标识符



### 默认值

　　由于在诸如CommonJS的其他模块系统中，从模块中导出和导入默认值是一个常见的做法，该语法被进行了优化。模块的默认值指的是通过default关键字指定的单个变量、函数或类，只能为每个模块设置一个默认的导出值，导出时多次使用default关键字是一个语法错误

【导出默认值】

　　下面是一个使用default关键字的简单示例

```javascript
export default function(num1, num2) {
    return num1 + num2;
}
```

　　这个模块导出了一个函数作为它的默认值，default关键字表示这是一个默认的导出，由于函数被模块所代表，因而它不需要一个名称

　　也可以在export default之后添加默认导出值的标识符，就像这样

```javascript
function sum(num1, num2) {
    return num1 + num2;
}
export default sum;
```

　　先定义sum()函数，然后再将其导出为默认值，如果需要计算默认值，则可以使用这个方法。为默认导出值指定标识符的第三种方法是使用重命名语法，如下所示

```javascript
function sum(num1, num2) {
    return num1 + num2;
}
export { sum as default };
```

　　在重命名导出时标识符default具有特殊含义，用来指示模块的默认值。由于default是JS中的默认关键字，因此不能将其用于变量、函数或类的名称；但是，可以将其用作属性名称。所以用default来重命名模块是为了尽可能与非默认导出的定义一致。如果想在一条导出语句中同时指定多个导出(包括默认导出)，这个语法非常有用

【导入默认值】

　　可以使用以下语法从一个模块导入一个默认值

```javascript
// 导入默认值
import sum from "./example.js";
console.log(sum(1, 2)); // 3
```

　　这条import语句从模块example.js中导入了默认值，请注意，这里没有使用大括号，与非默认导入的情况不同。本地名称sum用于表示模块导出的任何默认函数，这种语法是最纯净的，ES6的创建者希望它能够成为web上主流的模块导入形式，并且可以使用已有的对象

　　对于导出默认值和一或多个非默认绑定的模块，可以用一条语句导入所有导出的绑定

```javascript
export let color = "red";
export default function(num1, num2) {
    return num1 + num2;
}
```

　　可以用以下这条import语句导入color和默认函数

```javascript
import sum, { color } from "./example.js";
console.log(sum(1, 2)); // 3
console.log(color); // "red"
```

　　用逗号将默认的本地名称与大括号包裹的非默认值分隔开

　　[注意]在import语句中，默认值必须排在非默认值之前

　　与导出默认值一样，也可以在导入默认值时使用重命名语法

```javascript
// 等价于上个例子
import { default as sum, color } from "example";
console.log(sum(1, 2)); // 3
console.log(color); // "red"
```

　　在这段代码中，默认导出(export)值被重命名为sum，并且还导入了color



### 静态加载

 　ES6中的模块与node.js中的模块加载不同，nodeJS中的require语句是运行时加载，而ES6中的import是静态加载，所以有一些语法限制

　　1、不能使用表达式和变量等这些只有在运行时才能得到结果的语法结构

```javascript
// 报错
import { 'f' + 'oo' } from 'my_module';

// 报错
let module = 'my_module';
import { foo } from module;
```

　　2、`import`和`export`命令只能在模块的顶层，不能在代码块之中，如不能在if语句和函数内使用

```javascript
if (flag) {
    export flag; // 语法错误
}

// 报错
if (x === 1) {
  import { foo } from 'module1';
} else {
  import { foo } from 'module2';
}
function tryImport() {
    import flag from "./example.js"; // 语法错误
}
```

　　以上的写法会报错，是因为在静态分析阶段，这些语法都是没法得到值的

　　这样的设计，固然有利于编译器提高效率，但也导致无法在运行时加载模块。在语法上，条件加载就不可能实现。如果`import`命令要取代 Node 的`require`方法，这就形成了一个障碍。因为`require`是运行时加载模块，`import`命令无法取代`require`的动态加载功能

```javascript
const path = './' + fileName;
const myModual = require(path);
```

　　上面的语句就是动态加载，`require`到底加载哪一个模块，只有运行时才知道。`import`语句做不到这一点



### 重新导出

　　可能需要重新导出模块已经导入的内容

```javascript
import { sum } from "./example.js";
export { sum }
```

　　虽然这样可以运行，但只通过一条语句也可以完成同样的任务

```javascript
export { sum } from "./example.js";
```

　　这种形式的export在指定的模块中查找sum声明，然后将其导出。当然，对于同样的值也可以不同的名称导出

```javascript
export { sum as add } from "./example.js";
```

　　这里的sum是从example.js导入的，然后再用add这个名字将其导出

　　如果想导出另一个模块中的所有值，则可以使用*模式

```javascript
export * from "./example.js";
```

　　导出一切是指导出默认值及所有命名导出值，这可能会影响可以从模块导出的内容。例如，如果example.js有默认的导出值，则使用此语法时将无法定义一个新的默认导出 



### 无绑定导入

　　某些模块可能不导出任何东西，相反，它们可能只修改全局作用域中的对象。尽管模块中的顶层变量、函数和类不会自动地出现在全局作用域中，但这并不意味着模块无法访问全局作用域。内建对象(如Array和Object)的共享定义可以在模块中访问，对这些对象所做的更改将反映在其他模块中

　　例如，要向所有数组添加pushAll()方法，则可以定义如下所示的模块

```javascript
// 没有导出与导入的模块
Array.prototype.pushAll = function(items) {
    // items 必须是一个数组
    if (!Array.isArray(items)) {
        throw new TypeError("Argument must be an array.");
    }
    // 使用内置的 push() 与扩展运算符
    return this.push(...items);
};
```

　　即使没有任何导出或导入的操作，这也是一个有效的模块。这段代码既可以用作模块也可以用作脚本。由于它不导出任何东西，因而可以使用简化的导入操作来执行模块代码，而且不导入任何的绑定

```javascript
import "./example.js";
let colors = ["red", "green", "blue"];
let items = [];
items.pushAll(colors);
```

　　这段代码导入并执行了模块中包含的pushAll()方法，所以pushAll()被添加到数组的原型，也就是说现在模块中的所有数组都可以使用pushAll()方法了

　　[注意]无绑定导入最有可能被应用于创建polyfill和Shim



### 总结

　　下面对AMD、CMD、CommonJS和ES6的module进行总结对比

　　AMD是requireJS在推广过程中对模块定义的规范化产出。AMD是一个规范，只定义语法API，而requireJS是具体的实现。类似于ECMAScript和javascript的关系

　　由下面代码可知，AMD的特点是依赖前置，对于依赖的模块提前执行

```javascript
// AMD
define(['./a', './b'], function(a, b) {  // 依赖必须一开始就写好
    a.doSomething()    
    // 此处略去 n 行    
    b.doSomething()    
    ...
})
```

　　CMD 是 SeaJS 在推广过程中对模块定义的规范化产出，它的特点是依赖就近，对于依赖的模块延迟执行

```javascript
// CMD
define(function(require, exports, module) { 
    var a = require('./a')
     a.doSomething()  
    // 此处略去 n 行   
    var b = require('./b') // 依赖可以就近书写  
    b.doSomething()   
    // ... 
})
```

　　CommonJS规范主要在NodeJS后端使用，前端浏览器不支持该规范

```javascript
// math.js
exports.add = function () {
    var sum = 0, i = 0,args = arguments, l = args.length;
    while (i < l) {
        sum += args[i++];
    }
    return sum;
};
// program.js
var math = require('math');
exports.increment = function (val) {
    return math.add(val, 1);
};
```

　　ES6的Module模块主要通过export和import来进行模块的导入和导出

~~~javascript
//example.js
export default function(num1, num2) {
    return num1 + num2;
}
// 导入默认值
import sum from "./example.js";
console.log(sum(1, 2)); // 3

~~~



## Promise和异步编程
### 异步编程的背景知识

`JavaScript`引擎是基于单线程事件循环的概念创建的，同一时间只允许一个代码块在执行，所以需要跟踪即将运行的代码。那些代码被放在一个叫做任务队列中，每当一段代码准备执行时，都会被添加到任务队列中。每当`JavaScript`引擎中的一段代码结束执行，事件循环会执行队列中的下一个任务，它是`JavaScript`引擎中的一段程序，负责监控代码执行并管理任务队列。

#### 事件模型

当用户点击按钮或者按下键盘上的按键时会触发类似`onClick`这样的事件，它会向任务队列添加一个新任务来响应用户的操作，这是`JavaScript`中最基础的异步编程模式，直到事件触发时才执行事件处理程序，且执行上下文与定义时的相同。

```js
let button = document.getElemenetById('myBtn')
button.onClick = function () {
  console.log('click!')
}
```

事件模型适用于处理简单的交互，然而将多个独立的异步调用连接在一起会使程序更加复杂，因为我们必须跟踪每个事件的事件目标。

#### 回调模式

`Node.js`通过普及回调函数来改进异步编程模型，回调函数与事件模型类似，异步代码都会在未来的某个时间点执行，二者的区别是回调模式中被调用的函数是作为参数传入的，如下：

```js
readFile('example.pdf', function(err, contents) {
  if (err) {
    throw err
  }
  console.log(contents)
})
```

我们可以发现回调模式比事件模型更灵活，因此通过回调模式链接多个调用更容易：

```js
readFile('example.pdf', function(err, contents) {
  if (err) {
    throw err
  }
  writeFile('example.pdf', function(err, contents) {
    if (err) {
      throw err
    }
    console.log('file was written!')
  })
})
```

我们可以发现，通过回调嵌套的形式，可以帮助我们解决许多问题，然而随着模块越来越复杂，回调模式需要嵌套的函数也越来越多，就形成了回调地狱，如下：

```js
method1(function(err, result) {
  if (err) {
    throw err
  }
  method2(function(err, result) {
    if (err) {
      throw err
    }
    method3(function(err, result) {
      if (err) {
        throw err
      }
      method4(function(err, result) {
        if (err) {
          throw err
        }
        method5(result)
      })
    })
  })
})
```

### Promise基础

`Promise`相当于异步操作结果的占位符，它不会去订阅一个事件，也不会传递一个回调函数给目标函数，而是让函数返回一个`Promise`。

#### Promise的生命周期

每个`Promise`都会经历一个短暂的生命周期： 先是处于`pending`进行中的状态，此时操作尚未完成，所以它也是未处理状态的，一旦操作执行结束，`Promise`则变为已处理。操作结束后，`Promise`可能会进入到以下两个状态中的其中一个：

- `Fulfilled`：异步操作成功完成。
- `Rejected`：由于程序错误或者一些其他原因，异步操作未能成功完成。

根据以上介绍的状态，`Promise`的内部属性`[[PromiseState]]`被用来表示这三种状态：`pending`、`fulfilled`和`rejected`。这个属性不会暴露在`Promise`对象上，所以不能通过编码的方式检测`Promise`的状态。

#### Promise.then()方法

我们已经知道，`Promise`会在操作完成之后进入`Fulfilled`和`Rejected`其中一个，而`Promise`提供了`Promise.then()`方法。它有两个参数，第一个是`Promise`的状态变为`fulfilled`时要调用的函数，第二个是当`Promise`状态变为`rejected`时调用的函数，其中这两个参数都是可选的。

TIP

如果一个对象实现了上述`.then()`方法，那么这个对象我们称之为`thenable`对象。

```js
let Promise = readFile('example.pdf')
// 同时提供执行完成和执行被拒的回调
Promise.then(function(content) {
  console.log('complete')
}, function(err) {
  console.log(err.message)
})
// 仅提供完成的回调
Promise.then(function(content) {
  console.log('complete')
})
// 仅提供被拒的回调
Promise.then(null, function(err) {
  console.log(err.message)
})
```

#### Promise.catch()方法

`Promise`还有一个`catch()`方法，相当于只给其传入拒绝处理程序的`then()`方法，所以和以上最后一个例子等价的`catch()`代码如下：

```js
promise.catch(function(err) {
  console.log(err.message)
})
// 等价于
Promise.then(null, function(err) {
  console.log(err.message)
})
```

`then()`方法和`catch()`方法一起使用才能更好的处理异步操作结果。这套体系能够清楚的指明操作结果是成功还是失败，比事件和回调函数更好用。如果使用事件，在遇到错误时不会主动触发；如果使用回调函数，则必须要记得每次都检查错误参数。如果不给`Promise`添加拒绝处理程序，那所有失败就自动被忽略。

#### 创建未完成的Promise

用`Promise`构造函数可以创建新的`Promise`，构造函数只接受一个参数：包含初始化`Promise`代码的执行器函数。执行器函数接受两个参数，分别是`resolve`函数和`reject`函数。执行器成功完成时调用`resolve`函数，失败时则调用`reject`函数。

```js
let fs = require('fs')
function readFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, function (err, contents) {
      if (err) {
        reject(err)
        return
      }
      resolve(contents)
    })
  })
}
let promise = readFile('example.pdf')
promise.then((contents) => {
  console.log(contents)
}, (err) => {
  console.log(err.message)
})
```

#### 创建已处理的Promise

`Promise.resolve()`方法只接受一个参数并返回一个完成态的`Promise`，该方法永远不会存在拒绝状态，因而该`Promise`的拒绝处理程序永远不会被调用。

```js
let promise = Promise.resolve(123)
promise.then(res => {
  console.log(res) // 123
})
```

可以使用`Promise.reject()`方法来创建已拒绝`Promise`，它与`Promise.resolve()`方法很像，唯一的区别是创建出来的是拒绝态的`Promise`。

```js
let promise = Promise.reject(123)
promise.catch((err) => {
  console.log(err) // 123
})
```

#### 非Promise的Thenable对象

`Promise.resolve()`方法和`Promise.reject()`方法都可以接受非`Promise`的`thenable`对象作为参数。如果传入一个非`Promise`的`thenable`对象，则这些方法会创建一个新的`Promise`，并在`then()`函数中被调用。
拥有`then()`方法并且接受`resolve`和`reject`这两个参数的普通对象就是非`Promise`的`Thenable`对象。

```js
let thenable = {
  then (resolve, reject) {
    resolve(123)
  }
}
let promise1 = Promise.resolve(thenable)
promise1.then((res) => {
  console.log(res) // 123
})
```

#### 执行器错误

如果执行器内部抛出一个错误，则`Promise`的拒绝处理程序就会被调用。

```js
let promise = new Promise((resolve, reject) => {
  throw new Error('promise err')
})
promise.catch((err) => {
  console.log(err.message) // promise err
})
```

代码分析：在上面这段代码中，执行器故意抛出了一个错误，每个执行器中都隐含一个`try-catch`块，所以错误会被捕获并传入拒绝处理程序，以上代码等价于：

```js
let promise = new Promise((resolve, reject) => {
  try {
    throw new Error('promise err')
  } catch (ex) {
    reject(ex)
  }
})
promise.catch((err) => {
  console.log(err.message) // promise err
})
```

### 串联Promise

每当我们调用`then()`或者`catch()`方法时实际上创建并返回了另一个`Promise`，只有当第一个`Promise`完成或被拒绝后，第二个才会被解决。这给了我们可以将`Promise`串联起来实现更复杂的异步特性的方法。

```js
let p1 = new Promise((resolve, reject) => {
  resolve(123)
})
p1.then(res => {
  console.log(res)      // 123
}).then(res => {
  console.log('finish') // finish
})
```

如果我们将以上例子拆解开来，那么会是如下的情况：

```js
let p1 = new Promise((resolve, reject) => {
  resolve(123)
})
let p2 = p1.then(res => {
  console.log(res)      // 123
})
p2.then(res => {
  console.log('finish') // finish
})
```

#### 串联Promise中捕获错误

我们已经知道，一个`Promise`的完成处理程序或者拒绝处理程序都有可能发生错误，而在`Promise`链中是可以捕获这些错误的：

```js
let p1 = new Promise((resolve, reject) => {
  resolve(123)
})
p1.then(res => {
  throw new Error('error')
}).catch(error => {
  console.log(error.message)  // error
})
```

不仅可以捕获到`then()`方法中的错误，还可以捕获到`catch()`方法中的错误：

```js
let p1 = new Promise((resolve, reject) => {
  resolve(123)
})

p1.then(res => {
  throw new Error('error then')
}).catch(error => {
  console.log(error.message)  // error then
  throw new Error('error catch')
}).catch(error => {
  console.log(error.message)  // error catch
})
```

#### Promise链返回值

`Promise`链的一个重要特性就是可以给下游的`Promise`传递值。

```js
let p1 = new Promise((resolve, reject) => {
  resolve(1)
})
p1.then(res => {
  console.log(res)  // 1
  return res + 1
}).then(res => {
  console.log(res)  // 2
  return res + 2
}).then(res => {
  console.log(res)  // 4
})
```

#### 在Promise链中返回Promise

我们在上面的例子中已经知道了，可以给下游的`Promise`传递值，但如果我们`return`的是另外一个`Promise`对象又该如何去走呢？实际上，这取决于这个`Promise`是完成还是拒绝，完成则会调用`then()`，拒绝则会调用`catch()`

```js
let p1 = new Promise((resolve, reject) => {
  resolve(1)
})
let p2 = new Promise((resolve, reject) => {
  resolve(2)
})
let p3 = new Promise((resolve, reject) => {
  reject(new Error('error p3'))
})
p1.then(res => {
  console.log(res)            // 1
  return p2
}).then(res => {
  // p2完成，会调用then()
  console.log(res)            // 2
})

p1.then(res => {
  console.log(res)            // 1
  return p3
}).catch((error) => {
  // p3拒绝，会调用catch()
  console.log(error.message)  // error p3
})
```

### 响应对个Promise

#### Promise.all()方法

特点：`Promise.all()`方法只接受一个参数并返回一个`Promise`，且这个参数必须为一个或者多个`Promise`的可迭代对象(例如数组)，只有当这个参数中的所有`Promise`对象全部被解决后才返回这个`Promise`。另外一个地方值得注意的是：`Promise`返回值，是按照参数数组中的`Promise`顺序存储的，所以可以根据`Promise`所在参数中的位置的索引去最终结果的`Promise`数组中进行访问。

```js
let p1 = new Promise((resolve, reject) => {
  resolve(1)
})
let p2 = new Promise((resolve, reject) => {
  resolve(2)
})
let p3 = new Promise((resolve, reject) => {
  resolve(3)
})
let pAll = Promise.all([p1, p2, p3])
pAll.then(res => {
  console.log(res[0]) // 1：对应p1的结果
  console.log(res[1]) // 2：对应p2的结果
  console.log(res[2]) // 3：对应p3的结果
})
```

#### Promise.race()方法

特点：`Promise.race()`方法和`Promise.all()`方法对于参数是一致的，但是在行为和结果上有一点差别：`Promise.race()`方法接受参数数组，只要数组中的任意一个`Promise`被完成，那么`Promise.race()`方法就返回，所以`Promise.race()`方法的结果只有一个，也就是最先被解决的`Promise`的结果。

```js
let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  }, 100)
})
let p2 = new Promise((resolve, reject) => {
  resolve(2)
})
let p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(3)
  }, 100)
})
let pRace = Promise.race([p1, p2, p3])
pRace.then(res => {
  console.log(res) // 2 对应p2的结果
})
```

### 自Promise继承

`Promise`与其他内建类型一样，也是可以当做基类派生其他类的。

```js
class MyPromise extends Promise {
  // 派生Promise，并添加success方法和failure方法
  success(resolve, reject) {
    return this.then(resolve, reject)
  }
  failure(reject) {
    return this.catch(reject)
  }
}
let p1 = new MyPromise((resolve, reject) => {
  resolve(1)
})
let p2 = new MyPromise((resolve, reject) => {
  reject(new Error('mypromise error'))
})
p1.success(res => {
  console.log(res)            // 1
})
p2.failure(error => {
  console.log(error.message)  // mypromise error
})
```


## 代理(Proxy)和反射(Reflect)API
