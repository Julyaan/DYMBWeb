var express = require('express');
var router = express.Router();
var usr=require('dao/dbConnect');
/* GET home page. */

router.get('/', function(req, res) {
    if(req.cookies.islogin){                                                                           
        req.session.islogin=req.cookies.islogin;
    }
	if(req.session.islogin){
		res.locals.islogin=req.session.islogin;
	}
  res.render('index', { 
	title: '首页', 
	test:res.locals.islogin,
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
        res.render('login', { 
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
                    res.redirect('/home');
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

router.get('/home', function(req, res) {
    if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
   res.render('index', { 
	title: '首页', 
	test:res.locals.islogin,
	status1: 'active',status2: '',status3: '',status4: '',
	status5: '',status6: '',status7: '',status8: '',status9: ''
	});
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
		status1: '',status2: '',status3: '',status4: '',status5: 'active',status6: '',status7: '',status8: '',status9: '',
        test:res.locals.islogin,
    });
});
module.exports = router;
