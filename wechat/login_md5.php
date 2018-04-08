<?php
namespace wechat;
	error_reporting(E_ALL^E_NOTICE^E_WARNING);
	include_once './config/qrcodeconfig.php';
	include_once './class/WechatClass.class.php';
	$appid = "wxdbc22996638a2c73";  
	$secret = "d259ccee138067613a26971092c6e48d";
	$code = $_GET["code"];

	// "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdbc22996638a2c73&redirect_uri=http://wx.pinquduo.cn/wechat/login.php?page_name=home&response_type=code&scope=snsapi_userinfo&state=123&connect_redirect=1#wechat_redirect"
	
	
	function getJson($url){
	    $ch = curl_init();
	    curl_setopt($ch, CURLOPT_URL, $url);
	    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE); 
	    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE); 
	    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	    $output = curl_exec($ch);
	    curl_close($ch);
	    return json_decode($output, true);
	};
	//第一步:取全局access_token
	// $url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$appid&secret=$secret";
	// $token = getJson($url);
	$wechatObj = new WechatClass();
	$token = $wechatObj->getAccessToken($appid, $secret);
	 
	//第二步:取得openid
	$oauth2Url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=$appid&secret=$secret&code=$code&grant_type=authorization_code";
	$oauth2 = getJson($oauth2Url);
	  
	//第三步:根据全局access_token和openid查询用户信息  
	$access_token = $oauth2["access_token"];  
	$openid = $oauth2['openid'];  
	$get_user_info_url = "https://api.weixin.qq.com/sns/userinfo?access_token=$access_token&openid=$openid&lang=zh_CN";
	$userinfo = getJson($get_user_info_url);
	$userinfo_json = json_encode($userinfo);


	 
	//打印用户信息
	//print_r($userinfo_json);


	//输出js json微信用户信息
	echo "<script>
			var weixin_userinfo = ".$userinfo_json.";
		  </script>"
	 
	
?>

<script type="text/javascript" src="../assets/zepto.min.js"></script>
<script type="text/javascript" src="../assets/md5.min.js"></script>
<script type="text/javascript" src="../assets/md5Sign.js"></script>
<script type="text/javascript">

	console.log(weixin_userinfo);

	function url_search(name){
		var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);  
	    if (!results)  
	    {   
	        return 0;   
	    }  
	    return results[1] || 0; 
	};

	var cookie={
		//设置cookie
		set: function(cname, cvalue, exdays) {
		    var d = new Date();
		    d.setTime(d.getTime() + (exdays*24*60*60*1000));
		    var expires = "expires="+d.toUTCString();
		    document.cookie = cname + "=" + encodeURI(cvalue) + "; " + expires+";path=/";
		},
		//获取cookie
		get: function(cname) {
		    var name = cname + "=";
		    var ca = document.cookie.split(';');
		    for(var i=0; i<ca.length; i++) {
		        var c = ca[i];
		        while (c.charAt(0)==' ') c = c.substring(1);
		        if (c.indexOf(name) != -1) return decodeURI(c.substring(name.length, c.length));
		    }
		    return "";
		},
		//清除cookie 
		clear: function(name) {  
		    this.set(name, "", -1);  
		}  
	};

	cookie.set('user_name',weixin_userinfo.nickname,7);
	cookie.set('head_pic',weixin_userinfo.headimgurl,7);
	cookie.set('openid',weixin_userinfo.openid,7);
	cookie.set('openid',weixin_userinfo.unionid,7);

	//登录,获取登录信息
	var qs = md5Sign.sign({
		ajax_get: 1,
		nickname: weixin_userinfo.nickname,
		head_pic: weixin_userinfo.headimgurl,
		oauth: 'weixin',
		openid: weixin_userinfo.openid,
		unionid: weixin_userinfo.unionid
	});
	$.ajax({
		type:'POST',
		url:'https://pinquduo.cn/api_2_0_2/user/thirdLogin?'+ qs,
		dataType:'jsonp',
		jsonp: 'jsoncallback',
		async:true,
		success:function(data){
			console.log(data);
			cookie.set('user_id',data.result.user_id,7);
			//路由跳转
			var page_name = url_search('page_name');
			switch(page_name){
				case 'home':
			  		location.href = '../index.html?v=001';
			  	break;
				case 'goods_order':
			  		location.href = '../goods_order.html';
			  	break;
			  	case 'goods_detail':
			  		var goods_id = cookie.get('goods_id');
			  		location.href = '../goods_detail.html?goods_id='+goods_id;
			  	break;
			  	case 'prom_regiment':
			  		var order_id = cookie.get('order_id');
			  		location.href = '../prom_regiment.html?order_id='+order_id;
			  	break;
			};
		},
		error: function(xhr,type){
		    console.log('Ajax error!');
		}
	});

	



	
</script>

	
