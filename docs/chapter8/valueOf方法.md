# valueOf方法

1. undefined和null没有valueOf()方法

```javascript
undefined.valueOf();//错误
null.valueOf();//错误
```

2. 布尔型数据true和false返回原值。布尔型数据的包装对象返回true或false

~~~javascript
true.valueOf();//true
typeof true.valueOf();//'boolean'
false.valueOf();//false
typeof false.valueOf();//'boolean'
Boolean.valueOf(); // Boolean() { [native code] }
typeof Boolean.valueOf(); // function
~~~

3. 字符串类型原值返回。字符串类型的包装对象返回字符串值

~~~javascript
'1'.valueOf();//'1'
''.valueOf();//''
'abc'.valueOf();//'abc'
String.valueOf(); // String() { [natibe code] }
typeof String.valueOf(); // function
~~~

4. 数值类型分为整数和浮点数进行处理。数值类型的包装对象返回数值类型值

~~~javascript
Number.valueOf(); // Number() { [native code] }
typeof Number.valueOf(); // function
~~~

整数后面用 '.' 调用 valueOf() 方法会报错，因为 '.' 会被识别为小数点，所以尽量加()

~~~javascript
0.valueOf();//Uncaught SyntaxError: Invalid or unexpected token
(0).valueOf();//0
+0.valueOf();//Uncaught SyntaxError: Invalid or unexpected token
(+0).valueOf();//0
-0.valueOf();//Uncaught SyntaxError: Invalid or unexpected token
(-0).valueOf();//-0
~~~

> -0的valueOf()值是-0，而-0的toString()值是'0'

浮点数原值返回

~~~javascript
1.23.valueOf();//1.23
+1.23.valueOf();//1.23
-1.23.valueOf();//-1.23
NaN.valueOf();//NaN
Infinity.valueOf();//Infinity
-Infinity.valueOf();//-Infinity
~~~

5. 对象Object以及自定义对象类型返回原对象

~~~javascript
{}.valueOf(); // 报错 {}.valueOf(); 
({}).valueOf(); // Object{}
typeof ({}).valueOf(); // 'object'
({a:123}).valueOf(); // Object{a:123}
Object.valueOf();//Object() { [native code] }
typeof Object.valueOf();//'function'
~~~

~~~javascript
function Person(){
    this.name = 'test';
}
var person1 = new Person();
person1.valueOf();//Person {name: "test"}
~~~

6. Function 函数类型返回原函数

~~~javascript
function test() {
	alert(1)
}
test.valueOf(); /*function test(){
                    alert(1);//1
                  }*/
Function.valueOf(); // Function() { [native code] }
~~~

7. 数组Array类型返回原数组

~~~javascript
[].valueOf();//[]
[1].valueOf();//[1]
[1,2,3,4].valueOf();//[1,2,3,4]
Array.valueOf();//Array() { [native code] }
~~~

8. 和其他对象不同，时间Date类型返回一个数字值，它是当前时间值

~~~javascript
Date.now();//1465115123742
(new Date()).valueOf();//1465115123742
typeof (new Date()).valueOf();//'number'
Date.valueOf();//Date() { [native code] }
~~~

9. 正则表达式RegExp类型返回原正则对象

~~~javascript
/ab/i.valueOf();///ab/i
/mom( and dad( and baby)?)?/gi.valueOf();//mom( and dad( and baby)?)?/gi
RegExp.valueOf();//RegExp() { [native code] }
~~~

10. 错误error类型

~~~javascript
Error.valueOf();//Error() { [native code] }
RangeError.valueOf();//RangeError() { [native code] }
ReferenceError.valueOf();//ReferenceError() { [native code] }
SyntaxError.valueOf();//SyntaxError() { [native code] }
TypeError.valueOf();//TypeError() { [native code] }
URIError.valueOf();//URIError() { [native code] }
~~~



### 总结

+ toString() 和 valueOf() 的不同点主要在于 toString()返回的是字符串，valueOf() 返回的是原对象(封装对象返回的是原始值)
+ 由于undefined和null不是对象，所以它们toString()和valueOf()两个方法都没有
+ 数值Number类型的toString()方法可以接收转换基数，返回不同进制的字符串形式的数值；而valueOf()方法无法接受转换基数
+ 时间 Date() 类型的toString方法返回时间格式的字符串，valueOf()返回的是数字类型的时间戳
+ 包装对象的valueOf()方法返回该包装对象对应的原始值
+ 使用toString()方法可以对内置函数和自定义函数进行区分



