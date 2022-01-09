# 编写可维护的webpack构建配置

## 构建配置包设计

##### 将构建包抽成 npm 包的意义是什么？

1. 通用性：将构建包抽离成一个npm包，在开发过程中无需关注这个包是如何配置的，只需要在开发之前引入这个包就可以了，另外，统一团队的的构建脚本，这个构建包由单独一个开发来维护，负责编写业务的开发无需关心构建包配置的修改，

2. 可维护性：对构建配置进行一个合理的拆分，比如 `webpack.base.js` `webpack.dev.js` `webpack.prod.js` `webpack.ssr.js`，通过这样的拆分，当我们想要对配置做修改的时候，代码看上去一目了然，在可维护性上面也比将所有的代码集中到一个文件里面更友好。

3. 质量

   将构建配置单独抽成一个 npm 包后，为了保证该 npm 包的质量，我们可以对这个包进行 `冒烟测试` `单元测试` `测试覆盖率`。

##### 构建配置管理的可选方案

1. 通过多个配置文件管理不同环境的构建，比如： `webpack.base.js` `webpack.dev.js` `webpack.prod.js` 通过 webpack --config 参数进行控制，从而输出不同环境的构建脚本，
2. 将构建配置设计成一个库发布到 npm，比如：`hjs-bpack` `webpack-blocks`，
3. 抽成一个工具进行管理，比如：`create-react-app` `vue-cli`

##### 构建配置包设计

通过多个配置文件管理不同环境的webpack配置，

+ 基础配置 webpack.base.js
+ 开发配置 webpack.dev.js
+ 生产环境 webpack.prod.js
+ 服务端渲染 webpack.ssr.js

抽成一个npm包统一管理

+ 规范：git commit 日志，README，ESlint规范，Semver 规范
+ 质量：冒烟测试 单元测试 测试覆盖率和CI



## 构建包功能模块设计

![](./image/base-config.png)



## 使用eslint规范构建脚本

前面，我们已经根据 功能模块设计 完成了文件的设计与开发，现在，我们将使用 eslint 来对构建脚本进行规范化，

`npm i eslint babel-eslint eslint-config-airbnb-base -D`

安装完成后开始处理 eslint 帮我们检查出的错误。