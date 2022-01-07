module.exports = function(request,response){
    //设置当前访问的是文章管理页面标识
    request.app.locals.currentLink = "article";
    response.render("admin/article-edit.art");
}