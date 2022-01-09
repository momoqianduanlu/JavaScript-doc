# javascript中的数据类型转换

### 原始值转换成原始值

+ undefined

  undefined 转换成 字符串 `'undefined'`

  undefined 转换成 数字 `NaN`

  undefined 转换成 布尔 `false`

+ Null

  null 转换成 字符串 `'null'`

  null 转换成 数字 `0`

  null 转换成 布尔 `false`

+ Boolean

  boolean 转换成 字符串 `'boolean'`

  Boolean 转换成 数字 `true = 1 false = 0`

+ Number

  number 转换成 字符串 `0 = '0'`

  number 转换成 布尔值 `0 = false 1 = true`

+ String

  string 转换成 数字 `abc = NaN '123' = 123`

  string 转换成 布尔 `'' = false ' ' = true`



### 对象转换成原始值

1. 对象到布尔值的转换，所有的对象都转换为 `true`

   ~~~javascript
   console.log(Boolean([])); // true
   console.log(Boolean([12])); // true
   console.log(Boolean({})); // true
   console.log(Boolean(/\d/)); // true
   ~~~

2. 对象到数字( number)的转换，需要遵循以下规则

   Number()函数解析对象时，会按照以下步骤进行处理　

   + 首先会调用对象的 `valueOf` 方法，如果valueof方法返回的是一个原始值，就会直接使用 `Number()`函数对原始值进行处理。
   + 如果该对象没有 `valueOf`方法，就会调用该对象的`toString()`方法，如果返回一个原始值，就会直接使用 `Number()`函数对原始值进行处理。
   + 如果`toString()`方法返回的还是一个对象，那么最终结果是 `NaN`。

   总结来说，就是先 `valueOf`后`toString`。

   ~~~javascript
   var test1 = {
       toString: function(){
           return 1;
       },
       valueOf: function(){
           return 2;
       }
   }
   console.log(Number(test1));//2
   ~~~

   ~~~javascript
   var test2 = {
       toString: function(){
           return 1;
       },
   }
   console.log(Number(test2));//1
   ~~~

   ~~~javascript
   var test3 = {};
   console.log(Number(test3));//NaN 最终结果为NaN，调用 valueOf 和 toString，toString()的结果是字符串，但不包含数字，所以返回NaN。
   ~~~

   ~~~javascript
   Number(new Date())//1465976459108 new Date()调用valueOf会返回当前时间戳
   ~~~

   ~~~javascript
   Number([]);//0
   Number([0]);//0
   Number([-0]);//0
   Number([10]);//10
   Number([1,2]);//NaN
   Number(其他对象);//NaN
   ~~~

   > 详细解析上面的输出：
   >
   > []调用valueOf方法会返回[]，不是原始值继续调用toString()方法，返回 ''，使用Number()进行转换得到 0；
   >
   > []调用valueOf方法会返回[0]，不是原始值继续调用toString()方法，返回 '0'，使用Number()进行转换得到 0；
   >
   > []调用valueOf方法会返回[-0]，不是原始值继续调用toString()方法，返回 '0'，使用Number()进行转换得到 0；
   >
   > []调用valueOf方法会返回[10]，不是原始值继续调用toString()方法，返回 '10'，使用Number()进行转换得到 10；
   >
   > []调用valueOf方法会返回[1,2]，不是原始值继续调用toString()方法，返回 '1,2'，使用Number()进行转换，但是字符串中不仅仅包含数字，还有','，所以报错返回 NaN。

   **数组Array类型返回由数组中每个值的字符串形式拼接而成的一个以逗号分隔的字符串，如果字符串中只存在数字，则返回数字，其他情况返回NaN；**

   **由于其他对象的toString()方法返回的字符串中不只包括数字，所以返回NaN。**

3. 对象到字符串的转换

   javascript中对象到字符串的转换需要遵循以下规则

   + 如果对向有 `toString()`方法，则调用该方法，如果返回的是原始值，javascript将这个值转成字符串(如果本身不是字符串的话)，最后将这个值返回。
   + 如果该对象没有`toString()`方法或者调用`toString()`方法后返回的值不是原始值，那么javascript会调用`valueOf()`方法，如果存在这个方法，则javascript调用它，如果返回的是原始值，javascript将这个值转成字符串(如果本身不是字符串的话)，最后将这个值返回。
   + 如果该对象调用 `toString()`和`valueOf()`返回的值还是对象，则抛错。

   总结来说，就是先`toString()`再`valueOf`。

   ~~~javascript
   var test1 = {
       toString: function(){
           return '1';
       },
       valueOf: function(){
           return '2';
       }
   }
   console.log(String(test1));//'1'
   ~~~

   ~~~javascript
   var test2 = {
       toString: function(){
           return {};
       },
       valueOf: function(){
           return '2';
       }
   }
   console.log(String(test2));//'2'
   ~~~

   ~~~javascript
   var test3 = {};
   console.log(String(test3));//[object Object]
   ~~~

   **内置对象都从Object对象继承了toString()方法**			

   + 对象Object类型返回'[object Object]'字符串

     ```javascript
     console.log(({}).toString());//[object Object]
     console.log(({a:123}).toString());//[object Object]
     ```

   + 函数Function类型返回函数代码

     ~~~javascript
     function test(){
         alert(1);//test
     }
     test.toString();/*"function test(){
                         alert(1);//test
                       }"*/
     
     ~~~

   + 数组Array类型返回由数组中每个值的字符串形式拼接而成的一个以逗号分隔的字符串

     ~~~javascript
     console.log([].toString());//''
     console.log([1].toString());//'1'
     console.log([1,2,3,4].toString());//'1,2,3,4'
     ~~~

   + 时间Date类型返回表示当前时区的时间的字符串表示

     ~~~javascript
     console.log((new Date()).toString());//"Sun Jun 05 2016 10:04:53 GMT+0800 (中国标准时间)"
     ~~~

   + 正则表达式RegExp类型返回正则表达式字面量的字符串表示

     ~~~javascript
     console.log(/ab/i.toString());//'/ab/i'
     console.log(/mom( and dad( and baby)?)?/gi.toString());//'mom( and dad( and baby)?)?/gi'
     ~~~

     

   ### 显示类型转换

   显示类型转换又称强制类型转换

   1. 转成布尔

      将一个值转为布尔值可使用`Boolean()`转型函数

      > 转换成false的值称为假值(falsy value)，这7个值包括undefined、null、+0、-0、NaN、false、""(空字符串)

      ~~~javascript
      console.log(Boolean(undefined));//false
      console.log(Boolean(null));//false
      console.log(Boolean(0));//false
      console.log(Boolean(-0));//false
      console.log(Boolean(NaN));//false
      console.log(Boolean(''));//false
      console.log(Boolean(false));//false
      ~~~

      >在Number()方法中空字符串和空白字符串都转换为0，而在Boolean()方法中，空字符串""转换为false，而空白字符串" "转换为true

      ~~~javascript
      console.log(Number(''));//0
      console.log(Number(' '));//0
      
      console.log(Boolean(''));//false
      console.log(Boolean(' '));//true
      ~~~

      除了这7个假值外，其他的值转换为布尔值都是true，也称为真值(truthy value)

      >所有对象(包括空对象)的转换结果都是true，甚至连false对应的布尔对象new Boolean(false)也是true

      ~~~javascript
      console.log(Boolean({}));//true
      console.log(Boolean([]));//true
      
      console.log(Boolean(new Boolean(false)));//true
      console.log(Boolean(false));//false
      console.log(Boolean(new Boolean(null)));//true
      console.log(Boolean(null));//false
      ~~~

   2. 转成数字

      **Number()**

      当把`Number()`当作一个函数来调用，而不是作为构造器，它执行一个类型转换。使用`Number()`函数可以将任意类型的值转化成数值。

      ~~~javascript
      console.log(Number('    123'));//123
      console.log(Number('1.2.'));//NaN
      console.log(Number(1.2.));//报错
      console.log(Number(''),Number(' '));//0 0 
      console.log(Number('11'),Number('011'),Number('0x11'));//11 11 17
      console.log(Number('abc'));//NaN
      console.log(Number('123abc'));//NaN
      ~~~

   3. 转字符串

      **toString()**

      第一种是使用几乎每个值都有的`toString()`方法，这个方法返回相应值的字符串表现

      > undefined和null没有该方法

      ```javascript
      undefined.toString();//错误
      null.toString();//错误
      true.toString();//'true'
      false.toString();//'false'
      'abc'.toString();//'abc'
      1.23.toString();//'1.23'
      ({}).toString();//[object Object]
      [1,2,3,4].toString();//'1,2,3,4'
      (new Date()).toString();//"Sun Jun 05 2016 10:04:53 GMT+0800 (中国标准时间)"
      /ab/i.toString();//'/ab/i'
      ```

      **String()**

      　　在不知道要转换的值是不是`undefined`或`null`时，可以使用转型函数`String()`

      　　转型函数String()遵循下列规则：

      　　【1】如果值是null，则返回'null'；如果值是undefined，则返回'undefined'

      　　【2】如果值不是null或undefined，则调用toString()方法并返回原始类型值

      　　【3】若使用toString()方法返回的是对象，则再调用valueOf()方法返回原始类型值，若使用valueOf()方法返回的是对象，会报错。

   ### 隐式类型转换

   ​		凡是遇到 逻辑运算符`( && || !)` ，运算符 `(+ - * /)`，关系运算符 `(> < >= <=)`，相等运算符 `( ==)`，以及 `if while` 语句，如果遇到两个操作符类型不一致的情况，就会发生隐式类型转换。

   ##### '==' 的隐式类型转换规则

   + 如果类型相同，无需进行类型转换

   + 如果一个操作值是 null 和 undefined，那么另一个操作符也要转成 null 或者 undefined，这样类型相同后会返回 true，否则会返回 false。

   + 两个操作值如果是 number 或者 string 类型，那么将 string 转成 number类型。

   + 如果一个操作符是 boolean，那么将布尔转成 number。

   + 如果一个操作值为 object 且另一方的操作值为 string number symbol，那么会将对象object转为原始值(先valueOf再toString)，这两个操作数都将通过Number()转型函数转换成数字进行数值比较。

     ~~~javascript
     console.log([1] == 1);//true，相当于1 == 1
     console.log([] == true);//false，相当于0 == 1
     console.log({} > true);//false，相当于 NaN > 1
     console.log('true' <= 0);//false，相当于NaN <= 0
     ~~~

   ##### '+' 的隐式类型转换规则

   `'+'` 操作符不仅仅可以用作数字相加，还可以用作字符串拼接，当 '+' 号两边都是数字时，进行的是加法运算；如果两边都是字符串，则直接拼接，无须进行隐式类型转换。

   + 如果其中一个操作符是字符串，另一个操作符是 undefined null 或者 boolean，则会调用 `String() `方法转成字符串(只要有一个操作数是字符串，另一个操作数也会转换成字符串)。

   + 如果其中一个操作符是数字，另外一个操作符是 undefined null boolean 或者 数字，则会将其转换成数字进行加法运算，如果是对象则会将对象转成原始值(先toString再valueOf)，再进行加法运算。

   + 如果两个操作数都不是字符串，则两个操作数都将转换成数字。

     ~~~javascript
     console.log(1 + {});//'1[object Object]'
     console.log(1 + [1,2]);//'11,2'
     console.log(1 + new Date());//'Fri Jul 15 2016 22:12:05 GMT+0800 (中国标准时间)'
     console.log(1 + /0/);//'1/0/'
     console.log('' + undefined);//'undefined'
     console.log('' + null);//'null'
     console.log('' + false);//'false'
     console.log('' + true);//'true'
     console.log(1 + undefined);//NaN
     console.log(1 + null);//1
     
     console.log(undefined + undefined);//NaN
     console.log(null + null);//0
     console.log(true + true);//2
     ~~~

     