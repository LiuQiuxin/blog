/*
    本文件是服务器项目的入口文件，即项目的主文件
 */

//引入express框架
const express = require("express");
//引入处理路径库path, 该库中封装了一些处理文件的小工具
const path = require("path");
//引入数据库连接模块
require("./model/connect");
//引入body-parser模块，用于处理POST请求参数
const bodyPaser = require("body-parser");
//导入express-session模块。返回一个session函数
const session = require("express-session");
//引入日期处理模块
const dateFormat = require("dateFormat");
//导入art-template模板引擎
const template = require("art-template");
//引入morgan模块，用户打印客户端向服务端发送的请求数据
const morgan = require("morgan");
//导入config模块
const config = require("config");






//创建网站服务器对象app
const app = express();
//对body-parse模块进行全局配置，处理POST请求参数
app.use(bodyPaser.urlencoded({extended:false}));

//使用app.use拦截所有的请求，并将请求交给session方法调用
app.use(session({
    secret:"secret key",
    saveUninitialized:false,
    cookie:{
        maxAge:24*60*60*1000,
    }
}));

//告诉express框架模板所在的位置  path.join()方法，使用当前操作系统的分隔符作为定界符将所有给定的path片段拼接在一起，然后规范化生成的路径
//__dirname用于动态的获取当前文件所处目录的绝对路径
app.set("views",path.join(__dirname,"views"));
//告诉express框架模板的后缀是什么
app.set("view engine","art");
//告诉express框架当渲染后缀为art的模板时，所使用的模板引擎是什么,express允许在同一个项目中使用不同  模板引擎
app.engine("art",require("express-art-template"));

//向模板内部导入dateFormat变量
template.defaults.imports.dateFormat = dateFormat;

//开放静态资源文件
app.use(express.static(path.join(__dirname,"public")));

//导入页面管理模块路由和登录页面路由
const home = require("./route/home");
const admin = require("./route/admin");
const res = require("express/lib/response");

//拦截请求，判断用户登录状态
app.use("/admin",require("./middleware/loginGuard"));

//为路由匹配请求路径
app.use("/home",home);
app.use("/admin",admin);

//添加错误处理中间件
app.use((err,request,response,next)=>{
    //将字符串类型转换为对象类型
    const result = JSON.parse(err);
    let params = [];
    for(let attr in result){
        if(attr != "path"){
            params.push(attr + "=" + result[attr]);
        }
    }

    response.redirect(`${result.path}?${params.join("&")}`);
   
});

//获取配置信息
console.log(config.get("title"));


//process.env用于获取系统环境变量，返回值是对象.对象里面存入了电脑中的环境变量
if(process.env.NODE_ENV === "development"){
    console.log("当前是开发环境");
    //实现在开发环境中在控制台中打印客户端向服务端发送的请求信息
    app.use(morgan("dev"))
}else{
    console.log("当前是生产环境");
}
//网站服务器需要监听一个端口才能向外提供服务,故调用网站服务器下的方法来监听端口,网站上线以后都默认监听80端口
app.listen(8000,()=>{
    console.log("网站服务器启动成功，请访问localhost");
});



