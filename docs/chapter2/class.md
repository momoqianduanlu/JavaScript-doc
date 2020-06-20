# ES6 中的 class



传统的javascript中只有对象，没有类的概念。它是基于原型的面向对象语言。原型对象特点就是将自身的属性共享给新对象。这样的写法相对于其它传统面向对象语言来讲，很有一种独树一帜的感脚！非常容易让人困惑！
如果要生成一个对象实例，需要先定义一个构造函数，然后通过new操作符来完成。构造函数示例：



```javascript
// 函数名和实例化构造名相同且大写（非强制，但这么写有助于区分构造函数和普通函数）
function Person(name, age) {
    this.name = name;
    this.age=age;
}
Person.prototype.say = function(){
    return "我的名字叫" + this.name+"今年"+this.age+"岁了";
}
var obj = new Person("laotie",88);// 通过构造函数创建对象，必须使用 new 运算符
console.log(obj.say());// 我的名字叫laotie今年88岁了
```



> 用new运算符调用一个函数的时候，会经历四步走，构造函数内部会悄悄创建一个局部变量，他是一个空对象，在函数内部的所有语句的this都指向这个空对象，函数将执行所有语句，函数执行完所有语句后将这个对象返回，



ES6引入了**Class**（类）这个概念，通过class关键字可以定义类。该关键字的出现使得其在对象写法上更加清晰，更像是一种面向对象的语言。如果将之前的代码改为ES6的写法就会是这个样子：

```javascript
// 定义了一个Person的类
class Person { // constructor是一个构造方法，用来接收参数
    constructor (name, age) {
        this.name = name; // this代表的是实例对象
        this.age = age;
    }
    say () {
        return "我的名字叫" + this.name+"今年"+this.age+"岁了";
    }
}
let obj = new Person('nihao', 23)
console.log(obj.say())
```



> 1. 在类中声明方法的时候，千万不要给该方法加上function关键字
> 2. 方法之间不要用逗号分隔，否则会报错



由下面代码可以看出类实质上就是一个函数。类自身指向的就是构造函数。所以可以认为ES6中的类其实就是构造函数的另外一种写法！

```javascript
console.log(typeof Person);// function
// 任何一个构造函数的属性身上都有一个constructor属性，指向构造函数，
console.log(Person===Person.prototype.constructor);// true
```



以下代码说明构造函数的`prototype`属性，在ES6的类中依然存在着。
console.log(Person.prototype);	//输出的结果是一个对象`
实际上类的所有方法都定义在类的prototype属性上。

代码证明下：

```javascript
Person.prototype.say=function(){//定义与类中相同名字的方法。成功实现了覆盖！
    return "我是来证明的，你叫" + this.name+"今年"+this.age+"岁了";
}
var obj=new Person("laotie",88);
console.log(obj.say());//我是来证明的，你叫laotie今年88岁了
```



当然也可以通过`prototype`属性对类添加方法。如下：

```javascript
Person.prototype.addFn=function(){
    return "我是通过prototype新增加的方法,名字叫addFn";
}
var obj=new Person("laotie",88);
console.log(obj.addFn());// 我是通过prototype新增加的方法,名字叫addFn
```



还可以通过`Object.assign`方法来为对象动态增加方法

```javascript
Object.assign(Person.prototype,{
    getName:function(){
        return this.name;
    },
    getAge:function(){
        return this.age;
    }
})
var obj=new Person("laotie",88);
console.log(obj.getName());//laotie
console.log(obj.getAge());//88
```



`constructor`方法是类的构造函数的默认方法，通过**new**命令生成对象实例时，自动调用该方法。

```javascript
class Box{
    constructor(){
        console.log("啦啦啦，今天天气好晴朗");// 当实例化对象时该行代码会执行。
    }
}
var obj=new Box();
```



constructor方法如果没有显式定义，会隐式生成一个constructor方法。所以即使你没有添加构造函数，构造函数也是存在的。constructor方法默认返回实例对象this，但是也可以指定constructor方法返回一个全新的对象，让返回的实例对象不是该类的实例。

```javascript
class Desk{
    constructor(){
        this.xixi="我是一只小小小小鸟！哦";
    }
}
class Box{
    constructor(){
       return new Desk();// 这里没有用this哦，直接返回一个全新的对象
    }
}
var obj=new Box();
console.log(obj.xixi);// 我是一只小小小小鸟！哦
```



constructor中定义的属性可以称为实例属性（即定义在this对象上），constructor外声明的属性都是定义在原型上的，可以称为原型属性（即定义在class上)。hasOwnProperty()函数用于判断属性是否是实例属性。其结果是一个布尔值， true说明是实例属性，false说明不是实例属性。in操作符会在通过对象能够访问给定属性时返回true,无论该属性存在于实例中还是原型中。

```javascript
class Box{
    constructor(num1,num2){
        this.num1 = num1;
        this.num2=num2;
    }
    sum(){
        return num1+num2;
    }
}
var box=new Box(12,88);
console.log(box.hasOwnProperty("num1"));//true
console.log(box.hasOwnProperty("num2"));//true
console.log(box.hasOwnProperty("sum"));//false
console.log("num1" in box);//true
console.log("num2" in box);//true
console.log("sum" in box);//true
console.log("say" in box);//false
```



类的所有实例共享一个原型对象，它们的原型都是**Person.prototype**，所以**proto**属性是相等的

```javascript
class Box{
    constructor(num1,num2){
        this.num1 = num1;
        this.num2=num2;
    }
    sum(){
        return num1+num2;
    }
}
// box1与box2都是Box的实例。它们的__proto__都指向Box的prototype
var box1=new Box(12,88);
var box2=new Box(40,60);
console.log(box1.__proto__===box2.__proto__);//true
```



**class不存在变量提升**，所以需要先定义再使用。因为ES6不会把类的声明提升到代码头部，但是ES5就不一样,**ES5存在变量提升**,可以先使用，然后再定义。

```javascript
//ES5可以先使用再定义,存在变量提升
new A();
function A(){

}
//ES6不能先使用再定义,不存在变量提升 会报错
new B();//B is not defined
class B{

}
```





## 继承

ES6中Class可以通过extends关键字实现继承，相比起ES5用修改原型链的方式来实现继承，要清晰方便很多。

```javascript
class Father {
    
}

class Son extends Father {
    
}
```



> 上面的例子中son通过extends关键字继承了father所有的属性和方法。（由于没有部署任何代码，所以这两个类是完全一样的，等于复制了一个father类到son中）



```javascript
// 定义父类
class Father {
    constructor (name) {
        this.name = name;
    }

    sayName() {
        return this.name;
    }
}

// 定义子类son继承于父类
class son extends Father {
    constructor(name, sex) {
        super(name);      // 调用父类的constructor(name);
        this.sex = sex;   // 给子类实例对象添加实例属性
    }

    sayName() {
        return super.sayName() + ', ' + this.sex;
        // 调用了父类的sayName()方法 
    }
}

let man = new son('小明', '男');
console.log(man.sayName())      //"小明, 男"   // 调用子类的sayName()方法
```



上述例子中子类在constructor中先调用了`super()`方法，**这实际上是在调用父类中的constructor方法，这是因为子类自己的this对象必须先通过父类的构造方法完成塑造，让它具备父类的实例属性和方法之后才能“改造它”，让它有自己的实例和方法。而不调用的话就得不到this对象。**

另外，在子类的构造函数中，只有调用`super()`之后，才可以使用**this**关键字，否则会报错。这是因为子类实例的构建，基于父类实例，只有super方法才能调用父类实例。



##### super 关键字

super既可以当做函数使用，也可以当做对象使用。这两种情况下，用法完全不同。

##### 当函数使用时

当作为函数调用时，表示父类的constructor构造方法。虽然此时代表父类的构造函数，但是super内的this指向的是子类（即子类的构造函数）。

同时，当它作为函数时，只能在子类的构造函数中使用（constructor中才能用），其他地方就会报错。

##### 当对象使用时

​	在普通方法中使用，指向父类的原型对象（类的普通方法都添加在类的原型对象上）

​	在静态方法中使用，指向父类（类的静态方法都是通过类的直接调用）



> **普通方法中：**

```javascript
class Person {
    // 构造函数，定义实例属性
    constructor() {
        this.sex = '男';
    }
    // 普通方法，定义在类的原型上，不懂看前篇博客
    sayHi() {
        return 'hi';
    }
}
Person.prototype.age = '18';

class man extends Person {
    constructor() {
        super();
        console.log(super.sayHi());  // 调用父类的普通方法
        console.log(super.age);  // 18
    }

    getSex() {
        return super.sex;   // 获取父类的sex属性
    }
}

let a = new man();  // "hi"
a.getSex(); // undefined
```

例子中，在子类的普通方法中调用super对象，因为sayHi()方法是父类中的普通方法，定义在父类的原型上，又普通方法中super对象指向父类的原型对象，所以可以通过super调用。同理，age定义字父类的原型对象上，所以可以通过super取到。而父类中sex为实例属性，定义在父类的实例对象上，而不在父类的原型对象上，所以用super对象取不到。



ES6规定，**在子类普通方法中通过super调用父类的方法时，**方法内部的this指向当前的子类实例。例如

```javascript
class Father {
    constructor () {
        this.a = 1
    }
    printA() {
        console.log(this.a)
    }
}

class Son extends Person {
    constructor () {
        super()
        this.a = 2
    }
    m() {
        super.printA()
    }
}

let b = new Son()
b.m() // 2
```

上面的代码中，虽然在m中调用的是父类的printA()方法，但是输出的却是2，这证明了普通函数中用super调用父类的方法，其this指向为当前子类实例。也就是说此时调用的其实是super.printA.call(this)。

又因为this指向为实例，所以如果通过super对某个属性赋值，这时的super就是this，赋值的属性就会变成子类实例的属性。例如：

```javascript
class father {
  constructor() {
    this.a = 1;
  }
}

class son extends father {
  constructor() {
    super();
    this.a = 2;
    super.a = 3;
    console.log(super.a);  //undefined
    console.log(this.a);  //3
  }
}

let b = new son();
```

可是如果当读取super.实例属性时，返回的是undefined，因为普通函数中的super指向为父类的原型，这里也就是读的father.prototype.x。



> 小总结： 

子类普通函数中把super当作对象使用，super指向父类的原型 

子类普通函数中利用super调用父类的方法时，this指向为当前子类实例 

子类普通函数中利用super.x = y给实例属性x赋值，则该子类实例this.x = y 

子类普通函数中读取super.x就是在读取父类原型的x属性（原因看第1条）







**当super作为对象在静态方法中，指向父类。**

```javascript
class father {
    static say(name) {
        console.log('static:' + name);
    }
    say(name) {
        console.log('instance:' +name );
    }
}

class son extends father {
    static say(name) {
        super.say(name);  // 在静态方法用super对象
    } 
    say(name) {
        super.say(name);  // 在普通方法中用super对象
    }
}

let man = new son('小明');

man.say();      //"instance:小明"
son.say();      //"static:小明"
```

例子中，man.say()是调用实例的say方法，即在子类普通方法中使用super，此时super指向父类原型，即通过super调用父类原型上的say()方法，即父类的普通方法say()；而son.say()是通过son类直接调用son类上的静态方法，而其中的super指向父类，所以相当于调用father.say()，就是父类上的静态方法say()。

**另外，在子类静态方法中通过super调用父类的方法时，内部的this指向当前的子类，而不是子类的实例。**

```javascript
class father {
  constructor() {
    this.a = 1;
  }
  static printA() {
    console.log(this.a);
  }
}

class son extends father {
  constructor() {
    super();
    this.a = 2;
  }
  static printA() {
    super.printA();
  }
}
son.a = 233;
son.printA();   //233
```

例子中，直接调用子类的静态方法，其中的super指向父类，相当于调用父类的printA()方法，而此时的this指向子类，而不是子类的实例，所以输出是233而不是2。

另外，在使用super时，要显示的指定是作为函数还是作为对象使用，否则会报错。





## 静态方法

不需要实例化类，即可直接通过该类来调用的方法，即称之为“静态方法”**。将类中的方法设为静态方法也很简单，在方法前加上static关键字即可。这样该方法就不会被实例继承！



```javascript
class Box{
    static a(){
        return "我是Box类中的，实例方法，无须实例化，可直接调用！"
    }
}
// 通过类名直接调用
console.log(Box.a());// 我是Box类中的，实例方法，无须实例化，可直接调用！
```



上面的代码一，类Box的a方法前有static关键字， 表明该方法是一个静态方法， 可以直接在Box类上调用。**静态方法只能在静态方法中调用,不能在实例方法中调用。**



```javascript
class Box{
    static a(){
        return "我只允许被静态方法调用哦！"
    }
    static b(){
        // 通过静态方法b来调用静态方法a
        console.log(this.a());
    }
}
Box.b();// 输出：我只允许被静态方法调用 哦
```



通过实例方法来调静态方法会报错：

```javascript
class Box{
    static a(){
        return "我只允许被静态方法调用哦！"
    }
    b(){
        console.log(this.a());// TypeError: this.a is not a function
    }
}
var obj=new Box();
obj.b();
```



父类的静态方法， 可以被子类继承：

```javascript
class Box {
    static a() {// 父类Box的静态方法
        return '我是父类的静态方法a';
    }
}
class Desk extends Box {}
// 子类Desk可以直接调用父类的静态方法a
console.log(Desk.a());
```



倘若想通过子类的静态方法调用父类的静态方法，需要从super对象上调用:

```javascript
class Box {
    static a() {
        return '我是通过super来调取出来的';
    }
}
class Desk extends Box {
    static a(){
        return super.a();
    }
}
console.log(Desk.a());
```

