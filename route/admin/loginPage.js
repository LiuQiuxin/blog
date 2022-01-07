//渲染博客登录页面
module.exports = (request,response)=>{

    //当浏览器访问到login路径时，渲染登录模板
    response.render("admin/login");
}