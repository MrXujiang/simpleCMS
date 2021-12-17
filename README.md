<p align="center">
    <img src="http://cms.zhikume.cn/assets/logo.png" width="260" alt="cms, 网站博客系统, blog, forntend, nodejs, javascript">
</p>
<h1 align="center">SimpleCMS 👋</h1>
<p>
  <img alt="issues" src="https://img.shields.io/github/issues/MrXujiang/simpleCMS" />
  <img alt="forks" src="https://img.shields.io/github/forks/MrXujiang/simpleCMS" />
  <img alt="starts" src="https://img.shields.io/github/stars/MrXujiang/simpleCMS" />
  <img alt="license" src="https://img.shields.io/github/license/MrXujiang/simpleCMS" />
</p>

> simpleCMS 是一款开源 cms 系统, 主要为个人/团队快速开发博客或者知识共享平台, 类似于 hexo, worldpress, 但是他们往往需要复杂的搭建过程, 我们将复杂度降到最低, 并且有详细的部署教程, 你只需要有一台服务器, 就能轻松拥有一个属于你的博客平台。

> simpleCMS is an open source cms system, mainly for individuals/teams to quickly develop blogs or knowledge sharing platforms, similar to hexo, worldpress, but they often require complex build processes, we minimize complexity, and have detailed deployment tutorials, you only need a server, you can easily have a blog platform that belongs to you.

### 🏠 [Homepage](http://cms.zhikume.cn)

### ✨ [Demo](http://cms.zhikume.cn/home)

<img alt="simpleCMS" src="http://cms.zhikume.cn/assets/about.png" />

### 启动教程

1. 安装依赖
分别进入 `server` 和 `manage` 目录，执行：
```bash
# cd manage
yarn
# cd server
yarn
```

2. 本地启动

管理端启动：
```bash
# cd manage
yarn start
```

服务端启动：

```bash
# cd server
yarn start
```

为了让管理端能跨域调用server端接口， 需要在server/src/index.js 中配置跨域白名单：

```js
// 设置跨域
  app.use(
    cors({
      origin: function (ctx) {
        const whiteList = [
          "http://192.168.1.10:8000", // 你的管理后台ip地址，为了支持跨域调用
        ]; //可跨域白名单
        if (
          whiteList.includes(ctx.request.header.origin) &&
          ctx.url.indexOf(config.API_VERSION_PATH) > -1
        ) {
          return ctx.request.header.origin; //注意，这里域名末尾不能带/，否则不成功，所以在之前我把/通过substr干掉了，允许来自指定域名请求, 如果设置为*，前端将获取不到错误的响应头
        }
        return "";
      },
      exposeHeaders: ["WWW-Authenticate", "Server-Authorization", "x-show-msg"],
      maxAge: 5, //  该字段可选，用来指定本次预检请求的有效期，单位为秒
      credentials: true,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: [
        "Content-Type",
        "Authorization",
        "Accept",
        "X-Requested-With",
      ],
    })
  );
```

同时在manage/src/utils/index.ts中配置服务端ip，

``` js
export const SERVER_URL = 'http://192.168.1.10:3000'
```

### 部署教程

1. 静态资源打包

在manage项目中执行：

```bash
yarn build
```

后会自动把项目打包到server/static目录下，此时在server项目中执行：

```bash
yarn build
```

会把服务端代码打包，此时本地运行：

```bash
node dist/index.js
```
即可启动CMS项目。

2. 服务端部署

服务端部署可以用pm2做node应用的管理器，具体使用可以参考pm2官网。


### 技术反馈和交流群 | Technical feedback and communication

<img alt="技术反馈和交流群" src="http://cdn.dooring.cn/dr/qtqd_code.png" width="200" />
