# 使用指南
## 依赖
```
python3
pulp
nodejs > v8.3
```
## 如何跑起来
注意：下面这一步由于要安装`npm`包`sqlite`，很容易出错，如果安装失败并且不好解决，请联系我，我在`程序设计思维`群里，昵称叫`hrsonion`。

注意：确保运行之前能访问互联网
```
$ cd be
$ npm install # 这一步出错的话一般重新输几次是可以解决的，我也不知道为什么
$ npm run init
$ python3 pyutils/test_algorithm.py # 方便助教测试我的算法，如果你想自己搞，我也不介意
$ cd ..
```
```
$ cd fe
$ npm install
$ cd ..
```
```
$ node start.js # 这一步会花掉一段时间，取决于你电脑的性能
```
## 关于算法的说明
算法文件是`be/pyutil/lp.py`
## 简单解释一下项目结构
```
be 后端
be/db 数据库文件储存位置（完成初始化之后才会出现）
be/init 初始化脚本
be/pyutils 算法
be/sequelize ORM配置文件
be/app.js 后端主程序
be/utils.js 如名

fe 前端
fe/src 程序源码，里面大部分文件都有用

start.js 帮助你同时开启前后端的脚本 你也可以手动执行里面的内容
```
## 其他问题
如果出现其他问题，请联系我，我在`程序设计思维`群里，昵称叫`hrsonion`
## 备注
作业里的每一项要求全部都完成了，如果你觉得我哪一项没完成，请联系我...

在 MacOS 上经过安装测试