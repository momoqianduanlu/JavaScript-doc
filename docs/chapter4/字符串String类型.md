# 字符串String类型

### 定义

　　字符串String类型是由引号括起来的一组由16位Unicode字符组成的字符序列

　　字符串类型常被用于表示文本数据，此时字符串中的每个元素都被视为一个代码点。每个元素都被认为占有此序列中的一个位置，用非负数值索引这些位置。首字符从位置0开始，第二个字符在位置1，依次类推

　　字符串的长度即其中元素的个数。空字符串长度为零，因而不包含任何元素

![string](https://pic.xiaohuochai.site/blog/JS_ECMA_grammer_string.gif)

### 属性

　　字符串String类型的每个实例都有一个length属性，表示字符串中的字符个数。由于字符串是不可变的，所以字符串的长度也不可变

　　字符串的length属性不会在`for/in`循环中枚举，也不能通过`delete`操作符删除

　　[注意]对于字符串s来说，最后一个字符的索引是`s.length - 1`

```javascript
var str = "test";
console.log(str.length);//4
str.length = 6;
console.log(str,str.length);//"test",4
```



### 对象通用方法

　　String类型是与字符串对应的包装类型，继承了Object对象的通用方法toString()、toLocaleString()、valueOf()这三个方法

【toString()】

　　toString()方法返回string的原始字符串值

【toLocaleString()】

　　toLocaleString()方法返回string的原始字符串值

【valueOf()】

　　valueOf()方法返回string的原始字符串值

```javascript
console.log("test".valueOf());//"test"
console.log("test".toString());//"test"
console.log("test".toLocaleString());//"test"
```



### 访问字符方法

　　字符串的访问字符方法总共有chartAt()、中括号[]、charCodeAt()

【chartAt()】

　　charAt()方法接收一个基于0的字符位置的参数，返回指定位置的字符。当参数为空或NaN时，默认参数为0；当参数超出范围时，则返回一个空字符串　

```javascript
var str = "hello";
console.log(str.charAt(1));//e
console.log(str.charAt(-1));//''
console.log(str.charAt(10));//''
console.log(str.charAt());//h 
console.log(str.charAt(NaN));//h
```

　　charAt()方法涉及到Number()函数的隐式类型转换，如果转换为数值，则按照上述规则输出字符串；如果转换为NaN，则输出第0个字符

```javascript
var str = "hello";
console.log(str.charAt(true));//'e'
console.log(str.charAt(false));//'h'
console.log(str.charAt('abc'));//'h'
console.log(str.charAt({}));//'h'
console.log(str.charAt([2]));//'l'
```

　　[注意]x.charAt(pos)与x.substring(pos, pos+1)、x.substr(pos,1)、x.slice(pos,pos+1)的结果相等

```javascript
var str = "hello";
console.log(str.charAt(1));//'e'
console.log(str.substring(1,2));//'e'
console.log(str.slice(1,2));//'e'
console.log(str.substr(1,1));//'e'
```

【中括号】

　　ECMAScript5定义了另一个访问字符的方法，使用方括号加数字索引来访问字符串中的特定字符。如果参数超出范围或是NaN时，则输出undefined；没有参数时，会报错；该方法没有Number()转型函数的隐式类型转换，但参数为单数值数组时可转换为数值

　　[注意]IE7-浏览器不支持

```javascript
var str = "hello";
console.log(str[0]);//h
console.log(str[[1]]);//e
console.log(str[false]);//undefined
console.log(str[-1]);//undefined
console.log(str[NaN]);//undefined
console.log(str[]);//报错
```

【charCodeAt()】

　　charCodeAt()方法类似于charAt()方法，接收一个基于0的字符位置的参数，但返回的是指定位置的字符16位Unicode编码。返回值是一个16位的整数，在0-65535之间，即0x0000-0xffff之间

　　参数为空或NaN时，默认参数为0；当参数超出范围时，则返回NaN

```javascript
var str = "hello";
console.log(str.charCodeAt());//104
console.log(str.charCodeAt(0));//104
console.log(str.charCodeAt(1));//101
console.log(str.charCodeAt(-1));//NaN
console.log(str.charCodeAt(10));//NaN
console.log(str.charCodeAt(NaN));//104
```

　　同样地，charCodeAt()方法涉及到Number()函数的隐式类型转换，如果转换为数值，则按照上述规则输出相应值；如果转换为NaN，则输出第0个字符的字符编码

```javascript
var str = "hello";
console.log(str.charCodeAt(true));//101
console.log(str.charCodeAt(false));//104
console.log(str.charCodeAt('abc'));//104
console.log(str.charCodeAt({}));//104
console.log(str.charCodeAt([2]));//l08
```



### 字符串拼接

　　关于字符串拼接共有concat()和加号+两种方法

【concat()】

　　concat()方法用于将一个或多个字符串拼接起来，返回拼接得到的新字符串，而原字符串不发生改变。若参数(第一个参数除外)不是字符串，则通过String()方法隐式转换为字符串，再进行字符串拼接

```javascript
var stringValue = 'hello ';
var result = stringValue.concat('world','!');
console.log(result);//'hello world!'
console.log(stringValue);//'hello'
```

　　[注意]第一个参数只能是字符串，如果是其他类型(数组除外)则报错

```javascript
(1).concat('2');//报错
(true).concat('false');//报错
({}).concat('abc');//报错
```

　　[注意]由于数组也存在concat()方法，参数会按照首先出现的参数是数组还是字符串来决定如何转换

```javascript
'1,2,3,'.concat([4,5]);//'1,2,3,4,5'
[1,2,3].concat(',4,5');//[1, 2, 3, ",4,5"]
```

【加号运算符(+)】

　　虽然concat()是专门用来拼接字符串的方法，但实践中使用更多的还是 加号运算符，使用加号运算符在许多时候都比concat()简单方便

```javascript
var stringValue = 'hello ';
console.log(stringValue.concat('world','!'));//'hello world!'
console.log(stringValue + 'world' + '!');//'hello world!' 
```

　　[注意]当操作数其中一个是字符串，或者对象转换为字符串时，才进行字符串拼接

```javascript
1 + 2;//3
'1' + 2;//'12'
var o = {valueOf:function(){return '1';}};
o + 2;//'12'
var o = {valueOf:function(){return 1;}};
o + 2;//3
```



### 创建子字符串

　　创建子字符串共有slice()、substr()和substring()三种方法

【slice()】

　　slice(start,end)方法需要两个参数start和end，返回这个字符串中从start位置的字符到(但不包含)end位置的字符的一个子字符串；如果end为undefined或不存在，则返回从start位置到字符串结尾的所有字符

　　如果start是负数，则start = max(length + start,0)

　　如果end是负数，则end = max(length + end,0)

　　start和end无法交换位置

```javascript
var stringValue = 'hello world';
console.log(stringValue.slice());//'hello world'
console.log(stringValue.slice(2));//'llo world'
console.log(stringValue.slice(2,undefined));//'llo world'
console.log(stringValue.slice(2,-5));//'llo '
console.log(stringValue.slice(2,-20));//''
console.log(stringValue.slice(20));//''
console.log(stringValue.slice(-2,2));//''
console.log(stringValue.slice(-2,-20));//''            
console.log(stringValue.slice(-2,20));//'ld'
console.log(stringValue.slice(-20,2));//'he'
console.log(stringValue.slice(-20,-2));//'hello wor'
```

　　slice()方法涉及到Number()转型函数的隐式类型转换，当start被转换为NaN时，相当于start = 0；当end被转换为NaN时(end为undefined除外)，则输出空字符串

```javascript
var stringValue = 'hello world';
console.log(stringValue.slice(NaN));//'hello world'
console.log(stringValue.slice(0,NaN));//''
console.log(stringValue.slice(true,[3]));//'el'
console.log(stringValue.slice(null,undefined));//'hello world'
console.log(stringValue.slice({}));//'hello world'
console.log(stringValue.slice('2',[5]));//'llo'
```

【substring()】

　　substring(start,end)方法需要两个参数start和end，返回这个字符串中从start位置的字符到(但不包含)end位置的字符的一个子字符串；如果end为undefined或不存在，则返回从start位置到字符串结尾的所有字符

　　如果任一参数是NaN或负数，则被0取代

　　如果任一参数大于字符串长度，则被字符串长度取代

　　如果start 大于 end，则交换它们的值

```javascript
var stringValue = 'hello world';
console.log(stringValue.substring());//'hello world'
console.log(stringValue.substring(2));//'llo world'
console.log(stringValue.substring(2,undefined));//'llo world'
console.log(stringValue.substring(20));//''
console.log(stringValue.substring(-2,2));//'he'
console.log(stringValue.substring(NaN,2));//'he'
console.log(stringValue.substring(-2,20));//'hello world'
console.log(stringValue.substring(3,2));//'l'
console.log(stringValue.substring(3,NaN));//'hel'
console.log(stringValue.substring(-20,2));//'he'
console.log(stringValue.substring(-20,-2));//'' 
```

　　同样地，substring()方法也涉及到Number()转型函数的隐式类型转换

```javascript
var stringValue = 'hello world';
console.log(stringValue.substring(true,[3]));//'el'
console.log(stringValue.substring(null,undefined));//'hello world'
console.log(stringValue.substring({}));//'hello world'
console.log(stringValue.substring('2',[5]));//'llo'
```

【substr()】

　　substr(start,end)方法需要两个参数start和end，end代表返回的子字符串的字符个数；该方法返回这个字符串中从start位置的字符开始的end个字符的一个子字符串；如果end为undefined或不存在，则返回从start位置到字符串结尾的所有字符

　　如果start是负数，则start = max(length + start,0)

　　如果start是NaN，则相当于start = 0

　　如果end是负数或NaN，则end = 0，因此会返回空字符串

　　start和end无法交换位置

　　[注意]该方法不是ECMAScript标准，已经被弃用

　　[注意]IE8-浏览器在处理向substr()传递负值的情况时存在问题，它会返回原始的字符串

```javascript
var stringValue = 'hello world';
console.log(stringValue.substr());//'hello world'
console.log(stringValue.substr(2));//'llo world'
console.log(stringValue.substr(2,undefined));//'llo world'
console.log(stringValue.substr(2,NaN));//''
console.log(stringValue.substr(NaN,2));//'he'
console.log(stringValue.substr(20));//''
console.log(stringValue.substr(-2,3));//'ld'
console.log(stringValue.substr(-2,20));//'ld'
console.log(stringValue.substr(-20,2));//'he'
console.log(stringValue.substr(-20,-2));//''    
console.log(stringValue.substr(2,5));//llo w
```

　　同样地，substr()方法也涉及到Number()转型函数的隐式类型转换

```javascript
var stringValue = 'hello world';
console.log(stringValue.substr(true,[3]));//'el'
console.log(stringValue.substr(null,undefined));//'hello world'
console.log(stringValue.substr({}));//'hello world'
console.log(stringValue.substr('2',[5]));//'llo w'
```

　　[注意]对于以上三个创建子串的方法来说，如果是空字符串，则无论参数是什么，仍然返回空字符串

```javascript
var str = '';
console.log(str.slice(1));//''
console.log(str.substring(1));//''
console.log(str.substr(1));//''
```

 

### 大小写转换

　　ECMAScript中涉及字符串大小写转换的方法有4个：toLowerCase()、toLocaleLowerCase()、toUpperCase()、toLocaleUpperCase()

　　toLowerCase()和toUpperCase()是两个经典的方法，借鉴自java.lang.String中的同名方法。而toLocaleLowerCase()和toLocaleUpperCase()方法则是针对特定地区的实现，对有些地区来说，针对地区的方法与其通用方法得到的结果相同，但少数语言(如土耳其语)会为Unicode大小写转换应用特殊的规则，这时候就必须使用针对地区的方法来保证实现正确的转换

【toUpperCase()】

　　toUpperCase()方法将字符串转换成大写

【toLowerCase()】

　　toLowerCase()方法将字符串转换成小写

【toLocaleUpperCase()】

　　toLocaleUpperCase()方法将字符串转换成大写(针对地区)

【toLocaleLowerCase()】

　　toLocaleLowerCase()方法将字符串转换成小写(针对地区)

　　[注意]在不知道自己的代码将在哪个语言环境中运行的情况下，使用针对地区的方法更稳妥

```javascript
var string = 'Hello World';
console.log(string.toLowerCase());//hello world
console.log(string.toLocaleLowerCase());//hello world
console.log(string.toUpperCase());//HELLO WORLD
console.log(string.toLocaleUpperCase());//HELLO WORLD
```

　　这4种方法均不支持String()隐式类型转换，只支持字符串类型

```javascript
(true).toLowerCase();//报错
(2).toLocaleLowerCase();//报错
({}).toUpperCase();//报错
([]).toLocaleUpperCase();//报错
```

　　[注意]大小写转换方法可以连续使用

```javascript
var string = 'Hello World';
console.log((string.toUpperCase()).toLowerCase());//hello world
```

 　将带有分割符的字符串转换为驼峰的形式

```javascript
var txt = "border-top-left";
var arr = txt.split('-');
for(var i = 1; i < arr.length; i++){
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
}
var result = arr.join('');
console.log(result);//'borderTopLeft"
```



### 查找子串位置

　　有两个从字符串中查找子字符串位置的方法：indexOf()和lastIndexOf()。查找子串位置的方法同访问字符方法charAt()和中括号[]方法有相反的地方，一个通过字符串查找位置，一个则是通过位置查找字符

【indexOf()】

　　indexOf(searchString,start)方法接收searchString和start两个参数，返回searchString首次出现的位置，如果没有找到则返回-1

　　该方法会隐式调用String()转型函数，将searchString非字符串值转换为字符串；隐式调用Number()转型函数，将start非数字值(undefined除外)转换为数值

　　searchString表示要搜索的子字符串；start表示该搜索的开始位置，若忽略该参数或该参数为undefined、NaN或负数时，start = 0

```javascript
var string = 'hello world world';
console.log(string.indexOf('ld'));//9
console.log(string.indexOf('ld',undefined));//9
console.log(string.indexOf('ld',NaN));//9
console.log(string.indexOf('ld',-1));//9
console.log(string.indexOf('ld',10));//15
console.log(string.indexOf('ld',[10]));//15
console.log(string.indexOf('true',[10]));//-1
console.log(string.indexOf(false,[10]));//-1
```

【lastIndexOf()】

　　与indexOf()不同，lastIndexOf()从右向左查找

　　lastIndexOf(searchString,start)方法接收searchString和start两个参数，返回searchString第一次出现的位置，如果没有找到则返回-1

　　同样地，该方法会隐式调用String()转型函数，将searchString非字符串值转换为字符串；隐式调用Number()转型函数，将start非数字值(undefined除外)转换为数值

　　searchString表示要搜索的子字符串；start表示该搜索的开始位置，若忽略该参数或该参数为undefined、NaN时，start = length - 1；若start为负数，start = 0

```javascript
var string = 'hello world world';
console.log(string.lastIndexOf('ld'));//15
console.log(string.lastIndexOf('ld',undefined));//15
console.log(string.lastIndexOf('ld',NaN));//15
console.log(string.lastIndexOf('ld',-1));//-1
console.log(string.lastIndexOf('h',-1));//0
console.log(string.lastIndexOf('w',undefined));//12

console.log(string.lastIndexOf('ld',10));//9
console.log(string.lastIndexOf('ld',[10]));//9
console.log(string.lastIndexOf('true',[10]));//-1
console.log(string.lastIndexOf(false,[10]));//-1
```

　　【tips】查找出字符串所有符合条件的子字符串

　　可以通过循环调用indexOf()或lastIndexOf()来找到所有匹配的子字符串

```javascript
function allIndexOf(str,value){
    var result = [];
    var pos = str.indexOf(value);
    while(pos > -1){
        result.push(pos);
        pos = str.indexOf(value,pos+value.length);
    }
    return result;
}
console.log(allIndexOf('helllhelllhelll','ll'));//[2,7,12]
```

　　lastIndexOf()方法常用于获取URL地址中的扩展名

```javascript
var url = "http://cnblogs.com/xiaohuochai.txt";
function getFileFormat(url){
    var pos = url.lastIndexOf('.');
    return url.slice(pos+1);
}
console.log(getFileFormat(url));//'txt'
```