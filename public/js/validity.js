	
function checkPhone() {
	var str=document.getElementById("phone").value;
	//alert(str);
	var re = /^1\d{10}$/;
	if(re.test(str)){
		document.getElementById("hint1").innerHTML="<font color='green'>该手机号码可以使用</font>";
		document.getElementById("submit_register").disabled = false;
		$("#phoneb").removeClass('am-form-error').addClass('am-form-success');					 
		$("#check_phone").removeClass('am-icon-warning').addClass('am-icon-check');
	}else{
		document.getElementById("hint1").innerHTML="<font color='red'>请输入有效的手机号码！</font>";
		document.getElementById("submit_register").disabled = true;				 
		$("#phoneb").removeClass('am-form-success').addClass('am-form-error');					 
		$("#check_phone").removeClass('am-icon-check').addClass('am-icon-warning');
	}          			
}

function checkEmail() {
	var str=document.getElementById("email").value;
	//alert(str);
	var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
	if(re.test(str)){
		document.getElementById("hint2").innerHTML="<font color='green'>该邮箱可以使用</font>";
		//document.getElementById("submit_register").disabled = false;
		$("#emailb").removeClass('am-form-error').addClass('am-form-success');					 
		$("#check_email").removeClass('am-icon-warning').addClass('am-icon-check');
	}else{
		document.getElementById("hint2").innerHTML="<font color='red'>请输入有效的邮箱地址</font>";
		//document.getElementById("submit_register").disabled = true;				 
		$("#emailb").removeClass('am-form-success').addClass('am-form-error');					 
		$("#check_email").removeClass('am-icon-check').addClass('am-icon-warning');
		
	}          			
}

function checkUsername() {
	var str=document.getElementById("username1").value;			
	var re = /^[a-zA-z]\w{3,15}$/;
	if(re.test(str)){
		document.getElementById("hint3").innerHTML="<font color='green'>用户名可以使用</font>";
		//document.getElementById("submit_register").disabled = false;
		$("#usernameb").removeClass('am-form-error').addClass('am-form-success');					 
		$("#check_username").removeClass('am-icon-warning').addClass('am-icon-check');
	}else{
		document.getElementById("hint3").innerHTML="<font color='red'>请输入正确的用户名</font>";
		//document.getElementById("submit_register").disabled = true;				 
		$("#usernameb").removeClass('am-form-success').addClass('am-form-error');					 
		$("#check_username").removeClass('am-icon-check').addClass('am-icon-warning');
	}          			
}

function checkLength() {
	var password=document.getElementById("password1").value;
		if(password.length<6) {
			 document.getElementById("hint_key1").innerHTML="<font color='red'>密码长度必须大于6位！</font>";
			 document.getElementById("submit_register").disabled = true;
			 
			 $("#pw1b").removeClass('am-form-success').addClass('am-form-error');					 
			 $("#check1").removeClass('am-icon-check').addClass('am-icon-warning');
			 }
		else {
			 document.getElementById("hint_key1").innerHTML="<font color='green'>密码有效</font>";
			 document.getElementById("submit_register").disabled = false;
			 $("#pw1b").removeClass('am-form-error').addClass('am-form-success');
			 //$("#pw1b").css("margin-bottom","0rem");
			 //$("#password1").addClass('am-form-field');
			 $("#check1").removeClass('am-icon-warning').addClass('am-icon-check');
			 }
	}
 function validate_key() {
	  var pw1 = document.getElementById("password1").value;
	  var pw2 = document.getElementById("repassword").value;
	  //alert(pw1);
	  //alert(pw2);
	  if(pw1 == pw2) {
		  document.getElementById("hint_key2").innerHTML="<font color='green'>两次密码相同</font>";
		  if(pw2.length>5){
				document.getElementById("submit_register").disabled = false;
				$("#pw2b").removeClass('am-form-error').addClass('am-form-success');					 
				$("#check2").removeClass('am-icon-warning').addClass('am-icon-check');
				}
		  else{
				document.getElementById("submit_register").disabled = true;
				$("#pw2b").removeClass('am-form-success').addClass('am-form-error');					 
				$("#check2").removeClass('am-icon-check').addClass('am-icon-warning');
	  }
	  }
	  else {
		document.getElementById("hint_key2").innerHTML="<font color='red'>两次密码不相同!</font>";
		document.getElementById("submit_register").disabled = true;
		$("#pw2b").removeClass('am-form-success').addClass('am-form-error');					 
		$("#check2").removeClass('am-icon-check').addClass('am-icon-warning');
	  }			  
	}				
