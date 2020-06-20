# 深入理解JSON对象

json(javascript object notation)全称是javascript对象表示法，它是一种数据交换的文本格式，他不是一种编程语言，用于读取结构化数据。2001年由Douglas Crockford提出，目的是取代繁琐笨重的XML格式。本文将详细介绍JSON的相关内容

### 语法规则

JSON的语法可以表示以下三种类型的值

【1】简单值

　　简单值使用与javascript相同的语法，可以在JSON中表示字符串、数值、布尔值和null

　　字符串必须使用双引号表示，不能使用单引号。数值必须以十进制表示，且不能使用NaN和Infinity

　　[注意]JSON不支持javascript中的特殊值undefined

```json
//合格的简单值
5
"hello world"
true
null
//不合格的简单值
+0x1
'hello world'
undefined
NaN
Infinity
```

【2】对象

　　对象作为一种复杂数据类型，表示的是一组键值对儿。而每个键值对儿中的值可以是简单值，也可以是复杂数据类型的值

　　与javascript的对象字面量相比，JSON有三个不同的地方

　　1、JSON没有变量的概念

　　2、JSON中，对象的键名必须放在双引号里面

　　3、因为JSON不是javascript语句，所以没有末尾的分号

　　[注意]同一个对象中不应该出现两个同名属性

```json
//合格的对象
{
    "name":"huochai",
    "age":29,
    "school":{
        "name":"diankeyuan",
        "location":"beijing"
    }
}
//不合格的对象
{ name: "张三", 'age': 32 }//属性名必须使用双引号
{};//不需要末尾的分号
{ "birthday": new Date('Fri, 26 Aug 2011 07:13:10 GMT'),
  "getName": function() {
      return this.name;
  }
} // 不能使用函数和日期对象
```

【3】数组

　　数组也是一种复杂数据类型，表示一组有序的值的列表，可以通过数值索引来访问其中的值。数组的值也可以是任意类型——简单值、对象或数组

　　JSON数组也没有变量和分号，把数组和对象结合起来，可以构成更复杂的数据集合

　　[注意]数组或对象最后一个成员的后面，不能加逗号



### stringify()

`JSON.Stringify()`  方法将一个 JavaScript 值（对象或者数组）转换为一个 JSON 字符串，如果指定了 `replacer` 是一个**函数**，则可以选择性地替换值，或者如果指定了 `replacer` 是一个**数组**，则可选择性地仅包含数组指定的属性。

> JSON.stringify(value[, replacer [, space]])

**value**
将要序列化成 一个 JSON 字符串的值。

**replacer 可选**
如果该参数是一个函数，则在序列化过程中，被序列化的值的**每个属性**都会经过该函数的转换和处理；如果该参数是一个数组，则**只有包含在这个数组中的属性名**才会被序列化到最终的 JSON 字符串中；如果该参数为 null 或者未提供，则对象所有的属性都会被序列化；

**space 可选**
指定缩进用的空白字符串，用于美化输出（pretty-print）；如果参数是个数字，它代表有多少的空格；上限为10。该值若小于1，则意味着没有空格；如果该参数为字符串（当字符串长度超过10个字母，取其前10个字母），该字符串将被作为空格；如果该参数没有提供（或者为 null），将没有空格



**具体转换**

~~~json
JSON.stringify('abc') // ""abc""
JSON.stringify(1) // "1"
JSON.stringify(false) // "false"
JSON.stringify([]) // "[]"
JSON.stringify({}) // "{}"
JSON.stringify([1, "false", false])// '[1,"false",false]'
JSON.stringify({ name: "张三" })// '{"name":"张三"}'
~~~



stringify()方法把正则表达式和数学对象转换成空对象的字符串形式

~~~json
JSON.stringify(/foo/) // "{}"
JSON.stringify(Math) // "{}"
~~~



stringify()方法把日期对象和包装对象转换成字符串

~~~json
JSON.stringify(new Boolean(true)) //"true"
JSON.stringify(new String('123')) //""123""
JSON.stringify(new Number(1)) //"1"
JSON.stringify(new Date()) //""2016-09-20T02:26:38.294Z""
~~~



如果对象的成员是 **undefined** 或 **函数**，则这个成员或被忽略

如果数组的成员是 **undefined** 或 **函数**，则这个成员会被转化成 null

~~~json
JSON.stringify({
  a: function(){},
  b: undefined,
  c: [ function(){}, undefined ]
});
// "{"c":[null,null]}"
~~~



如果对象成员或数组成员中出现**NaN**或**Infinity**，则这些值被转换成null

~~~json
console.log(JSON.stringify({
  a: NaN,
  b: Infinity,
  c: [ NaN,Infinity]
}));
//{"a":null,"b":null,"c":[null,null]}
~~~



JSON.stringify()方法会忽略对象的不可遍历属性

~~~json
var obj = {};
Object.defineProperties(obj, {
  'foo': {
    value: 1,
    enumerable: true
  },
  'bar': {
    value: 2,
    enumerable: false
  }
});
JSON.stringify(obj); // {"foo":1}]
~~~



### replacer参数介绍

`replacer`参数可以是一个函数也可以是一个数组，如果是一个函数，他有两个参数 [键key, 值val]，他们都会被序列化，

在开始时, `replacer` 函数会被传入一个空字符串作为 `key` 值，代表着要被 `stringify` 的这个对象。随后每个对象或数组上的属性会被依次传入。 

**注意:** 不能用 replacer 方法，从数组中移除值（values），如若返回 undefined 或者一个函数，将会被 null 取代。



下面代码中，对象o一共会被f函数处理三次。第一次键名为空，键值是整个对象o；第二次键名为a，键值是{b:1}；第三次键名为b，键值为1

~~~json
JSON.stringify({a: {b: 1}}, function (key, value) {
  console.log("["+ key +"]:" + value);
  return value;
})
// []:[object Object]
// [a]:[object Object]
// [b]:1
// '{"a":{"b":1}}' 
~~~



函数返回的值就是相应键的值。如果函数返回了undefined或没有返回值，那么相应的属性会被忽略

~~~json
JSON.stringify({ a: "abc", b: 123 }, function (key, value) {
  if (typeof(value) === "string") {
    return undefined;
  }
  return value;
})
// '{"b": 123}'
~~~



---



如果replacer是一个数组，数组的值代表将被序列化成 json 字符串的属性名

1. 当stringify()方法的第二个参数是一个数组时，这时相当于实现一个过滤器的功能

~~~json
var jsonObj = {
    "title":"javascript",
    "group":{
        "a":1
    }
};
//{"group":{"a":1}}
console.log(JSON.stringify(jsonObj,["group","a"]))
~~~



过滤器对数组无效

~~~json
var jsonObj =[1,2];
JSON.stringify(jsonObj,["0"])//"[1,2]"
~~~



### toJson()

如果一个被序列化的对象拥有`toJson()`方法，那么`toJson()`方法就会覆盖该对象默认的序列化行为，不是该对象被序列化，而是调用 `toJson`方法的返回值被序列化，

~~~json
var obj = {
  foo: 'foo',
  toJSON: function () {
    return 'bar';
  }
};
JSON.stringify(obj);      // '"bar"'
JSON.stringify({x: obj}); // '{"x":"bar"}'
~~~



### parse()

`JSON.parse()`方法用来解析JSON字符串，构造由字符串描述的JavaScript值或对象。提供可选的 **reviver** 函数用以**在返回之前对所得到的对象执行变换(操作)。**



**reviver**

如果指定了 `reviver` 函数，则解析出的 JavaScript 值（解析值）会经过一次转换后才将被最终返回（返回值），更具体点讲就是：解析值本身以及他所包含的所有属性，会按照一定的顺序，（从最最里层的属性开始，一级级往外，最终到达顶层，也就是解析值本身，）分别的去调用 `reviver`函数，在调用中，当前属性所属的对象会作为 this 值，当前属性名和属性值会分别作为第一个和第二个参数传入 `reviver` 中。如果 `reviver` 函数返回`undefied`，则当前属性会从所属对象中删除，如果返回了其他值，则返回的值会成为当前属性的新的属性值，

当遍历到最顶层的值（解析值）时，传入 `reviver` 函数的参数会是空字符串 `""`（因为此时已经没有真正的属性）和当前的解析值（有可能已经被修改过了），

当前的 `this` 值会是 `{"": 修改过的解析值}`，

在编写 `reviver` 函数时，要注意到这个特例。（这个函数的遍历顺序依照：从最内层开始，按照层级顺序，依次向外遍历）



~~~json
JSON.parse('{"p": 5}', function (k, v) {
    if(k === '') return v;     // 如果到了最顶层，则直接返回属性值，
    return v * 2;              // 否则将属性值变为原来的 2 倍。
});                            // { p: 10 }

JSON.parse('{"1": 1, "2": 2,"3": {"4": 4, "5": {"6": 6}}}', function (k, v) {
    console.log(k); // 输出当前的属性名，从而得知遍历顺序是从内向外的，
                    // 最后一个属性名会是个空字符串。
    return v;       // 返回原始属性值，相当于没有传递 reviver 参数。
});

// 1
// 2
// 4
// 6
// 5
// 3 
// ""
~~~

通过打印的 k 不难看出，传入 `reviver` 函数的参数遍历顺序是由内往外，

先是 `"1": 1,` `"2": 2,`

然后找到 `3`，因为 3 是一个嵌套的对象，所以继续往里找，找到 `"4": 4,`，然后又找到嵌套的对象 `5`，

`"6": 6,` 然后就是往外遍历了，`"5": {"6": 6}` `"3": {"4": 4, "5": {"6": 6}}`，

最后走到了最顶层，现在传入函数的是一个空字符串，`""` 他的值就是解析值 `{"1": 1, "2": 2,"3": {"4": 4, "5": {"6": 6}}}`



在将日期字符串转换为Date对象时，经常要用到还原函数

~~~json
var book = {
    "title": "javascript",
    "date": new Date(2016,9,1)
}
var jsonStr = JSON.stringify(book);
//'{"title":"javascript","date":"2016-09-30T16:00:00.000Z"}''
console.log(jsonStr)

var bookCopy = JSON.parse(jsonStr,function(key,value){
    if(key == 'date'){
        return new Date(value);
    }
    return value;
})
console.log(bookCopy.date.getFullYear());//2016
~~~





### eval()

实际上，`eval()`类似于JSON.parse()方法，可以将json字符串转换为json对象

```json
eval('(' + '{"a":1}'+')').a;//1
JSON.parse('{"a":1}').a;//1
```



但是，eval()可以执行不符合JSON格式的代码，有可能会包含恶意代码

```json
eval('(' + '{"a":alert(1)}'+')').a;//弹出1
JSON.parse('{"a":alert(1)}').a;//报错
```

所以，还是要尽量少使用eval()