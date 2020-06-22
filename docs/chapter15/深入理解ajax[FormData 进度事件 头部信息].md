# 深入理解ajax [FormData 进度事件 头部信息]

现代Web应用中频繁使用的一项功能就是表单数据的序列化，XMLHttpRequest 2级为此定义了FormData类型。FormData为序列化表单以及创建与表单格式相同的数据提供了便利。

### 表单编码

　　当用户提交表单时，表单中的数据(每个表单元素的名字和值)编码到一个字符串中，并随请求发送。默认情况下，HTML表单通过POST方法发送给服务器，而编码后的表单数据则用做请求主体

　　对表单数据使用的编码方案相对简单：对每个表单元素的名字和值执行普通的URL编码(使用十六进制转义码替换特殊字符)，使用等号把编码后的名字和值分开，并使用"&"符号分开名/值对。一个简单表单的编码如下所示

```javascript
find=pizza&zipcode=01234&radius=1km
```

　　表单数据编码格式有一个正式的MIME类型

```javascript
application/x-www-form-urlencoded
```

　　当使用POST方法提交这种顺序的表单数据时，必须设置"Content-Type"请求头为这个值

　　[注意]这种类型的编码并不需要HTML表单，在Ajax应用中，希望发送给服务器的很可能是一个javascript对象

　　前面展示的数据变成javascript对象的表单编码形式可能是：

```javascript
{find: "pizza", zipcode: 01234, radius: "1km"}
```

　　表单编码在Web上如此广泛使用，同时所有服务器端的编程语言都能得到良好的支持，所以非表单数据的表单编码通常也是容易实现的事情

　　下面代码展示了如何实现对象属性的表单编码

```javascript
function encodeFormData(data){
    if (!data) return "";    //一直返回字符串
    var pairs = [];            //用于保存名值对
    for(var name in data){ 
        if (!data.hasOwnProperty(name)){
            continue;        //跳过继承属性
        }
        if (typeof data[name] === "function"){
            continue;         //跳过方法 
        }
        var value = data[name].toString();    //把值转换成字符串
        name = encodeURIComponent(name.replace("%20", "+")); //编码名字
        value = encodeURIComponent(value.replace("%20", "+"));//编码值
        pairs.push(name + "=" + value); // 存入名值对 
    }
    return pairs.join('&'); //返回使用'&'连接的名值对
} 
var data = {name:'小火柴',age:28,sender:'male'};
//name=%E5%B0%8F%E7%81%AB%E6%9F%B4&age=28&sender=male    
console.log(encodeFormData(data));  
```



### FormData

　　**当HTML表单同时包含文件上传元素和其他元素时，浏览器不能使用普通的表单编码而必须使用称为“multipart/form-data”的特殊Content-Type来用POST方法提交表单。**这种编码包括使用长“边界”字符串把请求主体分离成多个部分。对于文本数据，手动创建“multipart/form-data”请求主体是可能的，但很复杂

　　XMLHttpRequest 2级为此定义了FormData类型。FormData为序列化表单以及创建与表单格式相同的数据(用于通过XHR传输)提供了便利

　　[注意]IE9-浏览器不支持

【构造函数】

```javascript
new FormData (form? : HTMLFormElement)
```

　　可选参数form表示一个HTML表单元素，可以包含任何形式的表单控件，包括文件输入框

【append()】

　　append()方法用于给当前FormData对象添加一个键/值对

```javascript
void append(DOMString name, Blob value, optional DOMString filename);
void append(DOMString name, DOMString value);
```

　　参数值name表示字段名称；参数值value表示字段值；参数值filename(可选)用于指定文件的文件名，当value参数被指定为一个Blob对象或者一个File对象时，该文件名会被发送到服务器上，对于Blob对象来说，这个值默认为"blob"

【其他不常用方法】

　　get()：通过get(key)/getAll(key)来获取对应的value

　　set()：通过set(key,value)修改数据，如果指定的key不存在则新增一条，如果存在，则修改对应的value值

　　has()：通过has(key)来判断是否对应的key值

　　delete()：通过delete(key)来删除数据

　　[注意]以上4个不常用方法，IE浏览器都不支持

```javascript
var oData1 = new FormData();
console.log(oData1.has('a'));//false
oData1.append('a',1);
console.log(oData1.has('a'));//true
console.log(oData1.get('a'));//1
oData1.set('a',2);
oData1.append('a',1);
console.log(oData1.get('a'));//2
console.log(oData1.getAll('a'));//["2", "1"]
oData1.delete('a');
console.log(oData1.get('a'));//null
<form action="#" name="form1">
    <input type="text" value="1" name="a">
</form>
<script>
var oData1 = new FormData(document.forms.form1);
console.log(oData1.has('a'));//true
console.log(oData1.get('a'));//1
oData1.append('a',2);
console.log(oData1.get('a'));//1
console.log(oData1.getAll('a'));//['1','2']
</script>
```

　　一般地，我们使用FormData()构造函数创建FormData对象，然后按需多次调用这个对象的append()方法把个体“部分”(可以是字符串、File或Blob对象)添加到请求中。最后，把FormData对象传递给send()方法，通过XHR对象将其发送到服务器

　　**[注意]multipart/form-data只能用于post方式**

```javascript
<form action="#" name="form1">
<select name="a">
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
</select>
</form>
<div id="result"></div>
<script>
var oForm = document.forms.form1;
oForm.onchange = function(){
    //创建xhr对象
    var xhr;
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    //异步接受响应
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr.status == 200){
                //实际操作
                result.innerHTML = xhr.responseText;
            }
        }
    }
    //发送请求
    xhr.open('post','t1.php' ,true);
    xhr.send(new FormData(form1)); 
}
</script>
```



### http请求参数之Query String Parameters、Form Data、Request Payload

在与server端进行数据传递时，通常会用到GET、POST方法进行参数提交，而参数提交的方式，通常取决于server端对数据的接收方式。

### Query String Parameters

当发起一次GET请求时，参数会以url string的形式进行传递。即`?`后的字符串则为其请求参数，并以`&`作为分隔符。

~~~javascript
x=1&y=2
~~~



### Form Data

当发起一次POST请求时，若未指定content-type，则默认content-type为application/x-www-form-urlencoded。即参数会以Form Data的形式进行传递，不会显式出现在请求url中。

~~~javascript
// Request Headers
content-type: application/x-www-form-urlencoded; charset=UTF-8

// Form Data
x=1&y=2
~~~



### Request Payload

当发起一次POST请求时，若content-type为application/json，则参数会以Request Payload的形式进行传递（显然的，数据格式为JSON），不会显式出现在请求url中。

~~~javascript
// Request Headers
content-type: application/json; charset=UTF-8

// Request Payload
x=1&y=2
~~~



**如果希望通过Form Data的方式来传递数据，则可以通过原生方法formData来进行数据组装，且content-type需要设置为multipart/form-data。**



---



一般地，使用readystatechange事件探测HTTP请求的完成。XHR2规范草案定义了进度事件Progress Events规范，XMLHttpRequest对象在请求的不同阶段触发不同类型的事件，所以它不再需要检査readyState属性。这个草案定义了与客户端服务器通信有关的事件。这些事件最早其实只针对XHR操作，但目前也被其他API(如File API)借鉴。

### 基础

　　有以下6个进度事件

　　loadstart: 在接收到响应数据的第一个字节时触发

　　progress: 在接收响应期间持续不断地触

　　error: 在请求发生错误时触发

　　abort: 在因为调用abort()方法而终止连接时触发

　　load: 在接收到完整的响应数据时触发

　　loadend: 在通信完成或者触发error、abort或load事件后触发

　　timeout: 超时发生时触发

　　[注意]IE9-浏览器不支持以上事件(IE9浏览器仅支持load事件)

　　每个请求都从触发loadstart事件开始，接下来，通常每隔50毫秒左右触发一次progress事件，然后触发load、error、abort或timeout事件中的一个，最后以触发loadend事件结束

　　**对于任何具体请求，浏览器将只会触发load、abort、timeout和error事件中的一个。XHR2规范草案指出一旦这些事件中的一个发生后，浏览器应该触发loadend事件**



### load

　　响应接收完毕后将触发load事件，因此也就没有必要去检查readyState属性了。但一个完成的请求不一定是成功的请求，例如，load事件的处理程序应该检查XMLHttpRequest对象的status状态码来确定收到的是“200 OK”而不是“404 Not Found”的HTTP响应

```javascript
<button id="btn">获取信息</button>
<div id="result"></div>
<script>
btn.onclick = function(){
    //创建xhr对象
    var xhr;
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    //进度事件
    xhr.onload = function(){
        if(xhr.status == 200){
            result.innerHTML += xhr.responseText;
        }
    }
    //发送请求
    xhr.open('get','message.xml',true);
    xhr.send();
}
</script>
```



### progress

　　**progress事件会在浏览器接收新数据期间周期性地触发。而onprogress事件处理程序会接收到一个event对象，其target属性是XHR对象，但包含着三个额外的属性：lengthComputable、loaded和total。其中，lengthComputable是一个表示进度信息是否可用的布尔值，loaded表示已经接收的字节数，total表示根据Content-Length响应头部确定的预期字节数。**有了这些信息，就可以为用户创建一个进度指示器了

```javascript
<button id="btn">获取信息</button>
<div id="result"></div>
<div id="music"></div>
<script>
btn.onclick = function(){
    //创建xhr对象
    var xhr;
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    //进度事件
    xhr.onprogress = function(e){
        e = e || event;
        if (e.lengthComputable){
            result.innerHTML = "Received " + e.loaded + " of " + e.total + " bytes";
        }
    };
    xhr.onload = function(e){
        var data = xhr.response;
        e = e || event;
        if(xhr.status == 200){
            var audio = document.createElement('audio');
            audio.onload = function(){
                URL.revokeObjectURL(audio.src);
            }
            audio.src = URL.createObjectURL(data);
             console.log(audio);
            audio.setAttribute('controls','');
            if(!music.innerHTML){
                music.appendChild(audio);
            }
        }
    };
    //发送请求
    xhr.open('get','myocean.mp3',true);
    xhr.responseType = 'blob';
    xhr.send();
}
</script> 
```



### 上传进度

　　**除了为监控HTTP响应的加载定义的这些有用的事件外，XHR2也给出了用于监控HTTP请求上传的事件。在实现这些特性的浏览器中，XMLHttpRequest对象将有upload属性。upload属性值是一个对象，它定义了addEventListener()方法和整个progress事件集合，比如onprogress和onload(但upload对象没有定义onreadystatechange属性，upload仅能触发新的事件类型)**

　　**能仅仅像使用常见的progress事件处理程序一样使用upload事件处理程序。对于XMLHttpRequest对象，设置XHR.onprogress以监控响应的下载进度，并且设置XHR.upload.onprogress以监控请求的上传进度**

```javascript
<input type="file" name="file1" id="file1" style="display:none">
<button id="btn">上传文件</button>
<div id="pro"></div>
<div id="result"></div>
<script>
btn.onclick = function(){
    file1.click();
    pro.innerHTML = result.innerHTML = '';
}
file1.onchange = function(){
    //创建xhr对象
    var xhr;
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    var data = file1.files[0];
    //上传事件
    xhr.upload.onprogress = function(e){
        e = e || event;
        if (e.lengthComputable){
            pro.innerHTML = "上传进度为：" + e.loaded + " of " + e.total + " bytes" + '；百分比为：' + e.loaded/e.total;
        }
    }
    xhr.onload = function(e){
        var data = xhr.responseText;
        e = e || event;
        if(xhr.status == 200){
            result.innerHTML =  data;
        }
    };
    //发送请求
    xhr.open('post','pp.php',true);
    xhr.setRequestHeader("content-type",data.type);
    xhr.send(data);
}
</script>
```



### 其他事件

　　HTTP请求无法完成有3种情况，对应3种事件。如果请求超时，会触发timeout事件。如果请求中止，会触发abort事件。最后，像太多重定向这样的网络错误会阻止请求完成，但这些情况发生时会触发error事件

　　可以通过调用XMLHttpRequest对象的abort()方法来取消正在进行的HTTP请求。调用abort()方法在这个对象上触发abort事件

　　调用abort()的主要原因是完成取消或超时请求消耗的时间太长或当响应变得无关时。假如使用XMLHttpRequest为文本输入域请求自动完成推荐。如果用户在服务器的建议达到之前输入了新字符，这时等待请求不再有用，应该中止

　　XHR对象的timeout属性等于一个整数，表示多少毫秒后，如果请求仍然没有得到结果，就会自动终止。该属性默认等于0，表示没有时间限制

　　如果请求超时，将触发ontimeout事件

```javascript
var xhr = new XMLHttpRequest();
btn.onclick = function(){
    xhr.abort();
};
xhr.ontimeout = function(){
    console.log('The request timed out.');
}
xhr.timeout = 100;
xhr.onabort = function(){
    console.log("The transfer has been canceled by the user.");
}
xhr.onerror = function(){
    console.log("An error occurred while transferring the file.");    
}
xhr.onloadend = function(){
    console.log("请求结束");    
}
```



---



每个HTTP请求和响应都会带有相应的头部信息，其中有的对开发人员有用。XHR对象提供了操作头部信息的方法。本文将详细介绍HTTP的头部信息

### 默认信息

　　默认情况下，在发送XHR请求的同时，还会发送下列头部信息

```javascript
Accept: 浏览器能够处理的内容类型
Accept-Charset: 浏览器能够显示的字符集
Accept-Encoding: 浏览器能够处理的压缩编码
Accept-Language: 浏览器当前设置的语言
Connection: 浏览器与服务器之间连接的类型
Cookie: 当前页面设置的任何Cookie
Host: 发出请求的页面所在的域
User-Agent: 浏览器的用户代理字符串
Referer: 发出请求的页面的URI
```

　　[注意]HTTP规范将这个头部字段拼错了，而为保证与规范一致，也只能将错就错(正确拼写应该是referrer)

 

### 设置头部

　　使用setRequestHeader()方法可以设置自定义的请求头部信息。这个方法接受两个参数：头部字段的名称头部字段的值。要成功发送请求头部信息，必须在调用open()方法之后且调用send()方法之前调用setRequestHeader()方法 

　　setRequestHeader()方法的一个常用用途是使用POST请求时，将Content-Type的头部信息设置为表单提交的内容类型

```javascript
xhr.open('post','service.php',true);
xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
xhr.send('data=test123');
```

　　[注意]尽量使用自定义头部字段名称，不要使用浏览器正常发送的字段名称，否则可能会影响服务器的响应

```javascript
xhr.open('get','test.php',true);
xhr.setRequestHeader('myHeader','myValue');
xhr.send();    
```

　　经测试，浏览器无法将自定义的头部字段添加到报文中

 

### 获取头部

　　调用XHR对象的getResponseHeader()方法并传入头部字段名称，可以取得相应的响应头部信息。而调用getAllResponseHeaders()方法则可以取得一个包含所有头部信息的长字符串

```javascript
var xhr;
if(window.XMLHttpRequest){
    xhr = new XMLHttpRequest();
}else{
    xhr = new ActiveXObject('Microsoft.XMLHTTP');
}
//异步接受响应
xhr.onreadystatechange = function(){
    if(xhr.readyState == 4){
        if(xhr.status == 200){
             /*
             Date: Wed, 01 Mar 2017 14:00:21 GMT
            Server: Apache/2.4.9 (Win32) PHP/5.5.12
            Connection: Keep-Alive
            X-Powered-By: PHP/5.5.12
            Content-Length: 1134
            Keep-Alive: timeout=5, max=99
            Content-Type: text/html
              */
            console.log(xhr.getAllResponseHeaders());
            console.log(xhr.getResponseHeader('keep-alive'));//timeout=5, max=99
        }else{
            alert('发生错误：' + xhr.status);
        }
    }
}
//发送请求
xhr.open('get','test.php',true);
xhr.send();
```