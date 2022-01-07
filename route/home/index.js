const {Article} = require("../../model/article");
const pagination = require("mongoose-sex-page");
module.exports = async function(req,res){
    //接收客户端传递过来的页码
    let page = req.query.page;
    //从数据库中查找数据
    let result = await pagination(Article).page(page).size(2).display(5).find().populate("author").exec();
    //渲染模板并向模板中传递数据
    result = JSON.stringify(result);
    result = JSON.parse(result);
    res.render("home/default",{
        result:result,
    });
}