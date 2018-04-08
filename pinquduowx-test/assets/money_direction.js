import $ from 'webpack-zepto';
import Vue from 'vue';

import cookie from '../assets/cookie.js';


//set viewport&font-size
import set_viewport from '../assets/fontSize.js';
set_viewport();

//set tap-event-dom-style
import set_active from '../assets/active.js';
set_active();


import urlSearch from '../assets/urlSearch.js';

//引入loading 动画
import loading from '../components/loading_ani.vue';
var loading_dialog = new Vue({
	el:'#loading-template',
	render: h=>h(loading)
});

//引入订单/开团 浮动推送
//import hot_feed from '../assets/hot_feed.js';
//hot_feed();



//获取order_id
var order_id = urlSearch('order_id');
var free =urlSearch('free');
console.log('order_id='+order_id);
var url;
if(free){
    url='getUserMoney';
    // self_.url='https://testapi.pinquduo.cn/api_3_0_1/user/getUserMoney'+'?version=2.0.0&order_id='+order_id+'&ajax_get=1';
    //     console.log(1);
}else {
    // self_.url='https://testapi.pinquduo.cn/api_3_0_1/user/getWhere_Is_The_Money'+'?version=2.0.0&order_id='+order_id+'&ajax_get=1';
    url='getWhere_Is_The_Money';
    //     console.log(2);
}

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
		    imgUrl: 'https://testapi.pinquduo.cn/api_3_0_1/Template/pc/pinquduo/Static/images/pqdlogo.jpg', // 分享图标
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
    pic: 'https://testapi.pinquduo.cn/api_3_0_1/Template/pc/pinquduo/Static/images/pqdlogo.jpg',
    url: share_url
});

new Vue({
	el: '#wrap',
	data: function(){
		return {
			money_detail: {},
			url:''
		}
	},
	mounted: function(){
		var self_ = this;
		self_.get_courier();

        console.log(self_.url);
    },
	methods: {
		//获取数据
		get_courier: function(){
			$('#loading-dialog').show();
			var self_ = this;
			self_.money_detail = {};
		    $.ajax({
				type:'POST',
				url:'https://testapi.pinquduo.cn/api_3_0_1/user/'+url+'?version=2.0.0&order_id='+order_id+'&ajax_get=1',//获取数据
				dataType:'jsonp',
				jsonp: 'jsoncallback',
				async:false,
				success:function(data){
					console.log(data);
					self_.money_detail = data.result;
					$('#loading-dialog').hide();
				},
				error: function(xhr,type){
				    console.log('Ajax error!');
				}
			});
		},
		//时间戳转换
		formatDate: function(now){     
			var year=now.getFullYear();     
		  	var month=parseInt(now.getMonth())+1<10?'0'+(parseInt(now.getMonth())+1):parseInt(now.getMonth())+1;     
		  	var date=now.getDate()<10?'0'+now.getDate():now.getDate();     
		  	var hour=now.getHours()<10?'0'+now.getHours():now.getHours();     
		  	var minute=now.getMinutes()<10?'0'+now.getMinutes():now.getMinutes();     
		  	var second=now.getSeconds()<10?'0'+now.getSeconds():now.getSeconds();
		  	return   year+"-"+month+"-"+date+"   "+hour+":"+minute+":"+second;     
		}
	}
});























	    