# es6的模块化

在之前的javascript中是没有模块化概念的。如果要进行模块化操作，需要引入第三方的类库。随着技术的发展，前后端分离，前端的业务变的越来越复杂化。直至ES6带来了模块化，才让javascript第一次支持了module。ES6的模块化分为导出（export）与导入（import）两个模块。

在 ES6 之前，社区制定了一些模块化加载方案，最主要的有 CommonJs 和 AMD 两种。前者用于服务器，后者用于浏览器。ES6 在语言规格的层面上实现了模块功能，而且实现的相当简单，完全可以取代现有的 CommonJs 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。

ES6 模块的设计思想是尽量静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量，CommonJs 和 AMD 都只能在运行时确定这些东西。比如，CommonJs 就是对象，输入时必须查找对象属性。



## export的用法

在ES6中每一个模块即是一个文件，在文件中定义的变量，函数，对象在外部是无法获取的。如果你希望外部可以读取模块当中的内容，就必须使用export来对其进行暴露（输出）。

export可以输出变量、函数和类，切记不可直接输出值，否则会报错，因为export命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系。

先来看个例子，来对一个变量进行模块化。我们先来创建一个test.js文件，来对这一个变量进行输出：

```javascript
export let myName="laowang";
```



然后可以创建一个index.js文件，以import的形式将这个变量进行引入:

```javascript
import {myName} from "./test.js";
console.log(myName);//laowang
```



如果要输出多个变量可以将这些变量包装成对象进行模块化输出：

```javascript
let myName="laowang";
let myAge=90;
let myfn=function(){
    return "我是"+myName+"！今年"+myAge+"岁了"
}
export {
    myName,
    myAge,
    myfn
}
/******************************接收的代码调整为**********************/
import {myfn,myAge,myName} from "./test.js";
console.log(myfn());//我是laowang！今年90岁了
console.log(myAge);//90
console.log(myName);//laowang
```



如果你不想暴露模块当中的变量名字，可以通过as来进行操作:

```javascript
let myName="laowang";
let myAge=90;
let myfn=function(){
    return "我是"+myName+"！今年"+myAge+"岁了"
}
export {
    myName as name,
    myAge as age,
    myfn as fn
}
/******************************接收的代码调整为**********************/
import {fn,age,name} from "./test.js";
console.log(fn());//我是laowang！今年90岁了
console.log(age);//90
console.log(name);//laowang
```



也可以直接导入整个模块，将上面的接收代码修改为：

```javascript
import * as info from "./test.js";//通过*来批量接收，as 来指定接收的名字
console.log(info.fn());//我是laowang！今年90岁了
console.log(info.age);//90
console.log(info.name);//laowang
```



**注意：**export不能输出值，并且它输出的变量函数名或者类名要放在大括号中({})

~~~javascript
export 1;//报错，是个值，没有提供接口
 
var m = 1;
export m;//报错,要放在大括号中

function sum(x,y){
    return  x+y;
}
export sum;//报错，要放在大括号中

//正确的写法，以函数为例
export {sum}
export {sum as qh}
~~~



> 注意，export命令可以出现在模块的任何位置，只要处于模块顶层就可以。如果处于块级作用域内，就会报错，import命令也是如此。这是因为处于条件代码块之中，就没法做静态优化了，违背了 ES6 模块的设计初衷。



## 默认导出(export default)

export default命令用于指定模块的默认输出。显然，一个模块只能有一个默认输出，因此export default命令只能使用一次。所以，import命令后面才不用加大括号，因为只可能唯一对应export default命令。

本质上，export default就是输出一个叫做default的变量或方法，然后系统允许你为它取任意名字。

另外export default命令的本质是将后面的值，赋给default变量，所以可以直接将一个值写在export default之后。正是因为export default命令其实只是输出一个叫做default的变量，所以它后面不能跟变量声明语句。

```javascript
/******************************导出**********************/
export default function(){
    return "默认导出一个方法"
}
/******************************引入**********************/
import myFn from "./test.js";//注意这里默认导出不需要用{}。
console.log(myFn());//默认导出一个方法
```



可以将所有需要导出的变量放入一个对象中，然后通过default export进行导出

```javascript
/******************************导出**********************/
export default {
    myFn(){
        return "默认导出一个方法"
    },
    myName:"laowang"
}
/******************************引入**********************/
import myObj from "./test.js";
console.log(myObj.myFn(),myObj.myName);//默认导出一个方法 laowang
```



同样也支持混合导出

```javascript
/******************************导出**********************/
export default function(){
    return "默认导出一个方法"
}
export var myName="laowang";
/******************************引入**********************/
import myFn,{myName} from "./test.js";
console.log(myFn(),myName);//默认导出一个方法 laowang
```



## 重命名export和import

如果导入的多个文件中，变量名字相同，即会产生命名冲突的问题，为了解决该问题，ES6为提供了重命名的方法，当你在导入名称时可以这样做：

```javascript
/******************************test1.js**********************/
export let myName="我来自test1.js";
/******************************test2.js**********************/
export let myName="我来自test2.js";
/******************************index.js**********************/
import {myName as name1} from "./test1.js";
import {myName as name2} from "./test2.js";
console.log(name1);//我来自test1.js
console.log(name2);//我来自test1.js
```





