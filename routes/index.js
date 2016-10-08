var express = require('express');
var router = express.Router();
var usr=require('dao/dbConnect');
/* GET home page. */

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
  res.render('index', { 
	title: '首页', 
	test:res.locals.islogin,
	login_num:login_num,
	status1: 'active',status2: '',status3: '',status4: '',
	status5: '',status6: '',status7: '',status8: '',status9: ''
	});
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
    res.render('news', {
        title: '新闻动态',
		status1: '',status2: '',status3: 'active',status4: '',status5: '',status6: '',status7: '',status8: '',status9: '',
		test:res.locals.islogin,
        /* user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString() */
    });
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

//
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
	console.log("456");
		res.render('admin/add_news', {
			
		});
});

router.get('/admin_add_e', function (req, res, next) {
	console.log("456");
		res.render('admin/add_e', {
			
		});
});
	
module.exports = router;
