const {Comment} = require("../../model/comment");

module.exports = async function(req,res){
    //获取评论信息
    const {content,uid,aid} = req.body;
    //将评论信息存入评论集合
    await Comment.create({
        content:content,
        uid:uid,
        aid:aid,
        time:new Date(),
    });

    //将页面重定向回文章详情页面
    res.redirect("/home/article?id="+aid);
}