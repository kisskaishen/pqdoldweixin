import $ from 'webpack-zepto';
import Vue from 'vue';


import nav_scroll from '../assets/nav_scroll.js';

//set viewport&font-size
import set_viewport from '../assets/fontSize.js';
set_viewport();

//set tap-event-dom-style
import set_active from '../assets/active.js';

import urlSearch from '../assets/urlSearch.js';

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
var locurl = location.href;
if(locurl.indexOf("?")>-1&&!(locurl.indexOf("&")>-1)){
	var share_url = locurl.replace('?','?_wv=1&');
}else if(!(locurl.indexOf("?")>-1)){
	var share_url = locurl+'?_wv=1';
}else{
	var share_url = locurl+'&_wv=1';
};
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
		    imgUrl: 'https://testapi.pinquduo.cn/Template/pc/pinquduo/Static/images/pqdlogo.jpg', // 分享图标
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
    pic: 'https://testapi.pinquduo.cn/Template/pc/pinquduo/Static/images/pqdlogo.jpg',
    url: share_url
});

//获取类别参数
var cat_id = urlSearch('id');
var cat_type = urlSearch('type');//1为海淘 0为非海淘
var cat_rank = urlSearch('rank')||0;
//一级分类索引
var cat1_index = urlSearch('cat1_index');
//二级分类索引
var cat2_index = urlSearch('cat2_index');

//获取顶部导航数据
$.ajax({
	type:'POST',
	url:'https://testapi.pinquduo.cn/api_3_0_1/index/getexplore&ajax_get=1',//获取数据
	dataType:'jsonp',
	jsonp: 'jsoncallback',
	async:true,
	success:function(data){
		console.log(data);
		new Vue({
			el: '#cat-nav-scroll',
			data: function(){
				return {
					nav_data: []
				}
			},
			mounted: function(){
				var self_ = this;
				//海淘与其他分类判断
				//一级分类
				if(cat_type==1){
					self_.nav_data = [{'name':'全部','id':'0'}].concat(data.result['haitao']['cat2']);
				}else if(cat_type==0){
					self_.nav_data = [{'name':'全部','id':'0'}].concat(data.result['cat'][cat1_index]['cat2']);
				};

				//二级分类
				if(cat_rank==2&&cat_type==1){
					self_.nav_data = data.result['haitao']['cat2'][cat2_index]['cat3'];
				}else if(cat_rank==2&&cat_type==0){
					self_.nav_data = data.result['cat'][cat1_index]['cat2'][cat2_index]['cat3'];
				};
				
				console.log(self_.nav_data);

				self_.$nextTick(function(){
					//初始化导航滑动
					nav_scroll("#cat-nav-scroll");
				});
			},
			methods: {
			}
		});
		//获取商品列表
		$.ajax({
			type:'POST',
			url:'https://testapi.pinquduo.cn/api_3_0_1/goods/getMore?version=2.0.0&'+'id='+cat_id+'&type='+cat_type+'&page='+1+'&pagesize='+6+'&ajax_get=1',//获取数据
			dataType:'jsonp',
			jsonp: 'jsoncallback',
			async:true,
			success:function(data){
				//console.log(data);
				new Vue({
					el: '#page-good-group',
					data: function(){
						return {
							goods_data: data.result.items,
							//是否上拉加载
							isloadmore: true,
							//加载分页
							page: 1,
							//每页条目
							pagesize: 6
						}
					},
					mounted: function(){
						$('#loading-dialog').hide();
						var self_ = this;

						if(data.result.items.length<self_.pagesize){
							$('#more-hint').html('没有更多数据了');
							self_.isloadmore = false;
						};

						self_.$nextTick(function(){
							//tab加载数据
							var tab_items = $('#cat-nav-scroll li');
							tab_items.eq(0).attr('data-id',cat_id);//初始化全部分类id
							tab_items.each(function(i){
								var this_ = $(this);
								this_.bind('click',function(){
									$('#more-hint').hide();
									self_.page = 1;
									self_.goods_data = [];
									self_.cat_id = this_.attr('data-id');
									console.log(self_.cat_id);
									// $('#loading-dialog').show();
									$.ajax({
										type:'POST',
										url:'https://testapi.pinquduo.cn/api_3_0_1/goods/getMore?version=2.0.0&'+'id='+self_.cat_id+'&type='+cat_type+'&page='+self_.page+'&pagesize='+6+'&ajax_get=1',//获取数据
										dataType:'jsonp',
										jsonp: 'jsoncallback',
										async:true,
										success:function(data){
											console.log(data);
											$('#more-hint').show();
											self_.goods_data = data.result.items;
											// $('#loading-dialog').hide();
											if(data.result.items.length<self_.pagesize){
												$('#more-hint').html('没有更多数据了');
												self_.isloadmore = false;
											};
										},
										error: function(xhr,type){
										    console.log('Ajax error!');
										}
									});
								})
							});
							set_active();						
							self_.up_load();
						});	
					},
					methods: {
						//上拉加载
						up_load: function(){
							var self_ = this;
							if(!self_.isloadmore){
								return;
							};
							pullup_load({
								wrap: $('body'),
								group: $('#page-good-group'),
								hintBar: $('#more-hint'),
								callback: function(){
									if(!self_.isloadmore){
										self_.isloadmore = true;
									};
									self_.page += 1;
									// $('#loading-dialog').show();
									$.ajax({
										type:'POST',
										url: 'https://testapi.pinquduo.cn/api_3_0_1/goods/getMore?version=2.0.0&'+'id='+(self_.cat_id||cat_id)+'&type='+cat_type+'&page='+self_.page+'&pagesize='+6+'&ajax_get=1',//获取数据
										dataType:'jsonp',
										jsonp: 'jsoncallback',
										async:true,
										success:function(data){
											console.log(data);
											// $('#loading-dialog').hide();
											if(self_.isloadmore){
												$('#more-hint').html('上拉加载更多');
												if(data.result.items.length==0){
													//console.log('没有更多数据了')
													$('#more-hint').html('没有更多数据了');
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

			},
			error: function(xhr,type){
			    console.log('Ajax error!');
			}
		});

	},
	error: function(xhr,type){
	    console.log('Ajax error!');
	}
});



























	    