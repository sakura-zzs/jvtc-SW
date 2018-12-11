# jvtc-SW
学工平台API接口

## 已经实现功能

* 登陆 login()
* 获取 学生信息 getUserinfo()

> 项目结构

* bin 项目主要的程序 
  * jvtc.js 主程序
* utils 帮助工具 函数
* app.js 主入口 

> 使用方法

``` JavaScript

// 支持 es6 async/await 语法
// 用户登陆信息 
const formdata = {
  loginName: "账号", loginPwd: "密码"
}
// 新建一个jvtc对象 尽量保证每个人登陆都有一个 唯一的对象
const jvtc = new Jvtc(formdata);
// 登陆账号 调用login() 返回 Promise 然后传递回调或者使用async/await
// 错误信息 和状态值 1 表示登陆成功
// const [error,stat] = await jvtc.login();
jvtc.login().then(async ([err,stat]) => {
  // 这里得到的 a 等同于 [error,stat]
  // 
  if(err)return;
  // 这里就可以获取 学生的信息
  const userinfo = await jvtc.getUserinfo()
  
})

```