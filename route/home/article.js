const {Article} = require("../../model/article");
const {Comment} = require("../../model/comment");
module.exports = async function(req,res){
   
    //接收客户端传递过来的文章id值
    const id = req.query.id;
    //根据id值查询文章详细信息
    const article = await Article.findOne({_id:id}).populate("author").lean();
    
    //查询当前文章所对应的评论信息
    let comments = await Comment.find({aid:id}).populate("uid").lean();
    res.render("home/article",{
        article:article,
        comments:comments,
    });

}