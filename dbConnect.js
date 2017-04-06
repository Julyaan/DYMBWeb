var mysql=require('mysql');

function connectServer(){

    var client=mysql.createConnection({
        host:'127.0.0.1',
        user:'root',
        password:'123456',
        database:'test'
    })

    return client;
}


function  selectFun(client,username,callback){
    //client为一个mysql连接对象
    client.query('select password from userinfo where username="'+username+'"',function(err,results,fields){
        if(err) throw err;

        callback(results);
    });
}

function insertFun(client , username , password,callback){
    client.query('insert into userinfo value(NULL,?,?)', [username, password], function(err,result){
        if( err ){
            console.log( "error:" + err.message);
            return err;
        }
          callback(err);
    });
}
//添加新闻
function insertNews(client , news ,callback){
    client.query('insert into news value(NULL,?,?,?,?,?,?)', [news.title, news.date, news.source, news.sort, news.content,"on"], function(err,results){
        if( err ){
            console.log( "error from DB:" + err.message);
           // return err;
        }
          callback(err);
    });
}
//添加res
function insertRes(client , news ,callback){
    client.query('insert into research value(NULL,?,?,?,?,?,?)', [news.title, news.date, news.source, news.sort, news.content,"on"], function(err,results){
        if( err ){
            console.log( "error from DB:" + err.message);
           // return err;
        }
          callback(err);
    });
}
//添加专家
function insertDoc(client , doctor ,callback){
    client.query('insert into doctorinfo(name,major,birthplace, birthdate, graduates,title,degree,job,workplace,worktime,info01,info02,info03,info04,info05,info06,info07,info08,info09,info10,avatar) value (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [doctor.name,doctor.major,doctor.birthplace, doctor.birthdate, doctor.graduates,doctor.title,doctor.degree,doctor.job,doctor.workplace,doctor.worktime,doctor.info01,doctor.info02,doctor.info03,doctor.info04,doctor.info05,doctor.info06,doctor.info07,doctor.info08,doctor.info09,doctor.info10,doctor.avatar], function(err,results){
       
		if( err ){
            console.log( "error from DB:" + err.message);
            callback(err);
        }
		else{
			 console.log("insert doctors!");
			 callback(results);
		}
    });
}
function selectNews(client,id,callback){
	//文章详情
	client.query('select * from news where id ="'+id+'"',function(err,results){
		if(err) throw err; 
		console.log( "results:" + results);
		callback(results);
	});
}

function selectNewsList(client,callback){
	//所有文章title,date,sort,source
	client.query('select id,news_title,news_date,news_source,news_sort,status from news',function(err,results){
		if(err) {throw err; console.log("err form DB:"+err);}
		console.log( "results:" + results);
		callback(results);
	});
}
function selectResList(client,callback){
	//所有res的title,date,sort,source
	client.query('select id,news_title,news_date,news_source,news_sort,status from research',function(err,results){
		if(err) {throw err; console.log("err form DB:"+err);}
		console.log( "results:" + results);
		callback(results);
	});
}
function selectExpList(client,callback){
	//所有exp的title,date,sort,source
	client.query('select id,name,major,title,workplace,status from doctorinfo',function(err,results){
		if(err) {throw err; console.log("err form DB:"+err);}
		console.log( "results:" + results);
		callback(results);
	});
}
function UpdateNews(client,essay,callback){
	//修改数据库里的文章
	client.query('update news set news_title= ?,news_date= ?,news_source=?,news_sort = ?,news_body =? where id ="'+ essay.id+'"',[essay.news_title, essay.news_date,essay.news_source,essay.news_sort,essay.news_body],
		function(err,results){
			if(err) {throw err; console.log("err form DB:"+err);}
			console.log( "results:" + results);
			callback(err);
		});
}
function UpdateRes(client,essay,callback){
	//修改数据库里的res
	client.query('update research  set news_title= ?,news_date= ?,news_source=?,news_sort = ?,news_body =? where id ="'+ essay.id+'"',[essay.news_title, essay.news_date,essay.news_source,essay.news_sort,essay.news_body],
		function(err,results){
			if(err) {throw err; console.log("err form DB:"+err);}
			console.log( "results:" + results);
			callback(err);
		});
}

function deleteNews(client,id,callback){
	//删除数据库里的文章
	client.query('delete from news where id = "'+id+'"',function(err,results){
		if(err) {throw err; console.log("err form DB:"+err);}
		console.log( "results:" + results);
		callback(err);
	});
}
function deleteRes(client,id,callback){
	//删除数据库里的res
	client.query('delete from research where id = "'+id+'"',function(err,results){
		if(err) {throw err; console.log("err form DB:"+err);}
		console.log( "results:" + results);
		callback(err);
	});
}
function deleteExp(client,id,callback){
	//删除数据库里的exp
	client.query('delete from doctorinfo where id = "'+id+'"',function(err,results){
		if(err) {throw err; console.log("err form DB:"+err);}
		console.log( "results:" + results);
		callback(err);
	});
}
function SetNewsStatus(client,id,status,callback){
	//设置新闻状态
	client.query('update news set status = "'+status+'" where id ="'+id+'"',function(err,results){
		if(err) throw err; 
		console.log( "results:" + results);
		callback(err);
	});
}
function SetResStatus(client,id,status,callback){
	//设置res状态
	client.query('update research set status = "'+status+'" where id ="'+id+'"',function(err,results){
		if(err) throw err; 
		console.log( "results:" + results);
		callback(err);
	});
}
function SetExpStatus(client,id,status,callback){
	//设置exp状态
	client.query('update doctorinfo set status = "'+status+'" where id ="'+id+'"',function(err,results){
		if(err) throw err; 
		console.log( "results:" + results);
		callback(err);
	});
}
function selectDocs(client,id,callback){
	//专家详情
	client.query('select * from doctorinfo where id ="'+id+'"',function(err,results){
		if(err) throw err; 
		console.log( "results:" + results);
		callback(results);
	});
}


//选取最近n项数据
function selectLatest(client,sort,callback){
	//专家详情
	client.query('select id,news_title,news_date from news where news_sort ="'+sort+'" and status = "on" order by id desc',function(err,results){
		if(err) throw err; 
		console.log( "results news:" + results);
		callback(results);
	});
}
//选取最近n项慢病研究
function selectLatestRes(client,callback){
	//res
	client.query('select id,news_title,news_date,news_sort from research where status = "on" order by id desc',function(err,results){
		if(err) throw err; 
		console.log( "results res:" + results);
		callback(results);
	});
}
function selectLatestResS(client,sort,callback){
	//res
	client.query('select id,news_title,news_date,news_sort from research where news_sort = "'+sort+'" and status = "on" order by id desc',function(err,results){
		if(err) throw err; 
		console.log( "results res:" + results);
		callback(results);
	});
}
//选取最近n项exp
function selectLatestExp(client,callback){
	//res
	client.query('select id,name,avatar from doctorinfo where status = "on" order by id desc',function(err,results){
		if(err) throw err; 
		console.log( "results res:" + results);
		callback(results);
	});
}

function selectRes(client,id,callback){
	//研究中心
	client.query('select * from research where id ="'+id+'"',function(err,results){
		if(err) throw err; 
		console.log( "results res:" + results);
		callback(results);
	});
}
//管理员登录
function  selectAdm(client,username,callback){
    //client为一个mysql连接对象
    client.query('select password from admin where username="'+username+'"',function(err,results,fields){
        if(err) throw err;

        callback(results);
    });
}
exports.connect = connectServer;
exports.selectFun  = selectFun;
exports.insertFun = insertFun;
exports.insertNews = insertNews;
exports.selectNews = selectNews;
exports.selectDocs = selectDocs;
exports.selectRes = selectRes;
exports.selectAdm = selectAdm;
exports.selectNewsList = selectNewsList;
exports.UpdateNews = UpdateNews;
exports.UpdateRes = UpdateRes;
exports.deleteNews = deleteNews;
exports.deleteRes = deleteRes;
exports.selectLatest = selectLatest;
exports.SetNewsStatus = SetNewsStatus;
exports.SetResStatus = SetResStatus;
exports.insertRes = insertRes;
exports.insertDoc = insertDoc;
exports.selectResList = selectResList;
exports.selectExpList = selectExpList;
exports.deleteExp = deleteExp;
exports.SetExpStatus = SetExpStatus;
exports.selectLatestRes = selectLatestRes;
exports.selectLatestResS = selectLatestResS;
exports.selectLatestExp = selectLatestExp