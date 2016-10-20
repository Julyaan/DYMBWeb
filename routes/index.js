var express = require('express');
var router = express.Router();
var usr=require('dao/dbConnect');
var formidable = require('formidable'),
	  fs = require('fs'),
	AVATAR_UPLOAD_FOLDER = '/avatar/'
/* GET home page. */
router.get('/upload', function(req, res) {
  res.render('upload', { title: "文件上传to_GUO's_PC" });
});

router.post('/upload', function(req, res) {

  var form = new formidable.IncomingForm();   //创建上传表单
	  form.encoding = 'utf-8';		//设置编辑
	  form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER;	 //设置上传目录
	  form.keepExtensions = true;	 //保留后缀
	  form.maxFieldsSize = 2 * 1024 * 1024* 1024;   //文件大小

	form.parse(req, function(err, fields, files) {

		if (err) {
		  res.locals.error = err;
		  res.render('upload', { title: "上传失败" });
		  return;		
		}  
	   
		var extName = '';  //后缀名
		switch (files.fulAvatar.type) {
			case 'image/pjpeg':
				extName = 'jpg';
				break;
			case 'image/jpeg':
				extName = 'jpg';
				break;		 
			case 'image/png':
				extName = 'png';
				break;
			case 'image/x-png':
				extName = 'png';
				break;		 
		}

		if(extName.length == 0){
			  res.locals.error = '只支持png和jpg格式图片';
			  res.render('upload', { title: "上传失败" });
			  return;				   
		}

		var avatarName = Math.random() + '.' + extName;
		var newPath = form.uploadDir + avatarName;

		console.log(newPath);
		fs.renameSync(files.fulAvatar.path, newPath);  //重命名
	});

	res.locals.success = '上传成功';
	res.render('upload', { title: "文件上传成功" });	  
});


router.get('/', function(req, res) {
	var login_num = 0;
	if(req.query.login_num)
		var login_num = req.query.login_num;
	console.log("login_num is :"+login_num);
    if(req.cookies.islogin){                                                                           
        req.session.islogin=req.cookies.islogin;
    }
	if(req.session.islogin){
		res.locals.islogin=req.session.islogin;
	}
	client=usr.connect();
	
	function selectLN(sort,i){
		usr.selectLatest(client,sort[j],function (result) {
		for(var o in result){
			var time = JSON.stringify(result[o].news_date);
			time = time.substring(1,11);
			result[o].news_date = time;
			}
		console.log("its done:"+sort[j]);
		j++;
		
		donext(result,i,function(i){
			console.log("i:"+i);
			i++;
			if(i<4)
				selectLN(sort,i)
			else{
				//rs = JSON.stringify(rs);
				//console.log(result);
				res.render('index', { 
					title: '首页', 
					test:res.locals.islogin,
					login_num:login_num,
					list:rs,				
					status1: 'active',status2: '',status3: '',status4: '',
					status5: '',status6: '',status7: '',status8: '',status9: ''
					});
				}
			});
		});
	}
	
	function donext(res,i,callback)
	{	
		rs[i]= res;
		console.log(i+":"+JSON.stringify(rs[i]));
		callback(i);
		
	}
	
	var sort = ["sort1","sort2","sort3","sort4"];
	var rs = [];
	var i = 0;
	var j = 0;
	selectLN(sort,i);
	
});


router.route('/login')
    .get(function(req, res) {
        if(req.session.islogin){
            res.locals.islogin=req.session.islogin;
        }

        if(req.cookies.islogin){
            req.session.islogin=req.cookies.islogin;
        }
        res.render('index', { 
			login_num: 3,
			title: '首页', 
			test:res.locals.islogin,
			status1: 'active',status2: '',status3: '',status4: '',
			status5: '',status6: '',status7: '',status8: '',status9: ''
			});
    })
    .post(function(req, res) {
        client=usr.connect();
        result=null;
        usr.selectFun(client,req.body.username, function (result) {
			console.log("login:"+result);
            if(result[0]===undefined){
				 res.redirect('/login');
            }else{
                if(result[0].password===req.body.password){
                    req.session.islogin=req.body.username;
                    res.locals.islogin=req.session.islogin;
                    res.cookie('islogin',res.locals.islogin,{maxAge:60000});
                    res.redirect('/');
                }else
                {
                    res.redirect('/login');
                }
               }
        });
    });


router.get('/logout', function(req, res) {
    res.clearCookie('islogin');
    req.session.destroy();
    res.redirect('/');
});
router.get('/logoutAdm', function(req, res) {
    res.clearCookie('admin');
    req.session.destroy();
    res.redirect('/');
});

router.route('/reg')
    .get(function(req,res){
        res.render('reg', { 
			title: '首页', 
			test:res.locals.islogin,
			status1: 'active',status2: '',status3: '',status4: '',
			status5: '',status6: '',status7: '',status8: '',status9: ''
			});
    })
    .post(function(req,res) {
        client = usr.connect();

        usr.insertFun(client,req.body.username ,req.body.confirm, function (err) {
              if(err) throw err;
              res.redirect('/reg');
        });
    });

	
/* 页面跳转 */
router.get('/introduce', function (req, res, next) {
	if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
    res.render('introduce', {
        title: '研究所简介',
		status1: '',status2: 'active',status3: '',status4: '',status5: '',status6: '',status7: '',status8: '',status9: '',
        test:res.locals.islogin,
    });
});
router.get('/news', function (req, res, next) {
	if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
		client=usr.connect();
	
	function selectLN(sort,i){
		usr.selectLatest(client,sort[j],function (result) {
		for(var o in result){
			var time = JSON.stringify(result[o].news_date);
			time = time.substring(1,11);
			result[o].news_date = time;
			}
		console.log("its done:"+sort[j]);
		j++;
		
		donext(result,i,function(i){
			console.log("i:"+i);
			i++;
			if(i<4)
				selectLN(sort,i)
			else{
				req.session.list = rs;
				res.render('news', {
					title: '新闻动态',
					status1: '',status2: '',status3: 'active',status4: '',status5: '',status6: '',status7: '',status8: '',status9: '',
					test:res.locals.islogin,
					list: req.session.list
					});
				}
			});
		});
	}
	
	function donext(res,i,callback)
	{	
		rs[i]= res;
		console.log(i+":"+JSON.stringify(rs[i]));
		callback(i);
		
	}
	
	var sort = ["sort1","sort2","sort3","sort4"];
	var rs = [];
	var i = 0;
	var j = 0;
	selectLN(sort,i);
    
});
router.get('/news02', function (req, res, next) {
	if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
    res.render('news02', {
        title: '政策咨询',
		status1: '',status2: '',status3: 'active',status4: '',status5: '',status6: '',status7: '',status8: '',status9: '',
		test:res.locals.islogin,
		list: req.session.list
    });
});
router.get('/news03', function (req, res, next) {
	if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
    res.render('news03', {
        title: '学术论文',
		status1: '',status2: '',status3: 'active',status4: '',status5: '',status6: '',status7: '',status8: '',status9: '',
		test:res.locals.islogin,
		list: req.session.list
    });
});
router.get('/news04', function (req, res, next) {
	if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
    res.render('news04', {
        title: '慢病咨询',
		status1: '',status2: '',status3: 'active',status4: '',status5: '',status6: '',status7: '',status8: '',status9: '',
		test:res.locals.islogin,
		list: req.session.list
    });
});
router.get('/news_details', function (req, res, next) {
	if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
	//从路由从获取参数
	var id = req.query.id;
	console.log("id is:"+id);
	//向数据库获取id对应的news_body
	client=usr.connect();
	result = null;
	usr.selectNews(client,id, function (result) {
		var time = JSON.stringify(result[0].news_date);
		console.log("the news is:"+time.substring(0,11));
		time = time.substring(1,11);
		res.render('news_details', {
			title: '新闻动态',
			status1: '',status2: '',status3: 'active',status4: '',status5: '',status6: '',status7: '',status8: '',status9: '',
			test:res.locals.islogin,
			news_title:result[0].news_title,
			news_date:time,
			news_body:result[0].news_body,
		});
		
	});
	
	
  
});
//慢病研究
router.get('/research', function (req, res, next) {
	if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
    res.render('research', {
        title: '慢病研究',
		status1: '',status2: '',status3: '',status4: 'active',status5: '',status6: '',status7: '',status8: '',status9: '',
        test:res.locals.islogin,
    });
});
router.get('/research01', function (req, res, next) {
	if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
    res.render('research01', {
        title: '心脑血管病研究中心',
		status1: '',status2: '',status3: '',status4: 'active',status5: '',status6: '',status7: '',status8: '',status9: '',
        test:res.locals.islogin,
    });
});
router.get('/research02', function (req, res, next) {
	if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
    res.render('research02', {
        title: '肿瘤研究中心',
		status1: '',status2: '',status3: '',status4: 'active',status5: '',status6: '',status7: '',status8: '',status9: '',
        test:res.locals.islogin,
    });
});
router.get('/research03', function (req, res, next) {
	if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
    res.render('research03', {
        title: '慢阻病研究中心',
		status1: '',status2: '',status3: '',status4: 'active',status5: '',status6: '',status7: '',status8: '',status9: '',
        test:res.locals.islogin,
    });
});
router.get('/research04', function (req, res, next) {
	if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
    res.render('research04', {
        title: '医养结合研究中心',
		status1: '',status2: '',status3: '',status4: 'active',status5: '',status6: '',status7: '',status8: '',status9: '',
        test:res.locals.islogin,
    });
});

router.get('/research_details', function (req, res, next) {
	if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
	//selectRes
	var id = req.query.id;
	client=usr.connect();
	result = null;
	usr.selectRes(client,id, function (result) {
		//console.log("the doctor is:"+result[0].name);
		res.render('research_details', {
			title: result[0].title,
			status1: '',status2: '',status3: '',status4: 'active',status5: '',status6: '',status7: '',status8: '',status9: '',
			test:res.locals.islogin,
			research:result[0],
		});
		
	});
});
//研究基地
router.get('/bases', function (req, res, next) {
	if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
    res.render('bases', {
        title: '心脑血管病研究中心',
		status1: '',status2: '',status3: '',status4: '',status5: 'active',status6: '',status7: '',status8: '',status9: '',
        test:res.locals.islogin,
    });
});
//专家资源
router.get('/doctor_more', function (req, res, next) {
	if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
    res.render('doctor_more', {
        title: '专家资源',
		status1: '',status2: '',status3: '',status4: '',status5: '',status6: 'active',status7: '',status8: '',status9: '',
        test:res.locals.islogin,
    });
});
router.get('/doctor_info', function (req, res, next) {
	if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
	//selectDocs
	var id = req.query.id;
	client=usr.connect();
	result = null;
	usr.selectDocs(client,id, function (result) {
		console.log("the doctor is:"+result[0].name);
		res.render('doctor_info', {
			title: '专家详情',
			status1: '',status2: '',status3: '',status4: '',status5: '',status6: 'active',status7: '',status8: '',status9: '',
			test:res.locals.islogin,
			doctor:result[0],
		});
		
	});
});

//学术交流
router.get('/learning', function (req, res, next) {
	if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
    res.render('learning', {
        title: '学术交流',
		status1: '',status2: '',status3: '',status4: '',status5: '',status6: '',status7: '',status8: 'active',status9: '',
        test:res.locals.islogin,
    });
});
//管理员登陆
router.route('/admin')
    .get(function(req, res) {
        if(req.session.admin){
            res.locals.admin=req.session.admin;
        }

        if(req.cookies.admin){
            req.session.admin=req.cookies.admin;
        }
		var hint = '';
		if(req.query.hint==1)
			hint = '用户名或密码错误，请重试';
		if(req.query.hint==2)
			hint = '暂无权限访问，请先登录！';
        res.render('admin', { 
			title: '管理员登录', 
			test:res.locals.islogin,
			hint:hint,
			status1: 'active',status2: '',status3: '',status4: '',
			status5: '',status6: '',status7: '',status8: '',status9: ''
			});
    })
    .post(function(req, res) {
        client=usr.connect();
        result=null;
        usr.selectAdm(client,req.body.username, function (result) {
			console.log("login:"+result);
            if(result[0]===undefined){
				console.log("failed: username is not exist");
				res.redirect('/admin?hint=1');
            }else{
                if(result[0].password===req.body.password){
                    req.session.admin=req.body.username;
                    res.locals.admin=req.session.admin;
                    res.cookie('admin',res.locals.admin,{maxAge:60000});
                    res.redirect('/admin-index');
                }else
                {
                    res.redirect('/admin?hint=1');
                }
               }
        });
    });
//管理员主页
router.get('/admin-index', function (req, res, next) {
	if(req.session.admin){
        res.locals.admin=req.session.admin;
    }
    if(req.cookies.admin){
        req.session.admin=req.cookies.admin;
    }
	console.log('hello');
	if(res.locals.admin){
		res.render('admin/admin-index', {
				title: '后台管理系统',
				username: res.locals.admin
			});
		}
	else{
		 res.redirect('/admin?hint=2');
	}
});
//管理页面路由 配合angularJS路由
router.get('/admin_home', function (req, res, next) {
	console.log("123");
	res.render('admin/home', {
			
		});
});

router.get('/admin_add_news', function (req, res, next) {
	console.log("admin_add_news");
		res.render('admin/add_news', {
			
		});
});
router.get('/admin_add_r', function (req, res, next) {
	console.log("admin_add_r");
		res.render('admin/add_r', {
			
		});
});

router.get('/admin_view_news', function (req, res, next) {
	console.log("admin_view_news");
		res.render('admin/view_news', {
			
		});
});
//编辑新闻
router.get('/admin_edit_news', function (req, res, next) {
	console.log("admin_edit_news");
		res.render('admin/edit_news', {
			
		});
});

//从服务器获取新闻详情
router.get('/getnewsinfo', function (req, res, next) {
	console.log("get the details of the news from DB");
		var id = req.query.id;
		client=usr.connect();
		result = null;
		usr.selectNews(client,id, function (result) {
			var time = JSON.stringify(result[0].news_date);
			console.log("the news is:"+time.substring(0,11));
			time = time.substring(1,11);
			result[0].news_date = time;
			switch(result[0].news_sort)
			{
				case 'sort1':
					result[0].news_sort = '慢病头条';break;
				case 'sort2':
					result[0].news_sort = '政策咨询';break;
				case 'sort3':
					result[0].news_sort = '学术论文';break;
				case 'sort4':
					result[0].news_sort = '慢病咨询';break;
			}
			res.json(result);
		});
		
	});
//修改服务器处新闻
router.get('/admin_update_news', function (req, res, next) {
	console.log("admin_edit_news");
		res.render('admin/update_news', {
			
		});
});
//删除服务器处新闻
router.post('/dangerwaytodothis',function(req,res,next){
	var id = req.body.id;
	console.log("id=:"+id);
	client =usr.connect();
	usr.deleteNews(client,id,function(err){
		console.log("err from router when deleting:"+err);
		res.json(err);
	});
});
//修改新闻发布状态
router.post('/dangerwaytodothis2',function(req,res,next){
	var status = req.body.status;
	var id = req.body.id;
	console.log("status=:"+status);
	client =usr.connect();
	usr.SetNewsStatus(client,id,status,function(err){
		console.log("err from router when deleting:"+err);
		res.json(err);
	});
});
router.post('/admin_update_news_send',function(req,res,next){//发送修改好的新闻
	console.log("admin_update_news_send:"+req.body);
	client = usr.connect();
	usr.UpdateNews(client,req.body, function(err) {
		console.log("err from router:"+err);
		res.json(err)		   	
	});
});
router.get('/admin_add_e', function (req, res, next) {
	console.log("456");
		res.render('admin/add_e', {
			
		});
});
//向服务器添加新闻
router.post('/admin_send_news',function(req,res,next){
	console.log("admin_send_news:"+req.body);
	client = usr.connect();
	usr.insertNews(client,req.body, function(err) {
		console.log("err from router:"+err);
		res.json(err)		   	
	});
});
//获取所有新闻列表
router.get('/getnews', function (req, res, next) {
	client=usr.connect();
	result = null;
	usr.selectNewsList(client,function (result) {		
		for(var o in result){
			switch(result[o].news_sort)
			{
				case 'sort1':
					result[o].news_sort = '慢病头条';break;
				case 'sort2':
					result[o].news_sort = '政策咨询';break;
				case 'sort3':
					result[o].news_sort = '学术论文';break;
				case 'sort4':
					result[o].news_sort = '慢病咨询';break;
			}
			var time = JSON.stringify(result[o].news_date);	
			result[o].news_date = time.substring(1,11);
		}
		console.log(result);
		res.json(result);	
	});
});
	
module.exports = router;
