const {User} = require("../../model/user");
const bcrypt = require("bcrypt");
module.exports = async (request,response,next)=>{
    //接收客户端表单传递过来的请求参数
    const body = request.body;
    //接收客户端传递过来的要修改的用户id
    const id = request.query.id;

    //根据id查询数据库中的用户信息
    let user = await User.findOne({_id:id});
   //进行密码比对
   let isValid = await bcrypt.compare(body.password,user.password);
   if(isValid){
       //密码比对成功,将用户信息更新到数据库中
       await User.updateOne({_id:id },{
           username:body.username,
           email:body.email,
           role:body.role,
           state:body.state
       });
       //将页面重定向到用户列表页面
       response.redirect("/admin/user");
       

   }else{
       //密码比对失败,触发错误处理中间件
       let obj = {path:"/admin/user-edit",message:"密码比对失败，不能进行用户信息修改",id:id};
       next(JSON.stringify(obj));
   }
}