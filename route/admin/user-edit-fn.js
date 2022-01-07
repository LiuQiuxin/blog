//引入用户集合
const {User, validateUser} = require("../../model/user");
//引入哈希加密模块
const bcrypt = require("bcrypt");
const admin = require("../admin");
module.exports = async (request,response,next)=>{
    //验证表单信息是否符合规则
    try{
        //验证通过，会跳出try-catch代码块
        request.body = await validateUser(request.body);
       
    }catch(ex){
        //验证失败，重定向到添加用户信息页面
        return next(JSON.stringify({path:"/admin/user-edit" , message:ex.message}));
    }

   

    //根据邮箱地址，查询用户是否存在
    const user = await User.findOne({email:request.body.email});
    if(user){
        //如果用户存在，代表邮箱地址已经被别人占用，不能添加，重定向到用户添加页面并结束程序
        return next(JSON.stringify({path:"/admin/user-edit",message:"邮箱地址被占用"}));
        //return response.redirect("/admin/user-edit?message=邮箱地址已经被占用");
    }else{
        //用户不存在，给密码进行加密，添加用户信息到数据库
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(request.body.password,salt);

        //将原来的密码替换成加密后的密码
        request.body.password = password;

        //将用户信息添加到数据库中
        await User.create(request.body);

        //将页面重定向到用户列表页面
        response.redirect("/admin/user");

    }
    
    
}