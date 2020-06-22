## 深入理解javascript作用域 - 块作用域

尽管函数作用域是最常见的作用域单元，也是现行大多数javascript最普遍的设计方法，但其他类型的作用域单元也是存在的，并且通过使用其他类型的作用域单元甚至可以实现维护起来更加优秀、简洁的代码，比如块作用域。随着ES6的推广，块作用域也将用得越来越广泛。



尽管你可能连一行带有块作用域风格的代码都没有写过，但对下面这种很常见的 javascript 代码一定很熟悉。

~~~javascript
for (var i = 0; i < 10; i++) {
    console.log(i)
}
~~~

我们在 for 循环的头部直接定义了变量 i ，通常是因为只想在for循环内部的上下文中使用变量i，而忽略了 i  会被绑定在外部作用域（函数或全局）中的事实。



这就是块作用域的用处，变量的声明应该距离使用的地方越近越好，并最大限度的本地化。

另外一个例子：

~~~javascript
var foo = true

if (foo) {
    var bar = foo * 2
    console.log(bar)
}
~~~

bar 变量仅在 if 声明的上下文中使用，因此如果能将它声明在 if 块内部中会是一个很有意义的事情。但是，当使用 var 声明变量时，他写在哪里都是一样的，因为他们最终都会属于外部作用域。

+ 块作用域是一个用来对之前的最小授权原则进行扩展的工具，将代码从在函数中隐藏信息扩展为在块中隐藏信息。



## try/catch

try-catch语句的一个常见用途是创建块级作用域，其中声明的变量仅仅在catch内部有效

~~~javascript
{
    let a = 2;
    console.log(a); // 2
}
console.log(a); //ReferenceError: a is not defined
~~~



在ES6之前的环境中，可以使用try-catch语句达到上面代码的类似效果

~~~javascript
try{
    throw 2;
}catch(a){
    console.log( a ); // 2
}
console.log( a ); //ReferenceError: a is not defined
~~~



~~~javascript
try{
    throw undefined;
}catch(a){
    a = 2;
    console.log( a ); // 2
}
console.log( a ); //ReferenceError: a is not defined
~~~



## let

ES6改变了现状，引入了新的let关键字，提供了除var以外的另一种变量声明方式。let关键字可以将变量绑定到所在的任意作用域中(通常是{...}内部)，实现块作用域。

换句话说，let 为其声明的变量隐式地劫持了所在的块作用域。

~~~javascript
{
  let i = 1;  
};
console.log(i);//ReferenceError: i is not defined
~~~

用 let 将变量附加在一个块作用域上的行为是隐式的。在开发和修改代码的过程中，如果没有密切关注哪些块作用域中有绑定的变量，并且习惯性地移动这些块或者将其包含在其他的块中，就会导致代码变得混乱。



如果将文章最开始那段for循环的代码中变量i用let声明，将会避免作用域污染问题

~~~javascript
for (let i= 0; i<10; i++) {
     console.log(i);
}
console.log(i);////ReferenceError: i is not defined
~~~

　for循环头部的let不仅将i绑定到了for循环的块中，事实上它将其重新绑定到了循环的每一个迭代中，确保使用上一个循环迭代结束时的值重新进行赋值

通过另一种方式来说明每次迭代时进行重新绑定的行为

~~~javascript
//与上一段代码等价
{
    let j;
    for (j=0; j<10; j++) {
        let i = j; //每个迭代重新绑定
        console.log( i );
    }
}
~~~



下面代码中，由于闭包只能取得包含函数中的任何变量的最后一个值，所以控制台输出5，而不是0

~~~javascript
var a = [];
for(var i = 0; i < 5; i++){
    a[i] = function(){
        return i;
    }
}
console.log(a[0]());//5
~~~



当然，可以通过函数传参，来保存每次循环的值

~~~javascript
var a = [];
for(var i = 0; i < 5; i++){
    a[i] = (function(j){
        return function(){
            return j;
        }
    })(i);
}
console.log(a[0]());//0
~~~



而使用let则更方便，由于let循环有一个重新赋值的过程，相当于保存了每一次循环时的值

~~~javascript
var a = [];
for(let i = 0; i < 5; i++){
    a[i] = function(){
        return i;
    }
}
console.log(a[0]());//0
~~~



## const

除了let以外，ES6还引入了const，同样可以用来创建块作用域变量，但其值是固定的（常量）。之后任何试图修改值的操作都会引起错误

~~~javascript
if (true) {
    var a = 2;
    const b = 3; 
    a = 3; 
    b = 4;// TypeError: Assignment to constant variable
}
console.log( a ); // 3
console.log( b ); // ReferenceError: b is not defined
~~~



const声明的常量，也与let一样不可重复声明

~~~javascript
const message = "Goodbye!";
const message = "Goodbye!";//SyntaxError: Identifier 'message' has already been declared
~~~













