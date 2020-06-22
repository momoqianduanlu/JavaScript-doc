# CORS

通过XHR实现Ajax通信的一个主要限制，来源于跨域安全策略。默认情况下，XHR对象只能访问与包含它的页面位于同一个域中的资源。这种安全策略可以预防某些恶意行为。但是，实现合理的跨域请求对开发某些浏览器应用程序也是至关重要的。CORS(Cross-Origin Resource Sharing)跨源资源共享是W3C的一个工作草案，定义了在必须访问跨源资源时，浏览器与服务器应该如何沟通。它允许浏览器向跨源服务器，发出XMLHttpRequest请求，从而克服了AJAX只能同源使用的限制。



### 简单请求

　　浏览器将CORS请求分成两类：简单请求(simple request)和非简单请求(not-so-simple request)

　　只要同时满足以下两大条件，就属于简单请求

　　1、请求方法是以下三种方法之一：HEAD、GET、POST

　　2、HTTP的头信息不超出以下几种字段：Accept、Accept-Language、Content-Language、Last-Event-ID、(Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain)

　　凡是不同时满足上面两个条件，就属于非简单请求

　　CORS背后的基本思想，就是使用自定义的HTTP头部让浏览器与服务器进行沟通，从而决定请求或响应是应该成功，还是应该失败

　　对于简单请求，浏览器直接发出CORS请求。具体来说，就是在头信息之中，需要给它附加一个额外的origin头部，其中包含请求页面的源信息(协议、域名和端口)，以便服务器根据这个头部信息来决定是否给予响应

　　浏览器如果发现跨源AJAX请求是简单请求，就自动在头信息之中，添加一个Origin字段

```http
Accept:*/*
Accept-Encoding:gzip, deflate, br
Accept-Language:zh-CN,zh;q=0.8,en;q=0.6
Connection:keep-alive
Content-Length:0
Host:www.webhuochai.com
Origin:http://127.0.0.1
Referer:http://127.0.0.1/cors.html
User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36
```

　　上面的头信息中，Origin字段用来说明，本次请求来自哪个源(协议 + 域名 + 端口)。服务器根据这个值，决定是否同意这次请求

　　如果服务器认为这个请求可以接受，就在Access-Control-Allow-Origin头部中回发相同的源信息(如果是公共资源，可以回发" *" )

```http
Request URL:https://www.webhuochai.com/test/iecors.php
Request Method:POST
Status Code:200 OK
Remote Address:218.247.93.253:443
Referrer Policy:no-referrer-when-downgrade
```

　　如果Origin指定的源，不在许可范围内，服务器会返回一个正常的HTTP回应。浏览器发现，这个回应的头信息没有包含Access-Control-Allow-Origin字段，就知道出错了，从而抛出一个错误，被XMLHttpRequest的onerror回调函数捕获。但是，这种错误无法通过状态码识别，因为HTTP回应的状态码有可能是200

　　[注意]请求和响应都不包含cookie信息



### 原生支持

　　标准浏览器都通过XMLHttpRequest对象实现了对CORS的原生支持。在尝试打开不同来源的资源时，无需额外编写代码就可以触发这个行为。要请求位于另一个域中的资源，使用标准的XHR对象并在open()方法中传入绝对URL即可

　　[注意]IE9-浏览器不支持

```javascript
<input id="btn" type="button" value="跨域请求">
<div id="result"></div>
<script>
btn.onclick = function(){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if ((xhr.status >= 200 && xhr.status < 300)|| xhr.status == 304){
                result.innerHTML = xhr.responseText;
            }else{
                alert("Request was unsuccessful: " + xhr.status);
            }    
        }
    };
    xhr.open("post", "https://www.webhuochai.com/test/iecors.php", true);
    xhr.send(null);    
}
</script>    
```

　　CORS主要需要在后端进行设置，以PHP为例

　　通过设置header()方法，“*”号表示允许任何域向服务端提交请求：

```http
header( " Access-Control-Allow-Origin: * " );
```

　　也可以设置指定的域名，如域名"`https://www.webhuochai.com`"，那么就允许来自这个域名的请求

```http
header( " Access-Control-Allow-Origin: https://www.webhuochai.com" );
```

　　通过跨域XHR对象可以访问status和statusText属性，而且还支持同步请求。跨域XHR对象也有一些限制，但为了安全这些限制是必需的

　　**1、不能使用setRequestHeader()设置自定义头部**

　　**2、不能发送和接收cookie**

　　**3、调用getAllResponseHeaders()方法总会返回空字符串**

　　由于无论同源请求还是跨源请求都使用相同的接口，因此对于本地资源，最好使用相对URL，在访问远程资源时再使用绝对URL。这样做能消除歧义，避免出现限制访问头部或本地cookie信息等问题



### Preflight

　　CORS通过一种叫做Preflighted Requests**(预检请求)**的透明服务器验证机制支持开发人员使用**自定义的头部、GET或POST之外的方法，以及不同类型的主体内容**

　　[注意]IE10-浏览器不支持

　　在使用下列高级选项来发送请求时，就会向服务器发送一个Preflight请求。这种请求使用**OPTIONS**方法，发送下列头部

　　1、Origin:与简单的请求相同

　　2、Access-Control-Request-Method:请求自身使用的方法

　　3、Access-Control-Request-Headers:(可选)自定义的头部信息，多个头部以逗号分隔

　　以下是一个带有自定义头部NCZ的使用POST方法发送的请求

```http
Origin: http://www.nczonline.net
Access-Control-Request-MeChod: POST
Access-Control-Request-Headers: NCZ
```

　　发送这个请求后，服务器可以决定是否允许这种类型的请求。服务器通过在响应中发送如下头部与浏览器进行沟通

　　**1、Access-Control-Allow-Origin:与简单的请求相同**

　　**2、Access-Control-Allow-Methods:允许的方法，多个方法以逗号分隔**

　　**3、Access-Control-Allow-Headers:允许的头部，多个头部以逗号分隔**

　　**4、Access-Control-Max-Age:应该将这个Preflight请求缓存多长时间(以秒表示)**

```http
Access-Control-Allow-Origin: http://www.nczonline.net
Access-Control-Allow-Methods: POST, GET
Access-Control-Allow-Headers: NCZ
Access-Control-Max-Age: 1728000
```

　　Preflight请求结束后，结果将按照响应中指定的时间缓存起来。而为此付出的代价只是第一次发送这种请求时会多一次HTTP请求



### 带凭据请求

　　**默认情况下，跨源请求不提供凭据(cookie、HTTP认证及客户端SSL证明等)。通过将withCredentials属性设置为true，可以指定某个请求应该发送凭据**

　　[注意]IE10-浏览器不支持

　　如果服务器接受带凭据的请求，会用下面的HTTP头部来响应

```http
Access-Control-Allow-Credentials: true
```

　　开发者必须在AJAX请求中打开withCredentials属性

```http
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
```

　　否则，即使服务器同意发送Cookie，浏览器也不会发送。或者，服务器要求设置Cookie，浏览器也不会处理

　　但是，如果省略withCredentials设置，有的浏览器还是会一起发送Cookie。这时，可以显式关闭withCredentials

```http
xhr.withCredentials = false;
```

　　**如果发送的是带凭据的请求，但服务器的响应中没有包含这个头部，那么浏览器就不会把响应交给javascript(于是，responseText中将是空字符串，status的值为0，而且会调用onerror()事件处理程序)。**另外，服务器还可以在Preflight响应中发送这个HTTP头部，表示允许源发送带凭据的请求

　　**需要注意的是，如果要发送Cookie，Access-Control-Allow-Origin就不能设为星号，必须指定明确的、与请求网页一致的域名。同时，Cookie依然遵循同源政策，只有用服务器域名设置的Cookie才会上传，其他域名的Cookie并不会上传，且(跨源)原网页代码中的document.cookie也无法读取服务器域名下的Cookie**