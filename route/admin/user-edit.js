//引入用户信息数据库
const {user, User} = require("../../model/user");
module.exports = async (request,response)=>{

    //设置当前访问的是用户管理页面标识
    request.app.locals.currentLink = "user";
    //获取到地址栏中的id参数和添加用户时产生的的错误信息
    const {message,id} = request.query;

    if(id){
        //如果当前传递了id，则是修改用户信息，否则是添加用户
        //查询到当前id值对应的用户
            let user = await User.findOne({_id:id});
            response.render("admin/user-edit",{
                //将修改用户遇到的错误信息开放到模板中
                message:message,
                user:user,
                //如果是修改用户信息操作，则将服务提交到link
                link:"/admin/user-modify?id="+id,
                button:"修改",
            });
            
    }else{
        //添加用户
        response.render("admin/user-edit",{
            //将添加用户遇到的错误信息开放到模板中
            message:message,
            //如果是添加用户信息操作，则将服务提交到link
            link:"/admin/user-edit",
            button:"添加",
        });
    }

    
}