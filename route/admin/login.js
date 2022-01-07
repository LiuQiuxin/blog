//实现用户登录功能

//导入用户集合和哈希加密模块
const { User } = require("../../model/user");
const bcrypt = require("bcrypt");

module.exports = async function(request,response){
    //接收用户发送的请求参数,进行服务端验证
    const {email,password} = request.body;
    //若用户输入的邮箱和密码不为空，则执行登录密码校验
    if(email.trim().length === 0 || password.trim().length === 0){
        return response.status(400).render("admin/error",{msg:"邮件地址或者密码错误"});
    }

    //根据邮箱地址查询用户信息是否存在,若查询到变量，则user里面存的是查找到的对象，否则user为null
    let user = await User.findOne({email:email});
    if(user){
        //查询到了用户，检查客户端传递过来的密码与数据库中用户信息的密码是否一致
        if(await bcrypt.compare(password,user.password)){
            //密码一致，登录成功
            //将用户名存储到请求对象request中
            request.session.username = user.username;

            //将用户名储存在session对象中
            request.session.role = user.role;

            //将用户信息存储入app对象下的locals属性中，就可以在模板对象中直接使用该用户信息
            request.app.locals.userInfo = user;
            //登录成功，对用户的角色进行判断，超级管理员可以进入后台，普通用户只能进入前台页面
            if(user.role === "admin"){
                 //超级管理员重定向显示用户列表页面
                 response.redirect("/admin/user");
            }else{
               //普通用户重定向博客首页页面
               response.redirect("/home/");
            }
        }else{
            //登录失败
            return response.status(400).render("admin/error",{msg:"邮件地址或者密码错误"});
        }
    }else{
        //没有查询到用户
        return response.status(400).render("admin/error",{msg:"邮件地址或者密码错误"});
    }
}

