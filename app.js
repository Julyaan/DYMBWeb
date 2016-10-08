var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
//var flash = require('express-flash');
//var request = require('request');
var ejs = require('ejs');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
//ueditor
var ueditor = require("ueditor");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser("An"));
app.use(session({
    secret: 'an',
	saveUninitialized: true,
	resave:false,
    cookie: {maxAge: 14400000}
}));
//app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
//uedior注册
app.use("/ueditor/ueditor", ueditor(path.join(__dirname, 'public'), function(req, res, next) {
	
    // ueditor 客户发起上传图片请求
    if (req.query.action === 'uploadimage') {
        var foo = req.ueditor;
		console.log(foo.filename);
		var date = new Date();
        var imgname = req.ueditor.filename;
		console.log(imgname);
		console.log(req.ueditor.filename);
        var img_url = '/images/ueditor/';
        //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.ue_up(img_url);
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/images/ueditor/';
        // 客户端会列出 dir_url 目录下的所有图片
        res.ue_list(dir_url);
    }
    // 客户端发起其它请求
    else {
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/nodejs/config.json');
    }
}));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
	console.log('err:'+err);
    res.render('error', {
      message: err.message,
      error: err,
	  title: '错误', 
	  test:res.locals.islogin,
	  status1: 'active',status2: '',status3: '',status4: '',
	  status5: '',status6: '',status7: '',status8: '',status9: ''
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
	title: '错误', 
	test:res.locals.islogin,
	status1: 'active',status2: '',status3: '',status4: '',
	status5: '',status6: '',status7: '',status8: '',status9: ''
  });
});



module.exports = app;
