//实现用户退出功能

module.exports = (request,response)=>{
    //删除session
    console.log("a");
    request.session.destroy(function(){
        console.log("删除");
        //删除cookie
        response.clearCookie("connect.sid");
        //重定向到登录页面
        response.redirect("/admin/login");
        //清除模板中的用户信息
        request.app.locals.userInfo = null;
    });
}