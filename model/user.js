//该文件用于创建用户集合
//引入mongoose模块
const mongoose = require("mongoose");
//引入joi模块
const Joi = require("joi");



//1、创建用户集合规则
const userSchema = new mongoose.Schema({
    username:{
        //设置用户名规则
        type:String,//用户名的类型为字符串
        required:true,//保证用户名不为空,即用户名是必填项
        minlength:2,//保证用户名的最小长度为2个字符
        maxlength:20,//保证用户名的最大长度为20个字符
    },

    email:{
        //设置邮箱的规则
        type:String,//邮箱的类型为字符串
        unique:true,//保证邮箱地址不重复，若邮箱地址重复则报错
    },

    password:{
        //设置密码的规则
        type:String,
        required:true,
    },

    role:{
        //admin代表超级管理员
        //normal代表普通用户
        type:String,
        required:true,
    },

    state:{
        type:Number,//设置状态值的类型为Number,若状态值为0则表示启用状态，若为1则表示禁用状态
        default:0,//表示状态值是可选的，默认值为0，即启用状态
    }

});

//2、使用用户集合规则创建用户集合
const User = mongoose.model("User",userSchema);
/*
async function createUser(){
    //genSalt(10);方法接收一个数值作为参数，数值越大，生成的随机字符串复杂度越高，数值越小，生成的随机字符串复杂度越低，默认值为10
    //该方法返回一个随机字符串
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash("123456",salt);
    const user = await User.create({
        username:"iteheima",
        email:"itheima@itcast.cn",
        password:pass,
        role:"admin",
        state:0
    },function(err){
        if(!err){
            console.log("插入文档成功！");
        }
    
    });
}
//添加默认用户
createUser();
*/

//声明验证用户信息函数
const validateUser = function(user){
    //定义用户对象的验证规则
    const schema = Joi.object({
        username:Joi.string().min(2).max(12).required().error(new Error("username不符合验证规则")),
        email:Joi.string().email().required().error(new Error("email不符合验证规则")),
        password:Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required().error(new Error("password不符合验证规则")),
        role:Joi.string().valid("normal","admin").required().error(new Error("role不符合验证规则")),
        state:Joi.number().valid(0,1).required().error(new Error("state不符合验证规则"))
    });

    //实施验证
    return schema.validateAsync(user);
}
//将用户集合作为模块成员向外暴露出去
module.exports = {
    User, 
    validateUser,
}