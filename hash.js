//演示bcrypt模块的使用
async function run(){
    const bcrypt = require("bcrypt");
    //genSalt(10);方法接收一个数值作为参数，数值越大，生成的随机字符串复杂度越高，数值越小，生成的随机字符串复杂度越低，默认值为10
    //该方法返回一个随机字符串
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash("122345",salt);
    console.log( password);
}

run();
