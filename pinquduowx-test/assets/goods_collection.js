import $ from 'webpack-zepto';
import Vue from 'vue';

import cookie from '../assets/cookie.js';


//set viewport&font-size
import set_viewport from '../assets/fontSize.js';
set_viewport();

//set tap-event-dom-style
import set_active from '../assets/active.js';
set_active();

import pullup_load from '../assets/pullup_load.js';

//引入loading 动画
import loading from '../components/loading_ani.vue';
var loading_dialog = new Vue({
	el:'#loading-template',
	render: h=>h(loading)
});

//引入订单/开团 浮动推送
//import hot_feed from '../assets/hot_feed.js';
//hot_feed();


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


//获取user_id
var user_id = cookie.get('user_id')||null;

console.log('user_id='+user_id);

if(user_id==null){
	location.href='index.php#/main/userCenter?islogin=false';
};



var hint_timer = null;
new Vue({
	el: '#wrap',
	data: function(){
		return {
			//商品列表
			goods_data: [],
			//对话框提示
			dialog_hint: '是否删除该商品收藏？',
			//删除收藏提示
			collect_hint: '',
			//加载提示
			load_hint: '',
			//是否上拉加载
			isloadmore: true,
			//加载分页
			page: 1,
			//每页条目
			pagesize: 6
		}
	},
	mounted: function(){
		var self_ = this;	
		//
		self_.get_collect_goods();
	},
	methods: {
		//获取收藏数据
		get_collect_goods: function(){
			$('#loading-dialog').show();
			var self_ = this;
			self_.page = 1;
		    $.ajax({
				type:'POST',
				url:'https://testapi.pinquduo.cn/api_3_0_1/user/getUserCollection'+'?version=2.0.0&user_id='+user_id+'&page='+self_.page+'&pagesize='+self_.pagesize+'&ajax_get=1',//获取数据
				dataType:'jsonp',
				jsonp: 'jsoncallback',
				async:false,
				success:function(data){
					console.log(data);
					$('#loading-dialog').hide();
			        self_.goods_data = data.result.items;
			        if(data.result.items.length == 0){
			        	$('#more-hint').html('没有更多数据了');
			        }else if(data.result.items.length<self_.pagesize){
		        		$('#more-hint').html('没有更多数据了');
			        	self_.isloadmore = false;
			        }else{
			        	$('#more-hint').html('上拉加载更多');
			        	//执行上拉加载
			        	self_.up_load();
			        };

			        hint_timer=setTimeout(function(){
			        	$('#hint-dialog').hide();
			        },1000);

			        
				},
				error: function(xhr,type){
				    console.log('Ajax error!');
				}
			});


		},
		//删除收藏类目
		cancel_collect: function(goods_id){
			var self_ = this;
			self_.uncollect_dialog(function(){
				$.ajax({
					type:'POST',
					url:'https://testapi.pinquduo.cn/api_3_0_1/goods/collectGoods'+'?version=2.0.0&user_id='+user_id+'&type=1'+'&goods_id='+goods_id+'&ajax_get=1',//获取数据
					dataType:'jsonp',
					jsonp: 'jsoncallback',
					async:false,
					success:function(data){
						console.log(data);
						//self_.collect_hint = '已删除该商品收藏';
						//$('#hint-dialog').show();
						clearTimeout(hint_timer);
						hint_timer=setTimeout(function(){
				        	$('#hint-dialog').hide();
				        },1000);
						self_.page=1;
						self_.isloadmore=true;
						self_.goods_data=[];
						self_.get_collect_goods();
					},
					error: function(xhr,type){
					    console.log('Ajax error!');
					}
				});
			});
		},

		//取消收藏弹窗
		uncollect_dialog: function(callback){
			var self_ = this;
			var dialog = $('#collect-dialog');
			var cancel_btn = $('#collect-dialog .btn').eq(0);
			var enter_btn = $('#collect-dialog .btn').eq(1);
			var mask = $('#collect-dialog .mask');
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
		},

		//上拉加载
		up_load: function(){
			var self_ = this;
			pullup_load({
				wrap: $('body'),
				group: $('#collect_group'),
				hintBar: $('#more-hint'),
				callback: function(){
					if(!self_.isloadmore){
						console.log('stop loadinging');
						$('#more-hint').html('没有更多数据了');
						$('#loading-dialog').hide();
						return;
					};
					self_.page += 1;
					$('#loading-dialog').show();
					$.ajax({
						type:'POST',
						url:'https://testapi.pinquduo.cn/api_3_0_1/user/getUserCollection'+'?version=2.0.0&user_id='+user_id+'&page='+self_.page+'&pagesize='+self_.pagesize+'&ajax_get=1',//获取数据
						dataType:'jsonp',
						jsonp: 'jsoncallback',
						async:true,
						success:function(data){
							console.log(data);
							$('#loading-dialog').hide();
							if(self_.isloadmore){
								$('#more-hint').html('上拉加载更多');
								if(data.result.items.length<self_.pagesize){
									console.log('没有更多数据了')
									$('#more-hint').html('没有更多数据了');
									self_.isloadmore = false;
								};
								self_.goods_data = self_.goods_data.concat(data.result.items);
							};
						},
						error: function(xhr,type){
						    console.log('Ajax error!');
						}
					});
				}
			});
		}
	}
});























	    