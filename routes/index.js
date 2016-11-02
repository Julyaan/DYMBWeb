var express = require('express');
var router = express.Router();
var usr=require('dao/dbConnect');
var formidable = require('formidable'),
	  fs = require('fs'),
	AVATAR_UPLOAD_FOLDER = '/avatar/'
var async = require('async');
	/* GET home page. */
router.get('/upload', function(req, res) {
  res.render('upload', { title: "文件上传to_GUO's_PC" });
});

router.post('/upload', function(req, res) {
	res.locals.success = null;
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

router.post('/upload_exp', function(req, res,next) {
	client = usr.connect();
	var form = new formidable.IncomingForm();   //创建上传表单
	form.encoding = 'utf-8';		//设置编辑
	form.uploadDir = 'public/image/';	 //设置上传目录
	form.keepExtensions = true;	 //保留后缀
	form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
	
	async.waterfall([
		function(callback){
			form.parse(req, function(err, fields, files) {
	
				if (err) {
				  res.send(err);
				  console.log("err form line 72:"+err);
				  return;		
				}  
			
				var avatarName = files.avatar.name;
				fields.avatar = avatarName;
				var newPath = form.uploadDir + avatarName;
				
				fs.renameSync(files.avatar.path, newPath);  //重命名
				console.log("hello from parse's call");	
				callback(null, fields);
			});
		},
		function(fields, callback){
		 	for(var key in fields){
				if(key.indexOf("info") == 0){
					fields[key] = "<p>"+fields[key].replace("\r\n","</p><p>")+"</p>";
				}
			}
			console.log("hello form second");			
			callback(null, fields);
		},
		function(doctor, callback){
			console.log("3333bbb");
			console.log(doctor);
			
			usr.insertDoc(client, doctor ,function(err) {
				console.log("12333");
				console.log("err from router when adding doctors:"+err);
				callback(err);	
			});
		},
		function(err,callback){
			console.log("44444")
			client.release();
		}
	], function (err, result) {
	    console.log("err form waterfall3333333333");
	});
 	res.send("success");
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
	
	/* function selectLN(sort,i){
		usr.selectLatest(client,sort[j],function (result) {
		for(var o in result){
			var time = JSON.stringify(result[o].news_date);
			time = time.substring(1,11);
			result[o].news_date = time;
			}
		console.log("its done:"+sort[j]);
		j++;
		
		donext(result,i,function(i){
			//console.log("i:"+i);
			i++;
			if(i<5)
				selectLN(sort,i)
			else{
				//rs = JSON.stringify(rs);
				//console.log(result);
				
				}
			});
		});
	}
	
	function donext(res,i,callback)
	{	
		rs[i]= res;
		//console.log(i+":"+JSON.stringify(rs[i]));
		callback(i);
		
	} */
	//初始化获取首页新闻参数 
	var rs = [],rss=[];
	rss[0]=[];rss[1]=[];rss[2]=[];rss[3]=[];rss[4]=[];
	var i = 0;
	var j = 0;
	//async瀑布流依次获取新闻，慢病研究，示范基地，学术交流
	async.waterfall([
		function(callback){
		 // 获取1
		  usr.selectLatest(client,"sort1",function (result) {
			for(var o in result){
				var time = JSON.stringify(result[o].news_date);
				time = time.substring(1,11);
				result[o].news_date = time;
				}
			rs[0]=result;
			console.log("111111"+result);	
			callback(null,rs);
		  });
		},
		function(rs,callback){
		 // 获取2
		  usr.selectLatest(client,"sort2",function (result) {
			for(var o in result){
				var time = JSON.stringify(result[o].news_date);
				time = time.substring(1,11);
				result[o].news_date = time;
				}
			rs[1]=result;
			console.log("222222"+result);	
			callback(null,rs);
		  });
		},
		function(rs,callback){
		 // 获取3
		  usr.selectLatest(client,"sort3",function (result) {
			for(var o in result){
				var time = JSON.stringify(result[o].news_date);
				time = time.substring(1,11);
				result[o].news_date = time;
				}
			rs[2]=result;
			console.log("333333"+result);	
			callback(null,rs);
		  });
		},
		function(rs,callback){
		 // 获取4
		  usr.selectLatest(client,"sort4",function (result) {
			for(var o in result){
				var time = JSON.stringify(result[o].news_date);
				time = time.substring(1,11);
				result[o].news_date = time;
				}
			rs[3]=result;
			console.log("444444"+result);	
			callback(null,rs);
		  });
		},
		function(rs,callback){
		 // 获取5
		  usr.selectLatest(client,"sort5",function (result) {
			for(var o in result){
				var time = JSON.stringify(result[o].news_date);
				time = time.substring(1,11);
				result[o].news_date = time;
				}
			rs[4]=result;
			console.log("555555"+result);	
			callback(null,rs);
		  });
		},
		function(rs, callback){
		  // 获取慢病研究
		  usr.selectLatestRes(client,function (result) {
			for(var o in result){
				var time = JSON.stringify(result[o].news_date);
				time = time.substring(1,11);
				result[o].news_date = time;
			
				}
			console.log("2222221"+rs);	
			callback(null,rs,result);
		  });
		},
		function(rs,result, callback){
		  // 处理result
		  console.log("000000"+result[0].news_sort);
		  for(var o in result){
			 console.log("=================================")
			switch(result[o].news_sort)
			{
				case '心脑血管病研究中心':
					rss[0].push(result[o]);break;
				case '肿瘤研究中心':
					rss[1].push(result[o]);break;
				case '慢阻肺研究中心':
					rss[2].push(result[o]);break;
				case '医养结合中心':
					rss[3].push(result[o]);break;
				case '示范基地':
					rss[4].push(result[o]);break;
			}		
		   }
		   callback(null,rs,rss);
		}
	], function (err,rs,rss) {
	  
	   console.log("rss00000:"+rss[0]);
	   res.render('index', { 
					title: '首页', 
					test:res.locals.islogin,
					login_num:login_num,
					list:rs,
					listres:rss,
					status1: 'active',status2: '',status3: '',status4: '',
					status5: '',status6: '',status7: '',status8: '',status9: ''
					});
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
router.get('/%E5%BF%83%E8%84%91%E8%A1%80%E7%AE%A1%E7%97%85%E7%A0%94%E7%A9%B6%E4%B8%AD%E5%BF%83', function (req, res, next) {
	if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
	client = usr.connect();
	usr.selectLatestResS(client,"心脑血管病研究中心",function(result){
		for(var o in result){
				var time = JSON.stringify(result[o].news_date);
				time = time.substring(1,11);
				result[o].news_date = time;
				}
		res.render('research01', {
			title: '心脑血管病研究中心',
			status1: '',status2: '',status3: '',status4: 'active',status5: '',status6: '',status7: '',status8: '',status9: '',
			test:res.locals.islogin,
			list:result
		});
	});
});
router.get('/%E8%82%BF%E7%98%A4%E7%A0%94%E7%A9%B6%E4%B8%AD%E5%BF%83', function (req, res, next) {
	if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
	client = usr.connect();
	usr.selectLatestResS(client,"肿瘤研究中心",function(result){
		for(var o in result){
				var time = JSON.stringify(result[o].news_date);
				time = time.substring(1,11);
				result[o].news_date = time;
				}
		res.render('research01', {
			title: '肿瘤研究中心',
			status1: '',status2: '',status3: '',status4: 'active',status5: '',status6: '',status7: '',status8: '',status9: '',
			test:res.locals.islogin,
			list:result
		});
	});
});
router.get('/%E6%85%A2%E9%98%BB%E8%82%BA%E7%A0%94%E7%A9%B6%E4%B8%AD%E5%BF%83', function (req, res, next) {
	if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
	client = usr.connect();
	usr.selectLatestResS(client,"慢阻肺研究中心",function(result){
		for(var o in result){
				var time = JSON.stringify(result[o].news_date);
				time = time.substring(1,11);
				result[o].news_date = time;
				}
		res.render('research01', {
			title: '慢阻肺研究中心',
			status1: '',status2: '',status3: '',status4: 'active',status5: '',status6: '',status7: '',status8: '',status9: '',
			test:res.locals.islogin,
			list:result
		});
	});
});
router.get('/%E5%8C%BB%E5%85%BB%E7%BB%93%E5%90%88%E4%B8%AD%E5%BF%83', function (req, res, next) {
	if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
	client = usr.connect();
	usr.selectLatestResS(client,"医养结合中心",function(result){
		for(var o in result){
				var time = JSON.stringify(result[o].news_date);
				time = time.substring(1,11);
				result[o].news_date = time;
				}
		res.render('research01', {
			title: '医养结合研究中心',
			status1: '',status2: '',status3: '',status4: 'active',status5: '',status6: '',status7: '',status8: '',status9: '',
			test:res.locals.islogin,
			list:result
		});
	});
});
router.get('/bases', function (req, res, next) {
	if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
	client = usr.connect();
	usr.selectLatestResS(client,"示范基地",function(result){
		for(var o in result){
				var time = JSON.stringify(result[o].news_date);
				time = time.substring(1,11);
				result[o].news_date = time;
				}
		res.render('bases', {
			title: '研究基地',
			status1: '',status2: '',status3: '',status4: '',status5: 'active',status6: '',status7: '',status8: '',status9: '',
			test:res.locals.islogin,
			list:result
		});
	});
});
router.get('/bases_details', function (req, res, next) {
	if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
	//selectRes
	var id = req.query.id;
	client=usr.connect();
	usr.selectRes(client,id, function (result) {
		var time = JSON.stringify(result[0].news_date);
		console.log("the news is:"+time.substring(0,11));
		time = time.substring(1,11);
		result[0].news_date=time;
		//console.log("the doctor is:"+result[0].name);
		res.render('bases_details', {
			title: result[0].news_title,
			status1: '',status2: '',status3: '',status4: '',status5: 'active',status6: '',status7: '',status8: '',status9: '',
			test:res.locals.islogin,
			research:result[0],
		});
		
	});
});
//学术交流
router.get('/%E5%AD%A6%E6%9C%AF%E4%BA%A4%E6%B5%81', function (req, res, next) {
	if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
	client = usr.connect();
	usr.selectLatestResS(client,"学术交流",function(result){
		for(var o in result){
				var time = JSON.stringify(result[o].news_date);
				time = time.substring(1,11);
				result[o].news_date = time;
				}
		res.render('learning01', {
			title: '学术交流',
			status1: '',status2: '',status3: '',status4: '',status5: '',status6: '',status7: '',status8: 'active',status9: '',
			test:res.locals.islogin,
			list:result
		});
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
	usr.selectRes(client,id, function (result) {
		var time = JSON.stringify(result[0].news_date);
		console.log("the news is:"+time.substring(0,11));
		time = time.substring(1,11);
		result[0].news_date=time;
		//console.log("the doctor is:"+result[0].name);
		res.render('research_details', {
			title: result[0].news_title,
			status1: '',status2: '',status3: '',status4: 'active',status5: '',status6: '',status7: '',status8: '',status9: '',
			test:res.locals.islogin,
			research:result[0],
		});
		
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
	client = usr.connect();
	usr.selectLatestExp(client,function(result){
		console.log(JSON.stringify(result));
		res.render('doctor_more', {
			title: '专家资源',
			status1: '',status2: '',status3: '',status4: '',status5: '',status6: 'active',status7: '',status8: '',status9: '',
			test:res.locals.islogin,
			list:result,
		});
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
		status1: '',status2: '',status3: '',status4: '',status5: '',status6: '',status7: 'active',status8: '',status9: '',
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
router.get('/admin_view_r', function (req, res, next) {
	console.log("admin_view_r");
		res.render('admin/view_r', {
			
		});
});
router.get('/admin_view_e', function (req, res, next) {
	console.log("admin_view_e");
		res.render('admin/view_e', {
			
		});
});
//编辑新闻
router.get('/admin_edit_news', function (req, res, next) {
	console.log("admin_edit_news");
		res.render('admin/edit_news', {
			
		});
});
//编辑res
router.get('/admin_edit_res', function (req, res, next) {
	console.log("admin_edit_res");
		res.render('admin/edit_res', {
			
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
				case 'sort5':
					result[0].news_sort = '公告栏';break;
			}
			res.json(result);
		});
		
	});
//从服务器获取res详情
router.get('/getresinfo', function (req, res, next) {
	console.log("get the details of the res from DB");
		var id = req.query.id;
		client=usr.connect();
		result = null;
		usr.selectRes(client,id, function (result) {
			var time = JSON.stringify(result[0].news_date);
			console.log("the news is:"+time.substring(0,11));
			time = time.substring(1,11);
			result[0].news_date = time;
			res.json(result);
		});
		
	});
//修改服务器处新闻
router.get('/admin_update_news', function (req, res, next) {
	console.log("admin_edit_news");
		res.render('admin/update_news', {
			
		});
});
//修改服务器处res
router.get('/admin_update_res', function (req, res, next) {
	console.log("admin_update_res");
		res.render('admin/update_res', {
			
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
//删除服务器处res
router.post('/dangerwaytodothis_r',function(req,res,next){
	var id = req.body.id;
	console.log("id=:"+id);
	client =usr.connect();
	usr.deleteRes(client,id,function(err){
		console.log("err from router when deleting:"+err);
		res.json(err);
	});
});
//删除服务器处exp
router.post('/dangerwaytodothis_e',function(req,res,next){
	var id = req.body.id;
	console.log("id=:"+id);
	client =usr.connect();
	usr.deleteExp(client,id,function(err){
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
//修改res发布状态
router.post('/dangerwaytodothis2_r',function(req,res,next){
	var status = req.body.status;
	var id = req.body.id;
	console.log("status=:"+status);
	client =usr.connect();
	usr.SetResStatus(client,id,status,function(err){
		console.log("err from router when deleting:"+err);
		res.json(err);
	});
});
//修改exp发布状态
router.post('/dangerwaytodothis2_e',function(req,res,next){
	var status = req.body.status;
	var id = req.body.id;
	console.log("status=:"+status);
	client =usr.connect();
	usr.SetExpStatus(client,id,status,function(err){
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
router.post('/admin_update_res_send',function(req,res,next){//发送修改好的res
	console.log("admin_update_res_send:"+req.body);
	client = usr.connect();
	usr.UpdateRes(client,req.body, function(err) {
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
//向服务器添加res
router.post('/admin_send_res',function(req,res,next){
	console.log("admin_send_res:"+req.body);
	client = usr.connect();
	usr.insertRes(client,req.body, function(err) {
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
				case 'sort5':
					result[o].news_sort = '公告栏';break;
			}
			var time = JSON.stringify(result[o].news_date);	
			result[o].news_date = time.substring(1,11);
		}
		console.log(result);
		res.json(result);	
	});
});
//获取所有res列表
router.get('/getres', function (req, res, next) {
	client=usr.connect();
	result = null;
	usr.selectResList(client,function (result) {		
		for(var o in result){
			var time = JSON.stringify(result[o].news_date);	
			result[o].news_date = time.substring(1,11);
		}
		console.log(result);
		res.json(result);	
	});
});
router.get('/getexp', function (req, res, next) {
	client=usr.connect();
	result = null;
	usr.selectExpList(client,function (result) {		
		console.log(result);
		res.json(result);	
	});
});
module.exports = router;
