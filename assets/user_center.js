import oauth_login from '../assets/oauth_login.js';
oauth_login("page_name='user_center");


import $ from 'webpack-zepto';
import Vue from 'vue';

import cookie from './cookie.js';

import urlSearch from '../assets/urlSearch.js';
// import md5Sign from '../assets/md5Sign.js';
import md5 from 'js-md5'

//引入设置视图适配
import set_viewport from '../assets/fontSize.js';
set_viewport();



//引入tap事件反馈样式js
import set_active from '../assets/active.js';


//引入订单/开团 浮动推送
//import hot_feed from '../assets/hot_feed.js';
//hot_feed();




//引入loading 动画
// import loading from '../components/loading_ani.vue';
// var loading_dialog = new Vue({
// 	el:'#loading-template',
// 	render: h=>h(loading)
// });



//分享
var share_url = 'https://wx.pinquduo.cn/?_wv=1';
//微信分享
$.ajax({
    url: "./wechat/share_index.php",
    type: "get",
    data : {
        'url' : location.href.split('#')[0]
    },
    success: function(data) {
        var data = JSON.parse(data);
        //console.log('share_data='+data);
        wx.config({
		    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		    appId: data.appId, // 必填，公众号的唯一标识
		    timestamp: data.timestamp, // 必填，生成签名的时间戳
		    nonceStr: data.nonceStr, // 必填，生成签名的随机串
		    signature: data.signature,// 必填，签名
		    jsApiList: [
		    	'checkJsApi',
    			'onMenuShareTimeline',
    			'onMenuShareAppMessage',
				'onMenuShareQQ',
    			'onMenuShareWeibo',
    			'hideMenuItems'
		    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});
		var share_config = {
		    title: '拼趣多商城', // 分享标题
		    desc: '拼起来，购乐趣！一个以团购为主的社交娱乐购物商城', // 分享描述
		    shareUrl: share_url,
		    link: share_url, // 分享链接
		    imgUrl: 'https://z.pinquduo.cn/api_3_0_1/Template/pc/pinquduo/Static/images/pqdlogo.jpg', // 分享图标
		    type: '', // 分享类型,music、video或link，不填默认为link
		    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
		    success: function () {
		        //alert('分享成功！');
		    },
		    cancel: function () {
		        //alert('已取消分享！');
		    }
		};

		wx.ready(function(){
			//分享朋友圈
			wx.onMenuShareTimeline(share_config);
			//分享给朋友
			wx.onMenuShareAppMessage(share_config);
			//分享到qq
			wx.onMenuShareQQ(share_config);
			//分享到微博
			wx.onMenuShareWeibo(share_config);
			//隐藏右上角弹出部分菜单
			wx.hideMenuItems({
				//要隐藏的菜单项
			    menuList: [
			    	"menuItem:openWithQQBrowser",
			    	"menuItem:openWithSafari",
			    	"menuItem:favorite",
			    	"menuItem:share:email",
			    	"menuItem:share:brand"

			    ]
			});
		});
    }
});

//qq分享
setShareInfo({
    title: '拼趣多商城',
    summary: '拼起来，购乐趣！一个以团购为主的社交娱乐购物商城',
    pic: 'https://z.pinquduo.cn/api_3_0_1/Template/pc/pinquduo/Static/images/pqdlogo.jpg',
    url: share_url
});



new Vue({
	el: '#wrap',
	data: function(){
		return {
			user_data: {
				head_pic: cookie.get('head_pic')||'images/ts_p1.jpg',
				mobile: cookie.get('mobile')||'12345678901',
				user_name: cookie.get('user_name')||'请登录/注册'
			},
			app_banner: 'images/user_app_banner.jpg',
			//订单导航数字状态数据
			order_status: {},
			news:''
		}
	},
	mounted: function(){
        console.log(1);
		var self_ = this;
		self_.hasLogin = false;

		//获取订单导航状态
		self_.get_order_status();

		var oauth = 'mobile';
		//判断微信用户登录/QQ
		function isWeiXin(){
			var ua = window.navigator.userAgent.toLowerCase();
			if(ua.match(/MicroMessenger/i) == 'micromessenger'){
				oauth = 'weixin';
				return true;
			}else{
				return false;
			}
		};
		function isQQ(){
			var ua = navigator.userAgent.toLowerCase();
			if(ua.match(/QQ/i) == 'qq'){
				oauth = 'qq';
				return true;
			}else{
				return false;
			};
		}


        if(isWeiXin()||isQQ()){
			$('#exit-login-btn').show();
			if(!cookie.get('openid')){
				//获取登录信息
				$.ajax({
					type:'POST',
					url:'https://z.pinquduo.cn/api_3_0_1/user/thirdLogin?version=2.0.0&ajax_get=1'+'&nickname='+cookie.get('user_name')+'&head_pic='+cookie.get('head_pic')+'&oauth='+oauth+'&openid='+cookie.get('openid'),
					dataType:'jsonp',
					jsonp: 'jsoncallback',
					async:true,
					success:function(data){
						console.log(data);
						self_.hasLogin = true;
		    			self_.update_data({
							head_pic: cookie.get('head_pic'),
							mobile: '',
							user_name: cookie.get('user_name')
						});

						//获取订单导航状态
						self_.get_order_status();
					},
					error: function(xhr,type){
					    console.log('Ajax error!');
					}
				});
			};
		}else{
		    $('#exit-login-btn').show();
			if(cookie.get('user_name')){
				$('#login-group').hide();
				$('#user-center').show();
			};
			var goGetYzm = true;
			var getTimer = null;

			// console.log('user_id='+cookie.get('user_id'));




			$('#yzm-btn').click(function(){
				if(goGetYzm){
					goGetYzm = false;
					var time = 1;
					var btn = $(this);
					var mobile = $('#mobile-input').val();
					if(!(/^1[34578]\d{9}$/.test(mobile))){
				        alert("手机号码有误，请重填");
				        goGetYzm = true;
				        return false;
				    };
					self_.get_yzm(mobile);
					$(this).addClass('disabled');
					getTimer = setInterval(function(){
						time +=1;
						var timed = 60-time;
						btn.html(timed+"秒后重发");
						if(time == 60){
							clearInterval(getTimer);
							btn.removeClass('disabled');
							btn.html("重新验证");
							goGetYzm = true;
						};
					},1000);
				};

			});


			$('#login-hall').click(function(){
				if(!self_.hasLogin&&!cookie.get('user_name')){
					$('#login-group').show();
					$('#user-center').hide();
					return false;
				};
			});

			//支付|收藏 未登陆 状态
			if(urlSearch('islogin')=='false'){
				$('#login-group').show();
				$('#user-center').hide();
			};



			//是否已登录 导航是否跳转登录状态
			$('.login-hall-item').each(function(){
				$(this).click(function(){
					if(!cookie.get('user_name')||cookie.get('user_name')==undefined){
						$('#login-group').show();
						$('#user-center').hide();
						return false;
					};
				});
			});


			//退出登录
			$('#exit-login-btn').bind('click',function(){
				$('#login-group').show();
				$('#user-center').hide();
				self_.update_data({
					head_pic: 'images/ts_p1.jpg',
					mobile: '',
					user_name: '请登录/注册'
				});
				//清除cookie
				cookie.clear('user_name');
				cookie.clear('head_pic');
				cookie.clear('user_id');
			});
		}

		$('#loading-dialog').hide();
	},
	methods: {
        // 更新用户信息
		update_data: function(data){
			// console.log('更新用户信息成功！');
			this.user_data = data;
		},
        // 更新用户状态
		update_status: function(data){
			console.log('更新订单导航状态信息成功！');
			this.order_status = data;
		},
        // 注册
		go_login: function(url,mobile,yzm) {
			var self_ = this;
			$.ajax({
				type:'get',
				url:url+'&mobile='+mobile+'&code='+yzm,//获取数据
				dataType:'jsonp',
				jsonp: 'jsoncallback',
				async:true,
				success:function(data){
					console.log(data);
					self_.hasLogin = true;
					if(data.status!==1){
						alert('验证码有误，请重新输入!');
						return;
					};
					self_.update_data(data.result);
					$('#login-group').hide();
					$('#user-center').show();

					self_.update_data({
						head_pic: data.result.head_pic,
						mobile: '',
						user_name: data.result.name
					});

					//设置cookie
					cookie.set('user_name',data.result.name,15);
					cookie.set('head_pic',data.result.head_pic,15);
					cookie.set('user_id',data.result.user_id,15);

					//获取订单导航状态
					self_.get_order_status();

				},
				error: function(xhr,type){
				    console.log('Ajax error!');
				}
			});
		},
        // 获取验证码
		get_yzm: function(mobile){
			var self_ = this;
			var qs = md5('mobile='+mobile+'&sig=pinquduo_sing');
			$.ajax({
				type:'POST',
				url:'https://z.pinquduo.cn/api_3_0_1/user/getCode',//获取数据
				dataType:'json',
				data:{
					mobile:mobile,
					sig:qs
				},
				// jsonp: 'jsoncallback',
				async:true,
				success:function(data){
					//console.log(data);
					$('#login-btn').removeClass('disabled');
					$('#login-btn').bind('click',function(){
						var yzm = $('#yzm-input').val();
						if(!/^\d{4}$/.test(yzm)){
							alert('验证码有误，请重新输入');
							return;
						};
						//console.log(mobile+" "+yzm);
						self_.go_login('https://z.pinquduo.cn/api_3_0_1/user/confirm?ajax_get=1',mobile,yzm);
					});
				},
				error: function(xhr,type){
				    console.log('Ajax error!');
				}
			});
		},
        // 获取用户状态
		get_order_status: function(){
			var self_ = this;
			if(cookie.get('user_id')){
				console.log('user_id='+cookie.get('user_id'));
				$.ajax({
					type:'get',
					url:'https://z.pinquduo.cn/api_3_0_1/user/getRefresh?version=2.0.0&ajax_get=1&user_id='+cookie.get('user_id'),
					dataType:'jsonp',
					jsonp: 'jsoncallback',
					async:true,
					success:function(data){
						// console.log(data);
						// console.log(userCenter_group);
						self_.update_status(data.result.userdetails);
					},
					error: function(xhr,type){
					    console.log('Ajax error!');
					}
				});
			};
		}
	}
});
