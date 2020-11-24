## SimpleCMS接口文档

> 接口前缀统一为: /api/v0

### 1. 用户模块

#### 1.1 登录
|  名称   | api地址  |  方法  |  参数  |  resopnse |
|  ----  |  ----  |  ----  | ----————————  |  ----  |
| 登录  | /user/login | post | { name: string, pwd: string } | { name: 'test', pwd: '123456', role: '0/1/2'}, 0为超级管理员



### 2. 文件模块
|  名称   | api地址  |  方法  |  参数  |  resopnse |
|  ----  |  ----  |  ----  | ----————————  |  ----  |
| 上传文件(需登录)  | /files/upload | post | file | {filename, url, source, size}
| 上传文件(不需要登录)  | /files/upload/free | post | file | {filename, url, source, size}
| 上传头像  | /files/upload/tx | post | file | {filename, url, source, size}