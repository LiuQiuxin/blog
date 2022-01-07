/*
    博客的管理页面路由文件
 */

//引入express文件
const { request } = require("express");
const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
const { append } = require("express/lib/response");

//创建一级路由对象
const admin = express.Router();

//在admin路由下搭建二级路由，创建服务

//創建博客展示頁面路由
admin.get("/login",require("./admin/loginPage"));


//创建实现登录页面路由
admin.post("/login", require("./admin/login"));


//創建用戶列表路由
admin.get("/user",require("./admin/userPage"));

//实现退出功能路由,哦那个给超链接a发送的请求都是get请求
admin.get("/logout",require("./admin/logout"));


//实现添加用户界面渲染路由
admin.get("/user-edit",require("./admin/user-edit"));

//创建实现用户添加功能路由
admin.post("/user-edit",require("./admin/user-edit-fn"));

//实现用户修改功能路由
admin.post("/user-modify",require("./admin/user-modify"));

//实现删除用户功能路由
admin.get("/delete",require("./admin/user-delete"));

//创建文章列表对面路由
admin.get("/article",require("./admin/article"));

//创建文章编辑页面路由
admin.get("/article-edit",require("./admin/article-edit"));

//实现文章添加功能的路由
admin.post("/article-add",require("./admin/article-add"));

//向外暴露admin路由
module.exports = admin;