const { response } = require("express");
const {User} = require("../../model/user");
module.exports = async function(req,res){
    //获取客户端传递过来的请求参数
    let id = req.query.id;
    //根据用户id删除用户
    await User.deleteOne({ _id:id });
    //删除用户成功，将页面重定向回用户列表页面
   res.redirect("/admin/user");
}