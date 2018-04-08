import $ from 'webpack-zepto';
import Vue from 'vue';


import Swiper from './swiper.min.js';

//set viewport&font-size
import set_viewport from '../assets/fontSize.js';
set_viewport();

//set tap-event-dom-style
import set_active from '../assets/active.js';

import urlSearch from '../assets/urlSearch.js';

import cookie from '../assets/cookie.js';

import pullup_load from '../assets/pullup_load.js';

import sign from '../assets/sign.js';

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

//获取商品url参数
var url_string = location.search;

//获取店铺id和用户id
var store_id = urlSearch('store_id');
var user_id = cookie.get('user_id');

//提示弹窗计时器
var hint_timer = null;

//时间戳转日期
function formatDate(now){     
	var year=now.getFullYear();     
  	var month=parseInt(now.getMonth())+1<10?'0'+(parseInt(now.getMonth())+1):parseInt(now.getMonth())+1;     
  	var date=now.getDate()<10?'0'+now.getDate():now.getDate();     
  	return year+"."+month+"."+date;    
};




var qs = sign.sign({
	store_id: store_id,
	stor: 'sales',
	page: 1,
	pagesize: 10,
	ajax_get: 1,
    version:'2.0.0'
});
$.ajax({
	type:'POST',
	url:'https://testapi.pinquduo.cn/api_3_0_1/store/getStoreList?'+ qs,//获取数据
	dataType:'jsonp',
	jsonp: 'jsoncallback',
	async:true,
	success:function(data){
		console.log(data);
        new Vue({
			el: '#wrap',
			data: function(){
				return {
					user_id: user_id,
					store_id: store_id,
					data: data.result,
					//是否有购物券
					has_coupon: false,
					//优惠券截止日期
					use_endDate: [],
					//优惠券领取提示
					coupon_info: '领取成功！',
					//加载分页
					page: 1,
					//排序类型
					stor: 'sales',
					//每页条目
					pagesize: 6
				}
			},
			mounted: function(){
				$('#loading-dialog').hide();
				var self_ = this;
				console.log(self_.data);
                console.log('444');
                self_.$nextTick(function(){
					//优惠券列表滑动
					var  category_scroll = new Swiper('#coupon-group', {
				        slidesPerView: 'auto',
				        paginationClickable: true,
				        spaceBetween:0,
				        observer:true,//修改swiper自己或子元素时，自动初始化swiper
						observeParents:true,//修改swiper的父元素时，自动初始化swiper
				        freeMode: true
				    });
				});

				self_.$nextTick(function(){
					self_.up_load();
                    if(data.result.goods.items.length<self_.pagesize){
						$('#more-hint').html('没有更多数据了');
					};
					set_active();
				});

				if(self_.data.coupon&&self_.data.coupon.length>0){
					self_.has_coupon = true;
					for(var i=0;i<self_.data.coupon.length;i++){
						self_.use_endDate.push(formatDate(new Date(self_.data.coupon[i].use_end_time*1000)));
					};
				};
				
			},
			methods: {
				//领取优惠券
				draw_coupon: function(e){

					//未登录跳转
					if(!user_id){
                    	location.href='user_center.html?islogin=false';
                    	return;
					};


					var self_ = this;
					var el = $(e.currentTarget);
					var index = el.index();

					var coupon_id = self_.data.coupon[index].id;

					console.log(coupon_id);

					

					//console.log('https://testapi.pinquduo.cn/api_3_0_1/api/user/getReceiveCoupon?'+'user_id='+user_id+'&coupon_id='+coupon_id+'&ajax_get=1')
					var qs = sign.sign({
						user_id: user_id,
						coupon_id: coupon_id,
						ajax_get: 1,
                        version:'2.0.0'
					});
					$.ajax({
						type:'POST',
						url:'https://testapi.pinquduo.cn/api_3_0_1/user/getReceiveCoupon?' + qs,//获取数据
						dataType:'jsonp',
						jsonp: 'jsoncallback',
						async:true,
						success:function(data){
							console.log(data);
							$('#hint-dialog').show();
							clearTimeout(hint_timer);
					        hint_timer=setTimeout(function(){
					        	$('#hint-dialog').hide();
					        },1000);
							
							if(data.status==-1){
								self_.coupon_info = data.msg;
								return;
							};
							$(el).addClass('disabled');
							self_.coupon_info = '领取成功！';
						},
						error: function(xhr,type){
						    console.log('Ajax error!');
						}
					});
				},
				//商品排序
				goods_sort: function(e){
					
					var self_ = this;
					var el = $(e.currentTarget);
					//商品排序选项
					var sort_item = $('#sort-tab .tab-item');
					sort_item.each(function(i){
						sort_item.eq(i).removeClass('active');
					});
					el.addClass('active');
					
					//分页
					self_.page = 1;

					//排序类型
					self_.stor = el.attr('data-load');
					console.log(self_.stor);

					
					// $('#loading-dialog').show();
					var qs = sign.sign({
						store_id: store_id,
						stor: self_.stor,
						page: self_.page,
						pagesize: 6,
						ajax_get: 1,
                        version:'2.0.0'
					});
					$.ajax({
						type:'POST',
						url:'https://testapi.pinquduo.cn/api_3_0_1/store/getStoreList?' + qs,//获取数据
						dataType:'jsonp',
						jsonp: 'jsoncallback',
						async:true,
						success:function(data){
							console.log(data);
							// $('#loading-dialog').hide();
							self_.data.goods.items = data.result.goods.items;
						},
						error: function(xhr,type){
						    console.log('Ajax error!');
						}
					});
				},
				//上拉加载
				up_load: function(){
					var self_ = this;
                    console.log('222');
                    pullup_load({
						wrap: $('body'),
						group: $('#page-good-group'),
						hintBar: $('#more-hint'),
						callback: function(){
							if(!self_.isloadmore){
								self_.isloadmore = true;
							};
							self_.page +=1;
							// $('#loading-dialog').show();
							var qs = sign.sign({
								store_id: store_id,
								stor: self_.stor,
								page: self_.page,
								pagesize: 10,
								ajax_get: 1,
                                version:'2.0.0'
							});
							$.ajax({
								type:'POST',
								url:'https://testapi.pinquduo.cn/api_3_0_1/store/getStoreList?' + qs,//获取数据
								dataType:'jsonp',
								jsonp: 'jsoncallback',
								async:true,
								success:function(data){
                                    console.log(data);
									$('#loading-dialog').hide();
									if(self_.isloadmore){
										$('#more-hint').html('上拉加载更多');
										if(data.result.goods.items.length==0){
											//console.log('没有更多数据了')
											$('#more-hint').html('没有更多数据了');
										};
										self_.data.goods.items = self_.data.goods.items.concat(data.result.goods.items);
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























	    