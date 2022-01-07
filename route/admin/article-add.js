//引入formidable模块
const { publicDecrypt } = require("crypto");
const res = require("express/lib/response");
const formidable = require("formidable");
const path = require("path");
const {Article} = require("../../model/article");
module.exports = function(request,response){
    //1、创建表单解析对象
   const form =  new formidable.IncomingForm();
   //2、配置文件上传到服务器的路径
   form.uploadDir = path.join(__dirname,"../","../","public","uploads");
   //保留上传文件的后缀
   form.keepExtensions = true;
   //解析表单
   form.parse(request, async (err,fields,files)=>{
      // console.log(files.cover.filepath.split("public")[1]);
        //response.send(files);
        //向文章集合中插入数据
       await  Article.create({
            title:fields.title,
            author:fields.author,
            publishDate:fields.publishDate,
            cover:files.cover.filepath.split("public")[1],
            content:fields.content,
        });

        //添加文章结束，将页面重定向为文章的列表页面
        response.redirect("/admin/article");
   });
    
}