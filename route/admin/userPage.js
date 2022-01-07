//渲染用户管理页面

//引入用户集合函数
const {User} = require("../../model/user");

module.exports = async (request,response)=>{
    //设置当前访问的是用户管理页面标识
    request.app.locals.currentLink = "user";
    //接收客户端传递过来的当前页参数
    let page = request.query.page || 1;
    //定义每一页显示的数据条数
    let pagesize = 10;
    //用户数据的总数
    let count = await User.countDocuments({});
    //定义数据的总页数
    let total = Math.ceil(count/pagesize);
    //定义页码对应的开始查询的位置
    let start = (page-1)*pagesize;
    //将用户信息从数据库中查询出来
    let users = await User.find({}).limit(pagesize).skip(start);
    //渲染用户列表模板，并将用户信息填入模板中
    response.render("admin/user",{
        users:users,
        page:page,
        total:total,
    });
}