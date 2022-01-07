const res = require("express/lib/response");
const {Article} = require("../../model/article");
//导入mongoose-sex-page模块
const pagination = require("mongoose-sex-page");
module.exports = async function(request,response){
    //设置当前访问的是文章管理页面标识
    request.app.locals.currentLink = "article";
    //接收客户端传递过来的页码
    const page = request.query.page;
    //查询所有文章数据,使用popular方法实现联合查询,方法需要一个查询字段作为参数
    let articles = await pagination(Article).find({}).page(page).size(1).display(3).populate("author").exec();
    articles = JSON.stringify(articles);
    articles = JSON.parse(articles);
   // response.send(articles);
    //渲染文章列表页面模板
   response.render("admin/article.art",{
        articles:articles,
    });
}