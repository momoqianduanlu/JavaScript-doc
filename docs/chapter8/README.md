

# toString()方法

`toString()` 方法返回反映这个对应的字符串，

1. undefined 和 null 没有 toString 方法

   ~~~javascript
   undefined.toString();//错误
   null.toString();//错误
   ~~~

2. 布尔数据类型 true 和 false 返回 'true' 和 'false'

   ~~~javascript
   true.toString();//'true'
   false.toString();//'false'
   Boolean.toString(); // function Boolean() { [native code] }
   ~~~

3. 字符串类型原值返回

   ~~~javascript
   '1'.toString();//'1'
   ''.toString();//''
   'abc'.toString();//'abc'
   String.toString(); // function String() { [native code] }
   ~~~

4. number

   ```javascript
   Number.toString();//"function Number() { [native code] }"
   ```

   正浮点数及NaN、Infinity、-Infinity加引号返回

   ```javascript
   1.23.toString();//'1.23'
   NaN.toString();//'NaN'
   Infinity.toString();//'Infinity'
   -Infinity.toString();//'-Infinity'
   ```

   加 '+' 的浮点数以及加'-'负号的浮点数调用toString()方法，无效，直接返回原数值。

   ~~~javascript
   +1.23.toString();//1.23
   typeof +1.23.toString();//'number'
   -1.23.toString();//-1.23
   typeof -1.23.toString();//'number'
   ~~~

   整数直接调用toString()方法会报错，因为整数后面的 '.' 会被识别为小数点。

   ~~~javascript
   0.toString();//Uncaught SyntaxError: Invalid or unexpected token
   ~~~

   

5. 对象object以及自定义对象类型返回 '[object Object]'

   ~~~javascript
   {}.toString();//报错，Unexpected token .
   ({}).toString();//[object Object]
   ({a:123}).toString();//[object Object]
   Object.toString(); // function Object() { [native code] }
   ~~~

   ~~~javascript
   function Person(){
       this.name = 'test';
   }
   var person1 = new Person();
   person1.toString();//"[object Object]"
   ~~~



**类型识别**

　　常常使用Object.prototype.toString()来进行类型识别，返回代表该对象的[object 数据类型]字符串表示

>Object.prototype.toString()可以识别标准类型及内置对象类型，但不能识别自定义类型

```javascript
console.log(Object.prototype.toString.call("jerry"));//[object String]
console.log(Object.prototype.toString.call(12));//[object Number]
console.log(Object.prototype.toString.call(true));//[object Boolean]
console.log(Object.prototype.toString.call(undefined));//[object Undefined]
console.log(Object.prototype.toString.call(null));//[object Null]
console.log(Object.prototype.toString.call({name: "jerry"}));//[object Object]

console.log(Object.prototype.toString.call(function(){}));//[object Function]
console.log(Object.prototype.toString.call([]));//[object Array]
console.log(Object.prototype.toString.call(new Date));//[object Date]
console.log(Object.prototype.toString.call(/\d/));//[object RegExp]
function Person(){};
console.log(Object.prototype.toString.call(new Person));//[object Object]


function type(obj){
    return Object.prototype.toString.call(obj).slice(8,-1).toLowerCase();
}
console.log(type("jerry"));//"string"
console.log(type(12));//"number"
console.log(type(true));//"boolean"
console.log(type(undefined));//"undefined"
console.log(type(null));//"null"
console.log(type({name: "jerry"}));//"object"

console.log(type(function(){}));//"function"
console.log(type([]));//"array"
console.log(type(new Date));//"date"
console.log(type(/\d/));//"regexp"
function Person(){};
console.log(type(new Person));//"object"
```



6. 函数Function类型返回函数代码

   当我们对一个自定义函数调用toString()方法时，可以得到该函数的源代码；如果对内置函数使用toString()方法时，会得到一个'[native code]'字符串。因此，可以使用toString()方法来区分自定义函数和内置函数

   ~~~javascript
   function test(){
       alert(1);//test
   }
   test.toString();/*"function test(){
                       alert(1);//test
                     }"*/
   Function.toString() // function Function() { [native code] }
   ~~~

7. Array类型调用 toString() 方法会返回以数组每个值的字符串形式以 ',' 隔开拼接成的一个字符串。

   ~~~javascript
   [].toString();//''
   [1].toString();//'1'
   [1,2,3,4].toString();//'1,2,3,4'
   Array.toString(); // function Array() { [native code] }
   ~~~

8. 时间Date类型返回表示当前时区的时间的字符串表示

   ~~~javascript
   (new Date()).toString();//"Sun Jun 05 2016 10:04:53 GMT+0800 (中国标准时间)"
   Date.toString();//"function Date() { [native code] }"
   ~~~

9. 正则表达式RegExp类型返回正则表达式字面量的字符串表示

   ~~~javascript
   /ab/i.toString();//'/ab/i'
   /mom( and dad( and baby)?)?/gi.toString();//'mom( and dad( and baby)?)?/gi'
   RegExp.toString();//"function RegExp() { [native code] }"
   ~~~

10. 错误Error类型

    ~~~javascript
    Error.toString(); // function Error() { [native code] }
    RangeError.toString();//"function RangeError() { [native code] }"
    ReferenceError.toString();//"function ReferenceError() { [native code] }"
    SyntaxError.toString();//"function SyntaxError() { [native code] }"
    TypeError.toString();//"function TypeError() { [native code] }"
    URIError.toString();//"function URIError() { [native code] }"
    ~~~

    