function serializeToJson(form){
    //使用jquery提供的方法获取表单中用户输入的所有信息，该方法会返回一个数组，里面封装了表单项的值，数组里面的元素是一个对象
    //具有两个属性，一个属性是name,属性值是表单项的name属性，一个属性value,属性值是表单项的value属性,即用户输入的内容
    var f = $(form).serializeArray();
    var result = {};
    //将数组f内的对象组合成一个新的对象result
    f.forEach(function(item){
        result[item.name] = item.value;
    });

    return result;
}