<?php

/*
 *调用接口代码
 *
 **/
require_once("../API/qqConnectAPI.php");
$qc = new QC();  
$acs = $qc->qq_callback();//callback主要是验证 code和state,返回token信息，并写入到文件中存储，方便get_openid从文件中读  
$oid = $qc->get_openid();//根据callback获取到的token信息得到openid,所以callback必须在openid前调用
$uid = $qc->get_unionid();
$qc = new QC($acs,$oid);
$arr = $qc->get_user_info(); //no info

$arr['openid'] = $oid;
$arr['unionid'] = $uid;

$userinfo_json = json_encode($arr);

echo "<script>
		var qq_userinfo = ".$userinfo_json.";
	  </script>"

// echo '<meta charset="UTF-8">';
// echo "<p>";
// echo "Gender:".$arr["gender"];
// echo "</p>";
// echo "<p>";
// echo "NickName:".$arr["nickname"];
// echo "</p>";
// echo "<p>";
// echo "<img src=\"".$arr['figureurl']."\">";
// echo "<p>";
// echo "<p>";
// echo "<img src=\"".$arr['figureurl_1']."\">";
// echo "<p>";
// echo "<p>";
// echo "<img src=\"".$arr['figureurl_2']."\">";
// echo "<p>";
// echo "vip:".$arr["vip"];
// echo "</p>";
// echo "level:".$arr["level"];
// echo "</p>";
// echo "is_yellow_year_vip:".$arr["is_yellow_year_vip"];
// echo "</p>";

?>


<script type="text/javascript" src="../../assets/zepto.min.js"></script>
<script type="text/javascript" src="../../assets/md5.min.js"></script>
<script type="text/javascript" src="../../assets/md5Sign.js"></script>
<script type="text/javascript">

	console.log(qq_userinfo);


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

	cookie.set('user_name',qq_userinfo.nickname,7);
	cookie.set('head_pic',qq_userinfo.figureurl_qq_2,7);
	cookie.set('openid',qq_userinfo.openid,7);
	cookie.set('unionid',qq_userinfo.unionid,7);

	//登录,获取登录信息
	var qs = md5Sign.sign({
		ajax_get: 1,
		nickname: qq_userinfo.nickname,
		head_pic: qq_userinfo.figureurl_qq_2,
		oauth: 'qq',
		openid: qq_userinfo.openid,
		unionid: qq_userinfo.unionid
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
			var page_name = url_search('page_name')||cookie.get('page_name');
			var redirectAddress = cookie.get('redirectAddress');

			if(redirectAddress != ""){
				location.href = unescape(redirectAddress);
			}else{

				switch(page_name){
					case 'home':
						location.href = '../../index.html';
					break;
					case 'goods_order':
						location.href = '../../goods_order.html';
					break;
					case 'refund_difference':
						location.href = '../../refund_difference1.html';
						break;
					case 'goods_detail':
						 location.href=unescape(cookie.get('href'))
						//var goods_id = cookie.get('goods_id');
						//location.href = '../../goods_detail.html?goods_id='+goods_id;
					break;
					case 'prom_regiment':
						 location.href=unescape(cookie.get('href'))
						//var order_id = cookie.get('order_id');
						//location.href = '../../prom_regiment.html?order_id='+order_id;
					break;
				};

			}

			
		},
		error: function(xhr,type){
		    console.log('Ajax error!');
		}
	});

</script>
