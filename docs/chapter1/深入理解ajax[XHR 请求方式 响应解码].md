# 深入理解ajax [xhr 请求方式 响应解码]

1999年，微软公司发布IE5，第一次引入新功能：允许javascript脚本向服务器发起HTTP请求。这个功能当时并没有引起注意，直到2004年Gmail发布和2005年Google Map发布，才引起广泛重视。2005年2月，ajax这个词第一次正式提出，指围绕这个功能进行开发的一整套做法。从此，ajax成为脚本发起HTTP通信的代名词，W3C也在2006年发布了它的国际标准。



### 概述

　　ajax是asynchronous javascript and XML的简写，中文翻译是异步的javascript和XML，这一技术能够向服务器请求额外的数据而无须卸载页面，会带来更好的用户体验。虽然名字中包含XML，但ajax通信与数据格式无关

　　ajax包括以下几步骤：1、创建AJAX对象；2、发出HTTP请求；3、接收服务器传回的数据；4、更新网页数据

　　概括起来，就是一句话，ajax通过原生的`XMLHttpRequest`对象发出HTTP请求，得到服务器返回的数据后，再进行处理

 

### 创建

　　ajax技术的核心是XMLHttpRequest对象(简称XHR)，这是由微软首先引入的一个特性，其他浏览器提供商后来都提供了相同的实现。XHR为向服务器发送请求和解析服务器响应提供了流畅的接口，能够以异步方式从服务器取得更多信息，意味着用户单击后，可以不必刷新页面也能取得新数据

　　IE5是第一款引入XHR对象的浏览器。在IE5中，XHR对象是通过MSXML库中的一个ActiveX对象实现的，而IE7+及其他标准浏览器都支持原生的XHR对象

　　创建一个XHR对象，也叫实例化一个XHR对象，因为XMLHTTPRequest()是一个构造函数。下面是创建XHR对象的兼容写法

```javascript
var xhr;
if(window.XMLHttpRequest){
    xhr = new XMLHttpRequest();
}else{
    xhr = new ActiveXObject('Microsoft.XMLHTTP');
}
```

　　[注意]如果要建立N个不同的请求，就要使用N个不同的XHR对象。当然可以重用已存在的XHR对象，但这会终止之前通过该对象挂起的任何请求



### 发送请求

**open()**

　　在使用XHR对象时，要调用的第一个方法是open()，如下所示，该方法接受3个参数

```javascript
xhr.open("get","example.php", false);
```

　　1、open()方法的第一个参数用于指定发送请求的方式，这个字符串，不区分大小写，但通常使用大写字母。"GET"和"POST"是得到广泛支持的

　　"GET"用于常规请求，它适用于当URL完全指定请求资源，**当请求对服务器没有任何副作用以及当服务器的响应是可缓存的情况下**

　　"POST"方法常用于HTML表单。它在请求主体中包含额外数据且这些数据常存储到服务器上的数据库中。**相同URL的重复POST请求从服务器得到的响应可能不同，同时不应该缓存使用这个方法的请求**

　　除了"GET"和"POST"之外，参数还可以是"HEAD"、"OPTIONS"、"PUT"。而由于安全风险的原因，"CONNECT"、"TRACE"、"TRACK"被禁止使用



　　2、open()方法的第二个参数是URL，该URL相对于执行代码的当前页面，且**只能向同一个域中使用相同端口和协议的URL发送请求。**如果URL与启动请求的页面有任何差别，都会引发安全错误

　　3、open()方法的第三个参数是表示是否异步发送请求的布尔值，如果不填写，默认为true，表示异步发送

　　4、如果请求一个受密码保护的URL，把用于认证的用户名和密码作为第4和第5个参数传递给open()方法



**send()**

　　send()方法接收一个参数，即要作为请求主体发送的数据。调用send()方法后，请求被分派到服务器

　　如果是GET方法，send()方法无参数，或参数为null；如果是POST方法，send()方法的参数为要发送的数据



~~~javascript
xhr.open("get", "example.txt", false);
xhr.send(null);
~~~



### 接收响应

　　一个完整的HTTP响应由**状态码**、**http响应头集合**和**响应主体**组成。在收到响应后，这些都可以通过XHR对象的属性和方法使用，主要有以下4个属性

```javascript
responseText: 作为响应主体被返回的文本(文本形式)
responseXML: 如果响应的内容类型是'text/xml'或'application/xml'，这个属性中将保存着响应数据的XML DOM文档(document形式)
status: HTTP状态码(数字形式)
statusText: HTTP状态说明(文本形式)
```

　　在接收到响应后，第一步是检查status属性，以确定响应已经成功返回。一般来说，可以将HTTP状态码为200作为成功的标志。此时，responseText属性的内容已经就绪，而且在内容类型正确的情况下，responseXML也可以访问了。**此外，状态码为304表示请求的资源并没有被修改，可以直接使用浏览器中缓存的版本；当然，也意味着响应是有效的**

　　无论内容类型是什么，响应主体的内容都会保存到responseText属性中，而对于非XML数据而言，responseXML属性的值将为null

```javascript
if((xhr.status >=200 && xhr.status < 300) || xhr.status == 304){
    alert(xhr.responseText);
}else{
    alert('request was unsuccessful:' + xhr.status);
}
```



### 同步

　　如果接受的是同步响应，则需要将open()方法的第三个参数设置为false，那么send()方法将阻塞直到请求完成。一旦send()返回，仅需要检查XHR对象的status和responseText属性即可

　　同步请求是吸引人的，但应该避免使用它们。客户端javascript是单线程的，当send()方法阻塞时，它通常会导致整个浏览器UI冻结。如果连接的服务器响应慢，那么用户的浏览器将冻结

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
    //发送请求
    xhr.open('get','/uploads/rs/26/ddzmgynp/message.xml',false);
    xhr.send();
    //同步接受响应
    if(xhr.readyState == 4){
        if(xhr.status == 200){
            //实际操作
            result.innerHTML += xhr.responseText;
        }
    }
}
</script>
```



### 异步

　　**如果需要接收的是异步响应，这就需要检测XHR对象的readyState属性，该属性表示请求/响应过程的当前活动阶段。**这个属性可取的值如下：

```javascript
0(UNSENT):未初始化。尚未调用open()方法
1(OPENED):启动。已经调用open()方法，但尚未调用send()方法
2(HEADERS_RECEIVED):发送。己经调用send()方法，且接收到头信息
3(LOADING):接收。已经接收到部分响应主体信息
4(DONE):完成。已经接收到全部响应数据，而且已经可以在客户端使用了
```

　　理论上，只要readyState属性值由一个值变成另一个值，都会触发一次readystatechange事件。可以利用这个事件来检测每次状态变化后readyState的值。通常，我们对readyState值为4的阶段感兴趣，因为这时所有数据都已就绪

　　**[注意]必须在调用open()之前指定onreadystatechange 事件处理程序才能确保跨浏览器兼容性，否则将无法接收readyState属性为0和1的情况**

```javascript
xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
        if(xhr.status == 200){
            alert(xhr.responseText);
        }
    }
}

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
    //异步接受响应
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr.status == 200){
                //实际操作
                result.innerHTML += xhr.responseText;
            }
        }
    }
    //发送请求
    xhr.open('get','message.xml',true);
    xhr.send();
}
</script>    
//message.xml
<p>hello world</p>
```



### 超时

　　XHR对象的timeout属性等于一个整数，表示多少毫秒后，如果请求仍然没有得到结果，就会自动终止。该属性默认等于0，表示没有时间限制

　　如果请求超时，将触发ontimeout事件

　　[注意]IE8-浏览器不支持该属性

```javascript
xhr.open('post','test.php',true);
xhr.ontimeout = function(){
    console.log('The request timed out.');
}
xhr.timeout = 1000;
xhr.send();
```



---

### GET

　　GET是最常见的请求类型，最常用于向服务器查询某些信息，它适用于当URL完全指定请求资源，当请求对服务器没有任何副作用以及当服务器的响应是可缓存的情况下

【数据发送】

　　使用GET方式发送请求时，参数被追加到open()方法中URL的末尾

　　参数以问号开始，名和值之间用等号链接，名值对之间用和号(&)分隔。使用GET方式发送的数据常常被称为查询字符串

```javascript
xhr.open("get","example.php?name1=value1&name2=value2",true)
```

【编码】

　　由于URL无法识别特殊字符，所以如果数据中包含特殊字符(如中文)，则需要使用encodeURIComponent()进行编码

```javascript
var url = 'test.php' +'?name='  + encodeURIComponent("小火柴");
xhr.open('get',url,true);
```

　　上面的URL被编码为

```javascript
test.php?name=%E5%B0%8F%E7%81%AB%E6%9F%B4
```

【编码函数】

　　下面这个函数可以辅助向现有URL的末尾添加查询字符串参数

```javascript
function addURLParam(url,name,value){
    url += (url.indexOf("?") == -1 ? "?" : "&");
    url +=encodeURIComponent(name) + "=" + encodeURIComponent(value);
    return url;
}
```

　　这个addURLParam()函数接受三个参数：要添加参数的URL、参数的名称和参数的值。这个函数首先检查URL是否包含问号(以确定是否已经有参数存在)。如果没有，就添加一个问号；否则，就添加一个和号。然后，将参数名称和值进行编码，再添加到URL的末尾。最后返回添加参数之后的URL

```javascript
var url = 'test.php';
url = addURLParam(url,'name','aaa');
url = addURLParam(url,'data','bbb');

xhr.open('get',url,true);
```

【缓存】　　

　　在GET请求中，为了避免缓存的影响，可以向URL添加一个随机数或时间戳

```javascript
xhr.open('get',url+'&'+Number(new Date()),true);
xhr.open('get',url+'&'+Math.random(),true);
```



### POST

　　使用频率仅次于GET的是POST请求，通常用于服务器发送应该被保存的数据。"POST"方法常用于HTML表单。**它在请求主体中包含额外数据且这些数据常存储到服务器上的数据库中。**相同URL的重复POST请求从服务器得到的响应可能不同，同时不应该缓存使用这个方法的请求

　　POST请求应该把数据作为请求的主体提交，而GET请求传统上不是这样。POST请求的主体可以包含非常多的数据，而且格式不限。在open()方法第一个参数的位置传入"post"，就可以初始化一个POST请求

```javascript
xhr.open("post","example.php",true);
```

【设置请求头】

　　发送POST请求的第二步就是向send()方法中传入某些数据。由于XHR最初的设计主要是为了处理XML，因此可以在此传入XML DOM文档，传入的文档经序列化之后将作为请求主体被提交到服务器。当然，也可以在此传入任何想发送到服务器的字符串

　　**默认情况下，服务器对POST请求和提交Web表单的请求并不会一视同仁**。因此，服务器端必须有程序来读取发送过来的原始数据，并从中解析出有用的部分。不过，可以使用XHR来模仿表单提交：首先将Content-Type头部信息设置为application/x-www-form-urlencoded，也就是表单提交时的内容类型

```javascript
xhr.setRequestHeader("content-type","application/x-www-form-urlencoded");
```

　　如果不设置Content-Type，发送给服务器的数据就不会出现在$_POSR超级全局变量中。这时要访问同样的数据，须借助$HTTP_RAW_POST_DATA

　　**如果对相同的头调用多次setReQuestHeader()，新值不会取代之前指定的值。相反，HTTP请求将包含这个头的多个副本或这个头将指定多个值**

【发送主体】

　　接下来要以适当的格式创建一个字符串，并使用send()方法发送

　　POST数据的格式与查询字符串格式相同，名和值之间用等号链接，名值对之间用和号(&)分隔，如下所示

```javascript
xhr.send('name="abc"&num=123');
```

【编码和缓存】

　　**由于使用POST方式传递数据时，需要设置请求头"content-type"，这一步骤已经能够自动对特殊字符(如中文)进行编码，所以就不再需要使用encodeURIComponent()方法了**

　　POST请求主要用于数据提交，相同URL的重复POST请求从服务器得到的响应可能不同，所以不应该缓存使用POST方法的请求

【性能】

　　GET对所发送信息的数量有限制，一般在2000个字符。与GET请求相比，POST请求消耗的资源会更多一些。从性能角度来看，以发送相同的数据计，GET请求的速度最多可POST请求的两倍



---

我们接收到的响应主体类型可以是多种形式的，包括**字符串String**、**ArrayBuffer对象**、**二进制Blob对象**、**JSON对象**、**javascirpt文件**及表示XML文档的**Document对象**等。下面将针对不同的主体类型，进行相应的响应解码

### 属性

　　在介绍响应解码之前，要先了解**XHR对象**的属性。一般地，如果接收的数据是字符串，使用responseText即可，这也是最常用的用于接收数据的属性。但如果获取了其他类型的数据，使用responseText可能就不太合适了

【responseText】

　　responseText属性返回从服务器接收到的字符串，该属性为只读。如果本次请求没有成功或者数据不完整，该属性就会等于null。

　　如果服务器返回的数据格式是JSON、字符串、javascript或XML，都可以使用responseText属性

【response】

　　**response属性为只读，返回接收到的数据体。它的类型可以是ArrayBuffer、Blob、Document、JSON对象、或者一个字符串，这由XMLHttpRequest.responseType属性的值决定**

　　如果本次请求没有成功或者数据不完整，该属性就会等于null

　　[注意]IE9-浏览器不支持

【responseType】

　　**responseType属性用来指定服务器返回数据(xhr.response)的类型**

```javascript
“”：字符串(默认值)
“arraybuffer”：ArrayBuffer对象
“blob”：Blob对象
“document”：Document对象
“json”：JSON对象
“text”：字符串
```

【responseXML】

　　responseXML属性返回从服务器接收到的Document对象，该属性为只读。如果本次请求没有成功，或者数据不完整，或者不能被解析为XML或HTML，该属性等于null



### 字符串

　　如果服务器返回的结果是一个字符串，则直接使用responseText属性解析即可

### JSON

　　使用ajax最常用的传输方式就是使用JSON字符串，直接使用responseText属性解析即可

### js

　　使用ajax也可以接收js文件。仍然使用responseText来接收数据，但要使用eval()来执行代码

```javascript
<button id="btn">取得响应</button>
<div id="result"></div>
<script>
btn.onclick = function(){
    ajax({
        url:'p4.js',
        callback:function(data){
            eval(data);
            var html = '';
            for(var key in obj){
                html += '<div>' + key + ':' + obj[key] + '</div>';
            }
            result.innerHTML = html;
            html = null;
        }
    })
}
</script>
var obj = {
    '姓名':'小火柴',
    '年龄':28,
    '性别':'男'
}
```



### blob

　　在javascript中，Blob 通常表示二进制数据。但在实际Web应用中，Blob更多是图片二进制形式的上传与下载，虽然其可以实现几乎任意文件的二进制传输

　　**使用ajax接收blob数据，需要使用response来接收，并且将responseType设置为'blob'**

　　[注意]要完全兼容IE10+浏览器，需要将xhr.responseType设置在xhr.open()和xhr.send()方法之间

```javascript
<button id="btn">取得响应</button>
<div id="result"></div>
<script>
btn.onclick = function(){
    ajax({
        url:'p5.gif',
        callback:function(data){
            var img = document.createElement('img');
            img.onload = function(){
                URL.revokeObjectURL(img.src);
            }
            img.src = URL.createObjectURL(data);
            if(!result.innerHTML){
                result.appendChild(img);
            }
        },
        method:'post'
    })
}
function ajax(obj){
    //method为ajax提交的方式，默认为'get'方法
    obj.method = obj.method || 'get';
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
                //callback为回调函数，如果不设置则无回调
                obj.callback && obj.callback(xhr.response);
            }
        }
    }
    //创建数据字符串，用来保存要提交的数据
    var strData = '';
    if(obj.method == 'post'){
        for(var key in obj.data){
            strData += '&' + key + "=" + obj.data[key];
        }    
        //去掉多余的'&'
        strData = strData.substring(1); 
        xhr.open('post',obj.url,true);
        xhr.responseType = 'blob';
        //设置请求头
        xhr.setRequestHeader("content-type","application/x-www-form-urlencoded");
        //发送请求
        xhr.send(strData);    
    }else{
        //如果是get方式，则对字符进行编成
        for(var key in obj.data){
            strData += '&' + encodeURIComponent(key) + "=" + encodeURIComponent(obj.data[key]);
        }    
        //去掉多余的'&'，并增加随机数，防止缓存
        strData = strData.substring(1) + '&'+Number(new Date());   
        xhr.open('get',obj.url+'?'+strData,true);
        xhr.responseType = 'blob';
        //发送请求
        xhr.send();    
    }
}
</script>
```



### arraybuffer

　　arraybuffer 代表储存二进制数据的一段内存，而blob则用于表示二进制数据。通过ajax接收arraybuffer，然后将其转换为blob数据，从而进行进一步的操作

　　**responseType设置为arraybuffer，然后将response作为new Blob()构造函数的参数传递，生成blob对象**

```javascript
<button id="btn">取得响应</button>
<div id="result"></div>
<script>
btn.onclick = function(){
    ajax({
        url:'p5.gif',
        callback:function(data){
            var img = document.createElement('img');
            img.onload = function(){
                URL.revokeObjectURL(img.src);
            }
            img.src = URL.createObjectURL(new Blob([data]));
            if(!result.innerHTML){
                result.appendChild(img);
            }
       }
    })
}
function ajax(obj){
    //method为ajax提交的方式，默认为'get'方法
    obj.method = obj.method || 'get';
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
                //callback为回调函数，如果不设置则无回调
                obj.callback && obj.callback(xhr.response);
            }
        }
    }
    //创建数据字符串，用来保存要提交的数据
    var strData = '';
    if(obj.method == 'post'){
        for(var key in obj.data){
            strData += '&' + key + "=" + obj.data[key];
        }    
        //去掉多余的'&'
        strData = strData.substring(1); 
        xhr.open('post',obj.url,true);
        //设置请求头
        xhr.setRequestHeader("content-type","application/x-www-form-urlencoded");
        xhr.responseType = 'arraybuffer';
        //发送请求
        xhr.send(strData);    
    }else{
        //如果是get方式，则对字符进行编成
        for(var key in obj.data){
            strData += '&' + encodeURIComponent(key) + "=" + encodeURIComponent(obj.data[key]);
        }    
        //去掉多余的'&'，并增加随机数，防止缓存
        strData = strData.substring(1) + '&'+Number(new Date());   
        xhr.open('get',obj.url+'?'+strData,true);
        xhr.responseType = 'arraybuffer';
        //发送请求
        xhr.send();    
    }
}
</script>
```