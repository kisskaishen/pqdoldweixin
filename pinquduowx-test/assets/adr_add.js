import $ from 'webpack-zepto';
import Vue from 'vue';




//set viewport&font-size
import set_viewport from '../assets/fontSize.js';
set_viewport();

//set tap-event-dom-style
import set_active from '../assets/active.js';
set_active();

//引入loading 动画
import loading from '../components/loading_ani.vue';
var loading_dialog = new Vue({
	el:'#loading-template',
	render: h=>h(loading)
});

//引入订单/开团 浮动推送
//import hot_feed from '../assets/hot_feed.js';
//hot_feed();


import urlSearch from '../assets/urlSearch.js';
import cookie from '../assets/cookie.js';




//获取用户id
var user_id = cookie.get('user_id')||false;
console.log(user_id);

//是否是支付页面跳转过来的
var is_pay_route = urlSearch('pay_adr_route')||false;


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



//获取收货地址
new Vue({
	el: '#wrap',
	data: function(){
		return {
			data: [],
			//编辑地址路由
			adr_route: 'adr_edit.html'+(is_pay_route?location.search:'?pay_adr_route=false')+'&route=adr_add&type=2',
			//是否是支付页面跳转过来的
			is_pay_route: is_pay_route,
			//对话框提示
			dialog_hint: '是否删除该地址？',
			//删除信息提示
			del_adr_hint:''
		}
	},
	mounted: function(){
		this.get_Address();
        console.log(urlSearch('prom_id'));
    },
	methods: {
		//获取地址列表
		get_Address: function(){
			if(!user_id){
				return;
			};
			var self_ = this;
			$('#loading-dialog').show();
			$.ajax({
				type:'POST',
				url:'https://testapi.pinquduo.cn/api_3_0_1/goods/getUserAddressList/user_id/5838?user_id='+user_id+'&ajax_get=1',//获取数据
				dataType:'jsonp',
				jsonp: 'jsoncallback',
				async:true,
				success:function(data){
					console.log(data);
					$('#loading-dialog').hide();
					self_.data = data.result.address;
				},
				error: function(xhr,type){
				    console.log('Ajax error!');
				}
			});
		},
		//跳转到支付页面
		route_to_pay: function(address_id){
			var self_ = this;
			if(self_.is_pay_route){
                console.log(urlSearch('prom_id'));
                if(urlSearch('prom_id')!=0){
                    location.href = "topay.html?"
                        +"order_id="+urlSearch('order_id')
                        +"&prom_id="+urlSearch('prom_id')
                        +"&goods_id="+urlSearch('goods_id')
                        +"&user_id="+urlSearch('user_id')
                        +"&store_id="+urlSearch('store_id')
                        +"&num="+urlSearch('num')
                        +"&spec_key="+urlSearch('spec_key')
                        +"&is_prom="+urlSearch('is_prom')
                        +"&type="+urlSearch('type')
                        +"&address_id="+address_id;
				}else {
                    location.href = "topay.html?"
                        +"&goods_id="+urlSearch('goods_id')
                        +"&user_id="+urlSearch('user_id')
                        +"&store_id="+urlSearch('store_id')
                        +"&num="+urlSearch('num')
                        +"&spec_key="+urlSearch('spec_key')
                        +"&is_prom="+urlSearch('is_prom')
                        +"&type="+urlSearch('type')
                        +"&address_id="+address_id;
				}

			};
		},

		//删除地址
		del_address: function(address_id){
			var self_ = this;
			self_.adr_dialog(function(){
				$.ajax({
					type:'POST',
					url:'https://testapi.pinquduo.cn/api_3_0_1/goods/delAddress'+'?user_id='+user_id+'&address_id='+address_id+'&ajax_get=1',//获取数据
					dataType:'jsonp',
					jsonp: 'jsoncallback',
					async:true,
					success:function(data){
						console.log(data);
						self_.del_adr_hint = data.msg;
						$('#adr-hint-dialog').show();
						var timer = setTimeout(function(){
							$('#adr-hint-dialog').hide();
						},1000);
						self_.get_Address();
					},
					error: function(xhr,type){
					    console.log('Ajax error!');
					}
				});
			});	
		},

		//删除地址弹窗
		adr_dialog: function(callback){
			var self_ = this;
			var dialog = $('#adr-dialog');
			var cancel_btn = $('#adr-dialog .btn').eq(0);
			var enter_btn = $('#adr-dialog .btn').eq(1);
			var mask = $('#adr-dialog .mask');
			dialog.show();
			var close_dialog = function(){
				dialog.hide();
			};
			enter_btn.unbind("click").click(function(){
				dialog.hide();
				(callback)();
			});
			cancel_btn.unbind("click").click(close_dialog);
			mask.unbind("click").click(close_dialog);
		}
	}
})



















	    