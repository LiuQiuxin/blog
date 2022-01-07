const req = require("express/lib/request");

const guard = (request,response,next)=>{
    //判断用户访问的是否是登录页面
    //判断用户的登录状态
    //如果用户是登录的，将请求放行
    //如果用户不是登录的，将请求重定向到登录页面
    if(request.url != "/login" && !request.session.username){
        //用户是非登录状态，拦截请求
        response.redirect("/admin/login");
    }else{
        //若用户是登录状态且是普通用户则直接跳转到博客首页，并阻止程序向下执行
        if(request.session.role === "normal"){
            return response.redirect("/home/");
        }
        //用户是登录状态，将请求放行
        next();
    }
}

module.exports = guard;