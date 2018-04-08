import $ from 'webpack-zepto';
import Vue from 'vue';

import urlSearch from '../assets/urlSearch.js';

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



//获取user_id
// var user_id = cookie.get('user_id')||urlSearch('user_id')||0;
var user_id = cookie.get('user_id')
var oldUserId = urlSearch('user_id')
//获取order_id
var order_id = urlSearch('order_id');
//goods_id
var goods_id = urlSearch('goods_id');

//获取购买类型 0参团 1开团 2单买
//var type_ = urlSearch('type');

console.log('user_id='+user_id);
console.log('order_id='+order_id);
//console.log('type_='+type);

//时间戳转换
function formatDate(now){     
	var year=now.getFullYear();     
  	var month=parseInt(now.getMonth())+1<10?'0'+(parseInt(now.getMonth())+1):parseInt(now.getMonth())+1;     
  	var date=now.getDate()<10?'0'+now.getDate():now.getDate();     
  	var hour=now.getHours()<10?'0'+now.getHours():now.getHours();     
  	var minute=now.getMinutes()<10?'0'+now.getMinutes():now.getMinutes();     
  	var second=now.getSeconds()<10?'0'+now.getSeconds():now.getSeconds();
  	return   year+"-"+month+"-"+date+"   "+hour+":"+minute+":"+second;     
}



var hint_timer = null;

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

$.ajax({
	type:'get',
	url:'https://z.pinquduo.cn/api_3_0_1/user/order_detail'+'?user_id='+user_id+'&page='+1+'&pagesize='+6+'&order_id='+order_id+'&ajax_get=1',//获取数据
	dataType:'json',
	// jsonp: 'jsoncallback',
	async:true,
	success:function(data){
		console.log(data.result);
        // console.log(data.result.order_type == 3);
        // console.log(data.result.order_type == 4 && data.result.goodsInfo.is_special != 8 && data.result.is_oneself != 2);
        // console.log(data.result.order_type == 15 && data.result.goodsInfo.is_special != 8 && data.result.is_oneself != 2);
        // console.log(data.result.order_type == 10 || data.result.order_type == 1);
        $('#loading-dialog').hide();
		new Vue({
			el: '#wrap',
			data: function(){
				return {
					// 页面数据
					data:{},
                    // 订单状态描述
                    text:'',
                    // 天数
					day:'',
                    // 小时
                    hour:'',

					//订单信息
					goodsInfo:{},
	
					//猜你喜欢
					like_info:'',
					likeList:[],
					//订单类型
					order_type: false,
					//user_id
					user_id: user_id,
					//订单id
					order_id: order_id,
					//店铺信息
					store_info: {},		// 店铺信息
					//订单商品信息
					goods_info: {},
					//推荐商品数据/猜你喜欢
					goods_data: [],
					//加载提示
					load_hint: '上拉加载更多',
					//对话框提示
					dialog_hint: '是否延长收货时间？每笔订单只能延迟一次哦~',
					//订单操作提示
					order_hint: '',
					//加载分页
					page: 1,
					//每页条目
					pagesize: 6,
					// 支付按钮标识
                    isPayClick:false,
					// 支付方式
					pay_oauth:'weixin',
                    // 判断设备
                    oauth_pay:'weixin',
                    qq:false,
                    ali:true,
                    group_info:{},			// 拼团信息
                    order_info:{},			// 订单信息
                    btn_info:{},			// 按钮信息
                    showChoose:false
				}
			},
			mounted: function(){

				var self_ = this;	
				if (goods_id&&user_id!=oldUserId) {
					location.href = 'https://wx.pinquduo.cn/goods_detail.html?goods_id='+goods_id
				}
                console.log('得到data');

                self_.data=data.result;				// 总数据
                self_.store_info = data.result.store_info    		// 商家信息
                self_.order_info = data.result.order_info;			// 订单信息，包括个人信息
                self_.group_info = data.result.group_info			// 拼团信息
                self_.btn_info = data.result.show_operate_icon			// 按钮信息
                console.log(self_.order_info)

                var timed_time = parseInt(self_.order_info.count_down_time)
                // var timed_time = parseInt(self_.order_info.count_down_time) - parseInt(Date.now()/1000);
                console.log(self_.order_info.count_down_time)
                console.log('这里是时间：'+timed_time)

                if(timed_time>0){
                    var day = Math.floor(timed_time/86400)%30;
                    self_.day = day<10?'0'+day : day
                    var h = Math.floor(timed_time/3600)%24;
                    self_.hour = h < 10 ? '0' + h : h;
                }else{
                    $('.timed').html('已自动确认收货');
                }
                console.log('day and hour')
                console.log(self_.day)
                console.log(self_.hour)
                self_.getOtherGoods();

                
                //执行上拉加载
	        	self_.$nextTick(function(){
	        		if(self_.likeList.length<self_.pagesize){
	        			$('#more-hint').html('没有更多数据了');
	        			return false;
	        		};
	        		self_.up_load();
	        	});
	        	// 支付功能
                var u = navigator.userAgent.toLowerCase();
                if(u.indexOf('qq/')!= -1){
                    console.log('qq')
                    self_.oauth_pay='qq';
                }else {
                    console.log('weixin')
                }
                var oauth = {
                    //判断微信用户登录
                    isWeiXin: function () {
                        var ua = navigator.userAgent.toLowerCase();
                        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                            return true;
                        } else {
                            return false;
                        }
                        ;
                    },
                    //判断QQ用户登录
                    isQQ: function () {
                        var ua = navigator.userAgent.toLowerCase();
                        if (ua.match(/QQ/i) == 'qq') {
                            return true;
                        } else {
                            return false;
                        }
                        ;
                    }
                }
			},
			methods: {
				// 显示选择弹框
				showChooseDiv: function() {
					this.showChoose = true
				},
				// 获取推荐商品列表
				getOtherGoods: function() {
					var self_ = this
					$.ajax({
						type:'get',
						url:'https://z.pinquduo.cn/api_3_0_1/user/recommend_goods?goods_id='+self_.order_info.goods_id+'&page='+self_.page+'&pagesize='+self_.pagesize,//获取数据
						dataType:'json',
						// jsonp: 'jsoncallback',
						async:false,
						success:function(data){
							console.log(data);
							self_.like_info = data.result
							self_.likeList = data.result.items
							
						},
						error: function(xhr,type){
						    console.log('推荐商品列表Ajax error!');
						}
					});
				},
				//延长收货
				delay_receiving: function(){
					var self_ = this;
					self_.dialog_hint = '是否延长收货时间？每笔订单只能延迟一次哦~';
					self_.order_dialog(function(){
						$.ajax({
							type:'get',
							url:'https://z.pinquduo.cn/api_3_0_1/user/getIncreaseGoodsTime'+'?user_id='+user_id+'&order_id='+order_id+'&ajax_get=1',//获取数据
							dataType:'jsonp',
							jsonp: 'jsoncallback',
							async:false,
							success:function(data){
								console.log(data);
								self_.order_hint = '已延长收货';
								$('#hint-dialog').show();
								clearTimeout(hint_timer);
								hint_timer=setTimeout(function(){
						        	$('#hint-dialog').hide();
						        },1000);
								
							},
							error: function(xhr,type){
								self_.order_hint = '您已延长收货了哦~';
								$('#hint-dialog').show();
								clearTimeout(hint_timer);
								hint_timer=setTimeout(function(){
						        	$('#hint-dialog').hide();
						        },1000);
							    console.log('延长收货Ajax error!');
							}
						});
					});
				},
				//确认收货
				confirm_receiving: function(){
					var self_ = this;
					self_.dialog_hint = '提交后该订单状态不可更改，要确认收货么？';
					self_.order_dialog(function(){
						$.ajax({
							type:'get',
							url:'https://z.pinquduo.cn/api_3_0_1/user/orderConfirm'+'?user_id='+user_id+'&order_id='+order_id+'&ajax_get=1',//获取数据
							dataType:'jsonp',
							jsonp: 'jsoncallback',
							async:false,
							success:function(data){
								console.log(data);
								self_.order_hint = '已确认收货';
								$('#hint-dialog').show();
								clearTimeout(hint_timer);
								hint_timer=setTimeout(function(){
						        	$('#hint-dialog').hide();
						        },1000);
								location.reload();
							},
							error: function(xhr,type){
							    console.log('确认收货Ajax error!');
							}
						});
					});
				},
				//订单操作弹窗
				order_dialog: function(callback){
					var self_ = this;
					var dialog = $('#order-dialog');
					var cancel_btn = $('#order-dialog .btn').eq(0);
					var enter_btn = $('#order-dialog .btn').eq(1);
					var mask = $('#order-dialog .mask');
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
				// 提醒发货
				tip_wuliu:function() {
					var self_ = this;
					$.ajax({
						type:'get',
						url:'https://z.pinquduo.cn/api_3_0_1/user/order_remind'+'?user_id='+user_id+'&order_id='+order_id+'&ajax_get=1',//获取数据
						dataType:'jsonp',
						jsonp: 'jsoncallback',
						async:true,
						success:function(data){
							console.log(data);
							self_.order_hint = '已提醒发货';
							$('#hint-dialog').show();
							clearTimeout(hint_timer);
							hint_timer=setTimeout(function(){
					        	$('#hint-dialog').hide();
					        	location.reload();
					        },1000);
						},
						error: function(xhr,type){
						    console.log('醒发货Ajax error!');
						}
					});
				},
				//立即支付
				pay_order: function(){
					// var self_ = this;
					// var is_prom = self_.data.prom_id?1:0; //1是参团和开团 0是单买
					// //购买类型 0为参团 1开团 2单买
					// var type = self_.order_data.prom_id?1:2;
					// location.href = 'topay.html?goods_id='+self_.goods_info.goods_id+'&user_id='+user_id+'&store_id='+self_.goods_info.store_id+'&order_id='+order_id+'&num='+self_.order_data.num+'&is_prom='+is_prom+'&type='+type;
                    var self_ = this;
                    console.log('1111');
                    if(self_.isPayClick){
                        return false;
                    }
                    self_.isPayClick = true;
                    var openid = cookie.get('openid')||0;//获取微信/qq openid
                    // if(self_.data.user==null){
                    //     self_.hint_info = '您还没有添加收货地址哦~';
                    //     $('#hint-dialog').show();
                    //     hint_timer=setTimeout(function(){
                    //         $('#hint-dialog').hide();
                    //     },1000);
                    //     return false;
                    // };
                    // if(!openid){
                    //     self_.hint_info = '只有登录拼趣多QQ公众号和微信公众号才能支付哦~'
                    //     $('#hint-dialog').show();
                    //     hint_timer=setTimeout(function(){
                    //         $('#hint-dialog').hide();
                    //     },1000);
                    //     return false;
                    // };
                    // var address_id = self_.data.user.address_id;
                    // if(self_.data.goods.prom==0&&prom_type==1){
                    //     //免单拼开团
                    //     var payScriptUrl='https://z.pinquduo.cn/api_3_0_1/Purchase/getBuy'+location.search.replace('&num='+buy_count,'&num='+self_.buy_count)+'&address_id='+address_id+'&prom='+self_.prom_count+'&free='+self_.free_count+'&openid='+openid+'&code='+self_.pay_oauth+'&ajax_get=1&version=2.0.0';
                    // }else{
                    //     var payScriptUrl='https://z.pinquduo.cn/api_3_0_1/Purchase/getBuy'+location.search.replace('&num='+buy_count,'&num='+self_.buy_count)+'&address_id='+address_id+'&openid='+openid+'&code='+self_.pay_oauth+'&ajax_get=1&version=2.0.0';
                    // };
                    // //使用优惠券
                    // if(self_.coupon_id&&self_.coupon_id!=0){
                    //     payScriptUrl+=('&coupon_id='+self_.coupon_id+'&coupon_list_id='+self_.coupon_list_id);
                    // };
                    // console.log(payScriptUrl);
                    //支付请求
                    $('#loading-dialog').show();
                    console.log($('#loading-dialog'));
                    $.ajax({
                        type:'GET',
                        url: 'https://z.pinquduo.cn/api_3_0_1/goods/getCompleteBuy?wxv=2&ajax_get=1&order_id='+order_id+'&openid='+openid+'&code='+self_.pay_oauth,//获取数据
                        // dataType:'jsonp',
                        // jsonp: 'jsoncallback',
                        async:true,
                        success: function(data) {
                            $('#loading-dialog').hide();
                            // alert("data:" + data);
                            if (typeof data == "string") {
                                if (data.indexOf("<script") >= 0) {
                                    $("body").append(data);
                                } else {
                                    var jsonData = JSON.parse(data);
                                    if (jsonData.status == 1) {
                                        //jsApiParameters = jsonData.result.pay_detail;
                                        //callpay2();
                                    } else {
                                        $('#hint-dialog').html('<p class="fs12 tc">' + jsonData.msg + '</p>');
                                        $('#hint-dialog').show();
                                        hint_timer=setTimeout(function(){
                                            $('#hint-dialog').hide();
                                        },1000);
                                    }
                                }
                            } else {
                                if (data.status == 1) {
                                    //jsApiParameters = data.result.pay_detail;
                                    //callpay2();
                                } else {
                                    $('#hint-dialog').html('<p class="fs12 tc">' + data.msg + '</p>');
                                    $('#hint-dialog').show();
                                    hint_timer=setTimeout(function(){
                                        $('#hint-dialog').hide();
                                    },1000);
                                }
                            }
                        },
                        error: function(xhr, type) {
                            //alert("Error:" + xhr+", type=" +type);
                            console.log('/立即支付chucuo');
                        }
                    });
                    return false;
				},
				//取消订单
				cancel_order: function(){
					var self_ = this;
					self_.dialog_hint = '确定取消订单？';
					self_.order_dialog(function(){
						$.ajax({
							type:'get',
							url:'https://z.pinquduo.cn/api_3_0_1/user/cancelOrder'+'?user_id='+user_id+'&order_id='+order_id+'&ajax_get=1',//获取数据
							dataType:'jsonp',
							jsonp: 'jsoncallback',
							async:true,
							success:function(data){
								console.log(data);
								self_.order_hint = '已取消订单！';
								$('#hint-dialog').show();
								clearTimeout(hint_timer);
								hint_timer=setTimeout(function(){
						        	$('#hint-dialog').hide();
						        	location.reload();
						        },1000);
							},
							error: function(xhr,type){
							    console.log('取消订单Ajax error!');
							}
						});
					});	
				},
				// 时间戳转换
                // getLocalTime: function (nS) {
            		// return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
       			//  },
				//上拉加载
				up_load: function(){
					var self_ = this;
					pullup_load({
						wrap: $('body'),
						group: $('#page-goods-group'),
						hintBar: $('#more-hint'),
						data: self_,
						callback: function(){
							self_.page += 1;
							self_.getOtherGoods()
						}
					});
				},
				img_error: function(url,e){
					var img=e.currentTarget;
					img.src=url;
					img.onerror=null;
				},
                pay_select:function(event) {
                    var self_=this;
                    console.log($('.payItem'));
                    if(event=='qpay'){
                        self_.qq=false;
                        self_.ali=true;
                        self_.pay_oauth='qpay';
                        // console.log(self_.qq);
                        // console.log(self_.ali);
                    }else{
                        self_.qq=true;
                        self_.ali=false;
                        self_.pay_oauth='alipay_wap'
                        // console.log(self_.qq);
                        // console.log(self_.ali);
                    }
                }
			}
		});
	},
	error: function(xhr,type){
	    console.log('order_detail 的 Ajax error请求出错!');
	},

});



























	    