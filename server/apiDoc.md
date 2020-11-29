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

### 3. 文章模块
|  名称   | api地址  |  方法  |  参数  |  resopnse |
|  ----  |  ----  |  ----  | ----————————  |  ----  |
| 添加文章  | /articles/add | post | { title, author, label, visible, content } | { fid }
| 查看文章  | /articles/get | get | id(文章id) | { title, author, label, ct, content }
| 查看所有文章  | /articles/all | get | query(可选) | [{title, author, label, ct, content}]
| 删除文章  | /articles/del | delete | id | 删除的文章id