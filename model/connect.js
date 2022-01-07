//当前文件用于连接数据库

//导入配置模块
const config = require("config");

//1、引入mongoose第三方模块
const mongoose = require("mongoose");

//2、调用connect方法,使用账号和密码连接数据库
mongoose.connect(`mongodb://${config.get("db.user")}:${config.get("db.pwd")}@${config.get("db.host")}:${config.get("db.port")}/${config.get("db.name")}`)
    .then(()=>console.log("数据库连接成功"))
    .catch(()=>console.log("数据库连接失败"));
