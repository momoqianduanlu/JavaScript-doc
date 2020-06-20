# ES6 的数组方法

## filter()

1. `filter()`方法使用指定的函数测试所有元素，并创建一个包含所有通过测试的元素的新数组，如果没有元素通过测试，则返回一个空数组，注意：该方法会返回一个新数组。

   `var newArray = arr .filter（callback（element [，index [，array]]） [，thisArg ]）`

2. callback:用来测试数组的每个元素的函数，包含三个参数，返回true表示保留该元素(通过测试)，返回false则不保留。

   

   ~~~javascript
   var a = [1, 2, 3, 4, 5];
   
   var b = a.filter((item) => {
     return item > 3;
   });
   
   console.log(b);
   
   var todos = [
     {
       id: 1,
       completed: true
     }, 
     {
       id: 2,
       completed: false
     }, 
     {
       id: 3,
       completed: true
     }, 
     {
       id: 4,
       completed: true
     }, 
     {
       id: 5,
       compelted: false
     }
   ];
   
   var completedTodos = todos.filter((item) => {
     return item.completed;
   });
   
   console.log(completedTodos);
   ~~~





## forEach()

该`forEach()`方法对每个数组元素执行一次提供的函数。

~~~javascript
var a = [1, 2, 3, 4, 5];

var b = [];
a.forEach((item) => {
    b.push(item + 1);
});
console.log(b); // [2,3,4,5,6]
~~~





## map()

1. `map()`方法返回一个由原数组中的每个元素调用一个指定方法后的返回值组成的新数组，

   ~~~javascript
   var new_array = arr .map（function callback（currentValue [，index [，array]]）{
        //返回new_array的元素
   } [，thisArg ]）callback: 原数组中的元素调用该方法后返回一个新的元素，
   ~~~

2. callback:原数组中的元素调用该方法后返回一个新的元素，

   ~~~javascript
   var a = [1, 2, 3, 4, 5];
   
   var b = a.filter((item) => {
       return item > 3;
   });
   console.log(b); // [4 ,5]
   
   var bb = [];
   a.map((item) => {
       if (item > 3) {
           bb.push(item);
       }
   });
   console.log(bb);    // [4, 5]
   
   var bbb = a.map((item) => {
       return item + 1;
   });
   console.log(bbb);   // [2, 3, 4, 5, 6]
   ~~~





## every()

1. every()方法用于测试数组中**所有元素**是否都通过了指定函数的测试，它返回一个布尔值。

~~~javascript
var a = [1, 2, 3, 4, 5];
var b = a.every((item) => {
    return item > 0;
});
var c = a.every((item) => {
    return item > 1;
});
console.log(b); // true
console.log(c); // false
~~~





## some()

1. `some()`方法用于测试数组中**是否至少有一项元素**通过了指定函数的测试，它返回一个布尔值。 

~~~javascript
var bb = a.some((item) => {
    return item > 4;
});

var cc = a.some((item) => {
    return item > 5;
});
console.log(bb);    // true
console.log(cc);    // false
~~~





## indexOf()

1. `indexOf()`方法返回在该数组中第一个找到的元素位置,如果它不存在则返回-1，

~~~javascript
 var a = [1, 2, 3, 4, 5];

var b = a.indexOf(2);
var c = a.indexOf(6);
console.log(b); // 1
console.log(c); // -1
~~~





## 扩展运算符（...）

使用扩展运算符可以 能够直接**深拷贝**一个数组。修改一个数组内的引用值，不会改变另一个值

```javascript
 var arr=[1,2,3,[4,5],6]
 var a=[...arr];
 console.log(a);//[1, 2, 3, Array(2), 6]
复制代码
```

扩展运算符可以用于数组拼接

```javascript
 var arr=[1,2,3]
 var arr2=[4,5,6]
 var str='12121'
 var a=[1,...arr,2,...arr2];
复制代码
```

另外...arr返回的并不是一个数组，而是各个数组的值。只有[...arr]才是一个数组，所以...arr。可以用来对方法进行传值

```javascript
 var arr=[1,2,3]
function f(x,y,z){
    return x+y+z 
}
console.log(f(...arr));  //6
```





## find和findIndex 查询第一个符合条件值/下标

find:用于找出第一个符合条件的数组元素，找不返回 undefined 。

findIndex:返回第一个符合条件的数组元素的索引，找不到返回-1。

```javascript
var arr=[1,2,3,4,5]
var newarr1=arr.find(function(item,index){return item>2})
var newarr2=arr.findIndex(function(item,index){return item>2})
console.log(newarr1);  //3
console.log(newarr2);  //2
复制代码
```

基本语法如上：find和findindex内部是一个回调函数，需要返回一个查询条件，find则会执行这个返回条件，查询第一个满足条件的值。findindex则会返回下标。 我们可以直接用箭头函数进行简写

```javascript
var arr=[1,2,3,4,5]
var newarr1=arr.find(item=>item>2)
var newarr2=arr.findIndex(item=>item>2)
console.log(newarr1);  //3
console.log(newarr2);  //2
```





## fill 填充初始化数组

作用：给数组填充指定值。fill 方法用于空数组的初始化非常方便。已有数据会被覆盖。 fill 方法还可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置

```javascript
var arr=[1,2,3,4,5]
arr.fill('*',1,3)
console.log(arr);//[1, "*", "*", 4, 5]
```



