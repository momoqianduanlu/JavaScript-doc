## 深入理解javascript作用域 - 提升

直觉上会认为 javascript 代码在执行时是由上到下一行一行执行的。但实际上这并不完全正确，有一种特殊的情况会导致这个假设是错误的。



## 变量声明提升

考虑一下代码：

~~~javascript
a = 2 ;
var a;
console.log( a );
~~~

直觉上，会认为是undefined，因为var a声明在a = 2;之后，可能变量被重新赋值了，因为会被赋予默认值undefined。但是，真正的输出结果是2



~~~javascript
console.log( a ) ;
var a  =  2 ;
~~~

鉴于上面的特点，可能会认为这个代码片段也会同样输出2。但，真正的输出结果是undefined



所有这些和观感相违背的原因是在于编译器的编译过程

[第一篇](http://www.cnblogs.com/xiaohuochai/p/5699739.html)介绍过作用域的内部原理。引擎会在解释javascript代码之前首先对其进行编译。编译阶段中的一部分工作就是找到所有的声明，并用合适的作用域将它们关联起来。第二章中展示了这个机制，也正是此法作用域的核心内容。

因此，正确的思考思路是，包括变量和函数在内的所有声明都会在任何代码被执行前首先被处理。



当你看到 var a = 2；时，可能会认为这是一个声明，但 javascript 实际上会将其看成两个声明； var a 和 a = 2；。第一个定义声明是在编译阶段进行的。第二个赋值声明会被留在原地等待执行阶段。

我们的第一个代码片段会以如下形式进行处理：

~~~javascript
var a;
a = 2 ;
console.log(a);
~~~

其中第一部分是编译，而第二部分是执行。



类似的，我们的第二个代码片段实际是按照以下流程处理的；

~~~javascript
var a
console.log(a);
a = 2
~~~



这个过程就好像变量和函数声明从它们在代码中出现的位置被“移动”到了最上面，这个过程就叫作**提升**(hoisting)。



+ 只有声明本身会提升，而赋值或其他运行逻辑会留在原地。如果提升改变了代码的执行顺序，会造成非常严重的破坏。



另外值得注意的是，每个作用域都会进行提升操作

~~~javascript
console.log(a);
var a = 0;
function fn(){
    console.log(b);
    var b = 1;
    function test(){
        console.log(c);
        var c = 2;
    }
    test();
}
fn();
~~~



~~~javascript
//变量声明提升后，变成下面这样
var a ;
console.log(a);
a = 0;
function fn(){
    var b;
    console.log(b);
    b = 1;
    function test(){
        var c ;
        console.log(c);
        c = 2;
    }
    test();
}
fn();
~~~



## 函数声明提升

声明包括两种：变量声明和函数声明。不仅变量声明可以提升，函数声明也有提升操作

~~~javascript
foo();
function foo(){
    console.log(1);//1
}
~~~

上面这个代码片段之所以能够在控制台输出1，就是因为foo()函数声明进行了提升，如下所示：

~~~javascript
function foo(){
    console.log(1);
}
foo();
~~~



函数声明会被提升，但是函数表达式却不会被提升。

~~~javascript
foo();
var foo = function(){
    console.log(1);//TypeError: foo is not a function
}
~~~

这段程序中的变量标识符foo被提升并分配给全局作用域，因此foo()不会导致ReferenceError。但是foo此时并没有赋值，foo()由于对undefined值进行函数调用而导致非法操作，因此会抛出TypeError异常

~~~javascript
//变量提升后，代码如下所示：
var foo;
foo();
foo = function(){
    console.log(1);
}
~~~



即使是具名的函数表达式也无法被提升

~~~javascript
foo();//TypeError: foo is not a function
var foo = function bar(){
      console.log(1);
};
~~~



~~~javascript
//声明提升后，代码变为:
var foo;
foo();//TypeError: foo is not a function
foo = function bar(){
      console.log(1);
};
~~~



函数表达式的名称只能在函数体内部使用，而不能在函数体外部使用

~~~javascript
foo() //TypeError
bar() //ReferenceError

var foo = function bar(){
    console.log(1);
};
~~~





## 函数优先

**函数声明和变量声明都会被提升。但是函数会首先被提升，然后才是变量。函数声明会覆盖变量声明。**

考虑以下代码：

~~~javascript
foo() // 1

var foo

function foo () {
	console.log(1)
}

foo = function (){
      console.log(2)
}
~~~

会输出1不是2！这个代码片段会被引擎理解为如下形式：

~~~javascript
function foo () {
	console.log(1)
}

foo() // 1

foo = function (){
      console.log(2)
}
~~~

注意，var foo 尽管出现在 function foo()... 的声明之前，但他是重复声明的（因此被忽略了），因为函数声明会被提升到普通变量之前。



但是，如果变量存在赋值操作，则最终的值为变量的值

```javascript
var a=1;
function a(){}
console.log(a);//1
```

~~~javascript
var a;
function a(){};
console.log(a);//'function a(){}'
a = 1;
console.log(a);//1
~~~





**变量的重复声明是无用的，但函数的重复声明会覆盖前面的声明(无论是变量还是函数声明)**

+ 尽管 var 声明会被忽略掉，但是后面的函数声明会覆盖前面的函数声明

~~~javascript
a();//2
function a(){
    console.log(1);
}
function a(){
    console.log(2);
}
~~~



+ 变量的重复声明无用

~~~javascript
var a = 1;
var a;
console.log(a);//1
~~~



+ 由于函数声明提升优先于变量声明提升，所以变量的声明无作用

~~~javascript
var a;
function a(){
    console.log(1);
}
a();//1
~~~





