多人博客系统实战项目，主要涉及到了服务端的渲染
===

1、搭建项目所需文件夹，编写相应的资源
	1、public 静态资源
	2、model  数据库操作
	3、route  路由文件
	4、views  模板文件

2、使用npm下载相关的库
3、搭建服务器主文件app.js，在app.js下面搭建服务，配置模板文件、分发子路由、开放静态资源
4、在子路由下渲染模板文件
5、解决模板文件的外链资源路径问题
	(1)、模板文件的外链资源包括：css文件、js文件以及图片文件。由于模板文件是将静态资源直接粘贴复制然后改后缀名得到的，所以
		 模板文件的外链资源文件一般使用的是相对路径。
	(2)、模板文件中所使用的相对路径是相对于浏览器中的请求路径的，浏览器一般认为请求路径的最后一项不属于请求路径，
		 而属于请求路径下的文件，所以当浏览器的请求路径与外链资源在服务器中的储存路径无法匹配时，浏览器是没有办法
		 加载到外链资源的，就会导致网页乱码，为了解决该问题，需要将模板文件外链资源的相对路径改为绝对路径
	(3)、将模板文件的外链资源改成绝对路径只需要在其路径前加上一个到模板文件下的路径即可，因为在服务器app.js中已经中已经配置
		 好了views的据对路径
6、进行模板优化，即将模板中公共的部分提取出来
	(1)将各个模板中相同的主体部分分离出来成为单独的公共模板文件，利用模板文件的引入命令将分离出来的公共模板文件引入各个模板文件对应的位置
		---模板的引入命令：  {{include 公共模板文件路径}} ，比如{{include "./common/header.art"}}
	(2)将各个模板的框架部分分离出来成为一个单独的公共框架模板文件，并在该公共的框架模板文件中留好坑位，以便每个模板文件加入自己特有的主体部分和
	   和css、js文件
	   ---模板文件的占位命令：{{block 预留的坑名}}{{/block}}
	(3)各个模板文件继承公共框架模板文件，并填充自己独有的部分内容
		---模块的继承命令：{{extend 框架路径}},比如：{{extend "./common/layout.art"}}
		--模块填坑命令：{{blcok 对应的预留坑名}}本模块独有的内容{{/block}},比如{{block main}}本模块独有的内容{{main}}


7、登录功能的实现
	(1)创建用户集合，初始化用户
		(a)链接数据库
		(b)创建用户集合
		(c)初始化用户
	(2)为登录表单项设置请求地址，请求方式以及表单项name属性
		---表单项的提交一般设置POST请求，这样会将表单项的内容放置在POST请求体中比较安全，而
		   如果使用GET请求，会将表单项的内容放在浏览器的地址栏中进行传递，不安全
	(3)当点击登录按钮时，客户端验证用户是否填写了登录表单项
	(4)如果登录表单项其中一项没有提交，阻止表单提交
		--在登录页面写js代码，为表单绑定onsubmit事件，当表单提交时进行验证
	(5)服务器接收请求参数。验证用户是否填写了登录表单
		--下载第三方库body-parser，用于服务器端处理客户端提交的表单信息
	(6)如果其中一项没有输入，为客户端做出响应，阻止程序向下执行
		--浏览器端是可以通过设置禁止使用javascript代码的，这样客户端的验证就会失效，需要在服务器端再验证一次，所以
		  服务端的验证必不可少
	(7)根据邮箱地址查询用户信息
	(8)如果用户不存在，为客户端做出响应，阻止程序向下执行
	(9)如果用户存在，将用户名和密码进行比对
	(10)比对失败，用户登录失败

8、密码加密bcrypt
	(1)因为黑客容易入侵数据库，盗取用户信息，所以需要对数据库的用户密码加密，而不能直接在数据库中以明文的形式
	   存储密码，常见的加密方式为哈希加密，这是一种单程加密方式，即若密码为1234，经过哈希加密后变成了abcd，abcd是不可以
	   被解密为1234的，即哈希加密只能加密，不能解密
	(2)哈希加密可以通过引入node.js的第三方库来实现
	(3)暴力破解：虽然哈希加密是单程加密，但是若黑客将一些常用的明文密码经过加密以后得到的加密密码连同其对应的明文密码一起
	   放入了自身的数据库中，这样一旦拿到了用户数据库中的加密密码进行一一比对，就可以知道用户的密码是什么了，该种破解密码的
	   方式就称为暴力破解
	(4)所以为了增加暴力破解的难度，还需要在经过哈希加密得到的加密密码中加入随机字符串，这就增加了密码被破解的难度
	(5)哈希加密的实现
		(a)导入bcrypt模块
			const bcrypt = require("bcrypt");
		(b)生成随机字符串,genSalt(10)方法里面的数字越大，表示生成的随机数难度越大，默认值为10
			let salt = await bcrypt.genSalt(10);
		(c)使用随机字符串对密码进行加密
			let pass = await bcrypt.hash("明文密码",salt);
		(d)bcrypt模块的使用依赖其他环境
			--python 2.x
			--node-gyp
				--npm install -g node-gyp
			--windows-build-tools(该模块只有window10的操作系统才需要)
				--npm install --global--production windows-build-tools
	(6)比对密码是否一致，compare方法会返回一个布尔值，即密码一致则true,否则false
		await bcrypt.compare("明文密码","加密密码");
	(7)http协议的无状态性：即客户端和服务端在完成一次请求和响应以后就断开了，不会保持连接，服务器端只关心请求，不关心发送请求的客户端是谁。
9、cooking和session
	(1)将烤鸭店比作服务器端，购买烤鸭的客人看作客户端，则若烤鸭店想要知道客人购买的烤鸭数，就可以给客人发一张唯一的会员卡，
	   烤鸭店准备一个账本记录下卡号对应的购买烤鸭数量即可。以此类推，烤鸭店给客人发的会员卡就是cooking，用于证明客户的身份,
	   烤鸭店本身的账本就是session，用于存储用户身份信息的地方
	(2)cookie是电脑硬盘中开辟的一块存储空间，主要供服务器端存储数据，位置在客户端
		(a)每一个站都有自己的服务端，每一个服务端都可以向客户端的cookie中储存数据，所以cookie中的数据是以域名的形式进行区分的
		(b)cookie中的数据是有过期时间的，超过时间会被浏览器自动删除
		(c)cookie中的数据会随着请求被自动发送到服务器端
	(3)session实际上就是一个对象，存储在服务器端的内存中，在session对象中也可以存储多条数据，每一条数据都有一个sessionid作为唯一标识
	(4)cookie和session的实现
		(a)在node.js中实现session需要借助第三方模块express-session
			const session = require("express-session");//引入该模块会返回一个方法，调用该方法可以创建一个session对象
			app.use(session({secret:"secret key"}));

10、新增用户功能的实现
	(1)为用户列表页面的新增用户按钮添加链接
	(2)添加一个链接对应的路由，在路由模板中渲染新增用户模板
	(3)为新增用户表单指定请求地址，请求方式，为表单项添加name属性
	(4)增加实现添加用户的功能路由
	(5)接收客户端传递过来的请求参数
	(6)对请求参数的格式进行验证
	(7)验证当前要注册的邮箱地址是否已经注册过
	(8)对密码进行加密处理
	(9)将用户信息添加到数据库中
	(10)重定向页面到用户列表页面
11、第三方模块JOI
	(1)joi是javascipt对象的规则描述语言和验证器，用于验证javascript对象的格式，在joi内部定义好了许多的验证规则，并提供了语法允许将验证规则组合起来，
	   用于验证我们想要验证的对象是否符合规则
	(2)JOI的使用
		(a)引入模块
			const Joi = require("joi");
		(b)生成一个规则,该规则是一个对象，在对象内部定义的就是该规则，在规则对象中存在了若干属性，表示需要验证的对象中只能出现该规则对象中出现的属性，如果出现了规则以外的属性验证失败。可以少于规则对象中的属性
			const schema = Joi.object({
				username:Joi.string().alphanum.min(3).max(30).required().error(new Error("错误信息")),
				password:Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),

			});
		(c)使用规则，验证对象,第一个参数为待验证的对象，第二个为验证规则，如果验证通过，该方法会返回待验证的对象，如果验证失败，则会抛出异常
			schema.validateAsync({username:"u"});

13、数据分页功能，需要用到数据库查询的两个方法limit和skip
	(1)limit()//limit方法限制查询数量，传入每页显示的数据数量
	(2)skip()//skip跳过多少条数据，传入显示数据的开始位置
	(3)当数据库中的数据非常多时，数据需要分批次显示，这时需要用到数据分页功能，即在查询数据库中的数据时，指定查询
	   条件，使得页面展示我们想要的数据
	(2)分页功能的核心要素
		(a)、当前页,当用户点击上一页或者下一页或者页码产生时，客户端通过get参数方式将当前页的页码传递到服务器端
		(b)、总页数，根据总页数判断当前页是否是最后一页，根据判断结果做出响应操作
			--总页数 = Math.ceil(总数据条数/每页显示的数据条数)
		(c)、
	(3)数据开始查询位置=(当前页-1)*每页显示的数据条数
14、用户信息修改
	(1)将要修改的用于ID传递到服务器端
	(2)建立用户信息修改对应的路由
	(3)接收客户端表单传递过来的请求参数
	(4)根据ID查询用户信息，并将客户端传递过来的密码和数据库中的密码进行比对
	(5)如果比对失败，对客户端做出响应
	(6)如果密码比对成功，将用户信息更新到数据库中


15、用户信息删除
	(1)在确认删除框中添加隐藏域用来存储要删除用户的ID值
	(2)为删除按钮添加自定义属性用于储存要删除用户的ID值
	(3)为删除按钮添加点击事件，在点击事件处理函数中获取自定义属性中储存的ID值并将ID值存储在表单的隐藏域中
	(4)为删除表单添加提交地址以及提交方式
	(5)在服务端建立删除功能路由
	(6)接收客户端传递过来的id参数
	(7)根据id删除用户

16、添加文章
	(1)添加文章的表单项涉及到了文件上传，所以表单的数据需要采用二进制的形式上传
	(2)表单的属性enctype用于指定表单数据的编码类型，其值可选
		(a)默认值：application/x-www-form-urlencoded,采用该种方式编码的数据格式为：
				name=zhangsan&age=20&address=wuhan,即采用该种方式进行编码的表单数据，多个数据之间
			采用&进行连接
		(b)multipart/form-data  将表单数据编码成二进制类型
	(3)body-parser模块只能接收普通的POST请求，不能接收采用二进制传输数据的POST请求，所以为了接收
	   添加文章的表单数据，需要使用formidable模块
	
	(4)formidable模块
		(a)作用：解析表单，支持get请求参数，post请求参数、文件上传
		(b)使用：
			//引入formidable模块
			const formidable = require("formidable");
			//创建表单解析对象
			const form = new formidable.IncomingForm();
			//指定文件上传到服务器的路径
			form.uploadDir = "/my/dir";
			//是否保留表单上传文件的后缀名,false表示不保留，true表示保留，一般情况下选择true
			form.keepExtensions = true;
			//对表单进行解析
			form.parse(request,(err,fields,files)=>{
				//request表示请求参数
				//err储存错误信息，表单解析成功，则err的值为null,解析失败则保存错误信息
				//fields对象类型，保存普通表单数据
				//files对象类型，储存和上传的文件相关的数据
			});
		(5)、让文章封面出现照片
			(a)在客户端编写js代码实现照片加载成功后的样式
			(b)实现过程：使用文件读取
				var resder = new FileReader();
				reader.readAsDataURL("文件");
				reader.onload = function(){
					console.log(reader.result);
				}
		(6)表单的multiple属性表示允许用户一次性选择多个文件
		(7)日期格式的处理，采用第三方模块dateformat,该模板不能采用require方法导入，若要采用require方法导入，需要下载3.0.3版本才可以
(17)数据分页
	(1)采用mongoose-sex-page第三方模块更简单
	(2)mongoose-sex-page的使用
		const pagination = require("mongoose-sex-page");
		pagination(被查阅y数据的集合构造函数).page(1).size(20).display(8).exec();
			(a)page()   		指定当前页面
			(b)size()  			指定每页显示的数据条数
			(c)dispaly()   		指定客户端要显示的页码数量
			(d)exec()			向数据库中发送查询请求
(18)mongoDB数据库添加账号和密码
	(1)在企业中，数据库是有专门人员进行管理的，只有拥有账号和密码才能使用数据库
	(2)mongoDB数据库添加账号过程
		(a)以系统管理员的方式允许powershell
		(b)连接数据库：mongo
		(c)查看数据库：show dbs
		(d)只有先创建超级管理员账号才能创建普通管理员账号，超级管理员账号是管理所有的数据库的账号，
		   创建超级管理员账号需要先进入admin数据库：use admin，然后使用命令：db.createUser()创建超级管理员账号。
		(f)普通管理员账号是针对某一个数据库的，需要创建针对那个数据库的普通账号就先使用命令：use 数据库名，进入那个数据库，
		   然后使用命令：db.createUser()创建普通管理员账号。
		(g)卸载原有的mongodb服务
			--停止服务：net stop mongodb
			--mongod --remove
			--创建自己的mongodb服务
				mongod --logpath="" --install -auth
			--启动自己创建的mongodb服务 net start mongodb
	(3)在本项目中为blog数据库添加的账号名为：blog,密码为itcast;超级管理员为root，密码为root
	(4)在项目中使用账号来连接数据库
		mongoose.connect("mongodb://用户名：密码@localhost:port/数据库")
(19)开发环境和生产环境
	(1)环境就是指项目运行的地方，当项目处于开发阶段，项目运行在开发人员的电脑上，项目所处的环境就是开发环境
	   当项目开发完成以后，要将项目放到真实的网站服务器电脑中运行，项目所处的环境就是生产环境
	(2)为什么要区分开发环境和生产环境？
		--因为在不同的环境中，项目的配置是不一样的，需要在项目代码中判断当前项目运行的环境，根据不同的环境应用不同的项目配置
	(3)如何区分开发环境和生产环境
		--通过电脑操作系统中的系统环境变量区分当前是开发环境还是生产环境
		--实际实现
			(a)在开发者的电脑上设置两个环境变量并赋值，第一个环境变量名为NODE_ENV(可变，但一般不改变)，值为development,代表开发环境
			   第二个环境变量为NODE_ENV(可变，但一般不改变)，值为production,代表生产环境
			(b利用process.env用于获取系统环境变量，其返回值是对象.对象里面存入了电脑中的环境变量，通过判断环境变量NODE_ENV的值，可以区分是生产环境还是开发环境
					if(process.env.NODE_ENV === "development"){
						console.log("当前是开发环境");
					}else{
						console.log("当前是生产环境");
					})
(20)第三方模块config
	(1)config模块允许开发人员将不同运行环境下的应用配置信息抽离到单独的文件中，模块内部自动判断当前应用的运行环境，并读取对应的配置信息，
	   极大节省了应用配置信息的维护成本，避免了当运行环境重复多次切换时，手动到项目代码中修改配置信息
	(2)config模块的使用
		(a)使用npm install config命令下载模块
		(b)在项目的根目录下新建config文件夹
		(c)在config文件夹下新建default.json(存放默认的配置信息)、development.json(存放开发环境的配置信息)、production.json(存放生产环境的配置信息)文件
		(d)使用require方法导入config模块
		(e)使用模块内部提供的get方法获取配置信息
	(3)使用config模块将敏感的配置信息储存在环境变量中
		(a)在config文件夹中建立custom-environment-variables.json文件
		(b)配置项属性的值填写系统环境变量的名字
		(c)项目运行时config模块查找系统环境变量，并读取其值作为当前配置项属于的值
		

(21)文章评论
	(1)创建评论集合
	(2)判断用户是否登录，如果用户登录，再允许用户提交评论表单	
	(3)在服务器端创建立文章评论功能对应的路由  
	(4)在路由请求处理函数中接收客户端传递过来的评论信息
	(5)将评论信息储存在评论集合当中
	(6)将页面重定向回文章详情页面
	(7) 在文章详情页面路由中获取文章评论信息并展示在页面中 
