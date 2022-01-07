/*
    创建博客的展示页面路由文件
 */


//引入express框架
const express = require("express");

//创建博客的展示页面路由;调用express对象的Router方法，该方法会返回一个路由对象
const home = express.Router();

//在home路由下搭建二级路由，创建服务


//创建博客展示页面的首页展示路由
home.get("/",require("./home/index"));

//建立博客前台文章详情展示页面路由
home.get("/article",require("./home/article"));

//创建评论功能路由
home.post("/comment",require("./home/comment"));

//将路由对象作为模块成员进行导出
module.exports = home;