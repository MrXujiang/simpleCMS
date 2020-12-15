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
| 添加文章  | /articles/add | post | { title, author, label, face_img, visible, type, content } | { fid }
| 修改文章  | /articles/mod | put | { title, author, label, visible, face_img, type, content } | { fid }
| 查看文章  | /articles/get | get | id(文章id) | { title, author, label, ct, face_img, content, html }
| 查看所有文章  | /articles/all | get | query(可选) | [{title, author, label, ct, ut, face_img, content}]
| 置顶文章  | /article/top | post | fid | {msg: '已置顶'}
| 删除文章  | /articles/del | delete | id | 删除的文章id
| 保存草稿  | /articles/drafts/save | post | 同添加文章 | 同添加文章
| 获取草稿列表  | /articles/drafts | get | 同查看所有文章 | 同查看所有文章
| 获取单篇草稿  | /articles/draft/get | get | 同查看文章 | 同查看文章
| 删除草稿  | /articles/draft/del | delete | id | 删除的草稿id
| 评论文章  | /article/comment/save | post | {id, comment} | {msg: '评论成功'}
| 文章点赞  | /article/flover/save | post | {id} | {msg: '点赞成功'}
| 获取文章数量 | /articles/num | get | null | {num: 20}
| 获取评论点赞数据  | /article/comments | get | {id} | {views: 21, flover: 12, comments: []}
| 文章统计数据  | /articles/anazly | get | null | {views: 21, flovers: 12, comments: 20}

### 4. 网站配置模块
|  名称   | api地址  |  方法  |  参数  |  resopnse |
|  ----  |  ----  |  ----  | ----————————  |  ----  |
| 更新用户信息(需登录)  | /setting/userInfo/save | put | {email, username, desc, country, addr, phone, wx, tx, job} | {msg: "更新成功/失败"}
| 获取用户信息  | /setting/userInfo/get | get | 无需参数 | {email, username, desc, country, addr, phone, wx, tx, job}
| 更新网站信息(需登录)  | /setting/website/save | put | {logo, title, desc, r_text, r_link} | {msg: "更新成功/失败"}
| 获取网站信息  | /setting/website/get | get | 无需参数 | {logo, title, desc, r_text, r_link}

### 5. 广告管理模块
|  名称   | api地址  |  方法  |  参数  |  resopnse |
|  ----  |  ----  |  ----  | ----————————  |  ----  |
| 保存广告  | /ads/save | post | {topAd:{link:'',imgUrl:'',text:''}, sideAd:{link:'',imgUrl:'',text:''}} | {msg: "成功"}
| 获取广告  | /ads/get | get | null | {topAd:{link:'',imgUrl:'',text:''}, sideAd:{link:'',imgUrl:'',text:''}}
