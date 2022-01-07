//引入mongoose模块
const mongoose = require("mongoose");

//创建评论集合的规则
const commentSchema = new mongoose.Schema({
    //评论所属的文章id
    aid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Article",
    },
    //评论人的id
    uid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    time:{
        type:Date,
    },
    content:{
        type:String,
    }

});

//创建评论集合
const Comment = mongoose.model("Comment",commentSchema);

//将评论集合暴露出去
module.exports = {
    Comment,
}