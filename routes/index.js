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
	title: '首页|大医慢病研究院', 
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
			title: '首页|大医慢病研究院', 
			test:res.locals.islogin,
			status1: 'active',status2: '',status3: '',status4: '',
			status5: '',status6: '',status7: '',status8: '',status9: ''
			});
    })
    .post(function(req, res) {
        client=usr.connect();
        result=null;
        usr.selectFun(client,req.body.username, function (result) {
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
	title: '首页|大医慢病研究院', 
	test:res.locals.islogin,
	status1: 'active',status2: '',status3: '',status4: '',
	status5: '',status6: '',status7: '',status8: '',status9: ''
	});
});

router.route('/reg')
    .get(function(req,res){
        res.render('reg', { 
			title: '首页|大医慢病研究院', 
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
    res.render('introduce', {
        title: '研究所简介',
		status1: '',status2: 'active',status3: '',status4: '',status5: '',status6: '',status7: '',status8: '',status9: ''
        /* user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString() */
    });
});
module.exports = router;
