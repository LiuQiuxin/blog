const req = require("express/lib/request");
const { func } = require("joi");

//引入joi模块
const Joi = require("joi");
//定义对象的验证规则
const schema = Joi.object({
    username:Joi.string().min(2).max(5).required().error(new Error("username属性没有通过验证")),

});


//验证对象是否符合规则
async function run(){
    try{
        //如果验证成功，返回验证对象
        await schema.validateAsync({username:"ut"});
    }catch(ex){
        //如果验证失败，执行catch内的代码，抛出异常
        console.log(ex.message);
        return;
    }

    console.log("验证通过");
}

run();