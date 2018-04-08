
import urlSearch from './urlSearch.js';
//第三方登录 qq/微信..
import cookie from './cookie.js';
// console.log('成功');
var oauth = {
	//判断微信用户登录
	isWeiXin: function(){
		var ua = navigator.userAgent.toLowerCase(); 
		if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
			return true; 
		}else{ 
			return false; 
		}; 
	},
	//判断QQ用户登录
	isQQ: function(){
		var ua = navigator.userAgent.toLowerCase();
		if(ua.match(/QQ/i) == 'qq'){ 
			return true; 
		}else{ 
			return false; 
		}; 
	}
};
module.exports = function(routeString){
	// 获取当前页面的地址栏信息
	var href = location.href;
	// cookie.set('href',href)
	console.log('href存储成功')
    console.log('第三方登陆调取成功');
    console.log(href);
    if (routeString==''||routeString==undefined||routeString==null) {
    	routeString = 'page_name=home'
    }
    console.log(routeString)

    if(oauth.isWeiXin()){
    	console.log('我要找登录')
		//去掉原来的cookie将所有用户都去重新第三方登录 2017-08-24 温立涛
		if(!cookie.get('user_id')){
			// location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdbc22996638a2c73&redirect_uri=https://wx.pinquduo.cn&response_type=code&scope=snsapi_userinfo&state=123&connect_redirect=1#wechat_redirect";
			location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdbc22996638a2c73&redirect_uri=http%3a%2f%2fwx.pinquduo.cn%2fwechat%2flogin.php%3f"+routeString+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
		}
	}else if(oauth.isQQ()){
		if(!cookie.get('user_id')){
			location.href = "qq/oauth/index.php";
			cookie.set('url',href);
		};
	}
};
