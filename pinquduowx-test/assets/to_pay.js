import $ from 'webpack-zepto';
import Vue from 'vue';

//价格过滤
Vue.filter("pricefilter", function(value) {
    console.log(value);
    if(value.toString().split('.')[1].length>=3){
        console.log(parseInt(value * 1000));
        console.log(Math.ceil(parseInt(value * 1000)));
        console.log(Math.ceil(parseInt(value * 1000)/10) / 100);
        return (Math.ceil(parseInt(value*1000)/10)/100).toFixed(2);
    }else{
    	return value.toFixed(2);
    };
});
// Vue.filter("pricefilter", function(value) {
//     if(value.toString().split('.')[1].length>=3){
//         return (Math.floor(value*100)/100+0.01).toFixed(2);
//     }else{
//         return value.toFixed(2);
//     };
// });
//set viewport&font-size
import set_viewport from '../assets/fontSize.js';
set_viewport();
//set tap-event-dom-style
import set_active from '../assets/active.js';

import urlSearch from '../assets/urlSearch.js';

import cookie from '../assets/cookie.js';

//引入loading 动画
import loading from '../components/loading_ani.vue';
var loading_dialog = new Vue({
	el:'#loading-template',
	render: h=>h(loading)
});

//引入订单/开团 浮动推送
//import hot_feed from '../assets/hot_feed.js';
//hot_feed();



var hint_timer = null;//弹窗延时关闭

//获取用户id
var user_id = cookie.get('user_id')||false;
console.log('user_id='+user_id);

//获取参团参数 0为参团 1开团 2单买
var prom_type = urlSearch('type')||undefined;
var type=urlSearch('type')||undefined
var goods_id = urlSearch('goods_id');
var store_id = urlSearch('store_id');
var buy_count = urlSearch('num');
if(!user_id){
	location.href='user_center.html?islogin=false';
};

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
//时间戳转日期
function formatDate(now){
    var year=now.getFullYear();
  	var month=parseInt(now.getMonth())+1<10?'0'+(parseInt(now.getMonth())+1):parseInt(now.getMonth())+1;
  	var date=now.getDate()<10?'0'+now.getDate():now.getDate();
  	return year+"."+month+"."+date;
};
new Vue({
	el: '#wrap',
	data: function(){
		return {
			data: '',
			adr_data:{},
			buy_count: parseInt(urlSearch('num')),
			hint_info: '您还没有添加收货地址哦~',
			//跳转到收货地址列表
			adr_group_route:'',
			//是否拼团/参团，单买 价格判断
			is_prom: urlSearch('is_prom')==1?true:false,
			// 免单拼开团还是拼团
			prom_id:urlSearch('prom_id')?true:false,
			//开团人数
			prom_count: 2,
			//免单人数
			free_count: 1,
			//是否参团
			prom_type: prom_type,
			//可用优惠券
			coupon_data: [],
			//优惠券名
			coupon_name: '',
			//商品单价
			price: 0,
			//优惠价格
			coupon_price: 0,
			//是否有可用优惠券
			has_coupon: false,
			//优惠券id
			coupon_id: '',
			//优惠券列表id
			coupon_list_id: '',
			//支付平台
			pay_oauth: 'weixin',
			//是否已点击购买（避免重复点击）
			isPayClick: false,
			// 可用优惠券
			useful_coupon:[],
            // 付款按钮标识
            oauth_pay:'weixin',
            qq:false,
            ali:true,

            //平台优惠券
            pqd_coupon_list_id:'',
            pqd_coupon_name:'',
            pqd_coupon_price:'',
		}
	},
	mounted: function(){
		var self_ = this;
        self_.adr_group_route= 'adr_add.html'+location.search.replace('&num='+buy_count,'&num='+self_.buy_count)+'&pay_adr_route=topay'
        self_.qq=false;
		self_.ali=true;
        // console.log(self_.oauth_pay);
        var u = navigator.userAgent.toLowerCase();
        if(u.indexOf('qq/')!= -1){
            console.log('qq')
            self_.oauth_pay='qq';
        }else {
        	console.log('weixin')
		}
        self_.get_data();
        // console.log('111');
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
        // console.log('222');
        if(oauth.isQQ()&&!(oauth.isWeiXin())){
			self_.pay_oauth = 'qpay';
		};
        // console.log('333');
        self_.get_address();
		// self_.get_coupon();
        // console.log('444');
        $(function(){
            pushHistory();
        });
        function pushHistory(){
            window.addEventListener("popstate", function(e){
                // alert("回退！");

                window.history.back();
                //在历史记录中后退,这就像用户点击浏览器的后退按钮一样。

                //window.history.go(-1);
                //你可以使用go()方法从当前会话的历史记录中加载页面（当前页面位置索引值为0，上一页就是-1，下一页为1）。

                //self.location=document.referrer;
                //可以获取前一页面的URL地址的方法,并返回上一页。
            }, false);
            var state = {
                title:"",
                url: "#"
            };
            window.history.pushState(state, "", "#");
        };
        // console.log('555');
    },
	methods: {
		//请求页面数据
		get_data: function(){
			var self_ = this;
			$.ajax({
				type:'POST',
				url:'https://testapi.pinquduo.cn/api_3_0_1/goods/getGenerateOrder'+location.search+'&ajax_get=1',//获取数据
				dataType:'jsonp',
				jsonp: 'jsoncallback',
				async:false,
				success:function(data){
                    // console.log('获取到页面数据');
                    self_.data= data.result;
                    if(data.result.coupon){
                        self_.coupon_price=data.result.coupon.money;
                        self_.coupon_id=data.result.coupon.id;
                        self_.coupon_list_id=data.result.coupon.coupon_list_id;
					}
					// console.log(data);
					self_.coupon_name = data.result.coupon!=null?data.result.coupon.name:'当前没有可用优惠券';
                    // self_.refresh_coupon();
					//改变购买数量 获取优惠券
					self_.$nextTick(function(){
						var count_l = $('#buy_countBox .count-btn').eq(0);
						var count_r = $('#buy_countBox .count-btn').eq(1);
						var timer = null;
						function get_refresh(){
							$('#loading-dialog').show();
							clearTimeout(timer);
							timer = setTimeout(function(){
								self_.refresh_coupon();
							},1000);
						};
						count_l.bind('click',function(){
							get_refresh();
						});
						count_r.bind('click',function(){
							get_refresh();
						});
					});
					$('#loading-dialog').hide();
                    // console.log('结束页面数据');
                },
				error: function(xhr,type){
				    console.log('Ajax error!');
				}
			});
		},
		//修改购买数量重新获取优惠券（刷新页面数据）
		refresh_coupon:function(){
			var self_ = this;
			$.ajax({
				type:'POST',
				url:'https://testapi.pinquduo.cn/api_3_0_1/goods/getGenerateOrder'+location.search.replace('&num='+buy_count,'&num='+self_.buy_count)+'&ajax_get=1&version=2.0.0',//获取数据
				dataType:'jsonp',
				jsonp: 'jsoncallback',
				async:false,
				success:function(data){
					console.log(data);
					$('#loading-dialog').hide();
					self_.data = data.result;
                    // console.log(self_.data.coupon.use_start_time);
					self_.coupon_name = data.result.coupon!=null?data.result.coupon.name:'当前没有可用优惠券';
					self_.data.coupon.use_start_time=formatDate(new Date(data.result.coupon.use_start_time*1000));
					self_.data.coupon.use_end_time=formatDate(new Date(data.result.coupon.use_end_time*1000));
                    // self_.get_coupon();
				},
				error: function(xhr,type){
				    console.log('Ajax error!');
				}
			});
		},
		// 购买数量
		buyCount:function (way) {
			var self_=this;
			if(way=='+'){
				self_.buy_count+=1;
			}else {
				self_.buy_count==1?this.buy_count=1:this.buy_count-=1;
			}
			self_.adr_group_route= 'adr_add.html'+location.search.replace('&num='+buy_count,'&num='+self_.buy_count)+'&pay_adr_route=topay'
        },
		//获取收货地址
		get_address: function(){
			if(!user_id){
				return false;
			};
			var self_ = this;
			$.ajax({
				type:'POST',
				url:'https://testapi.pinquduo.cn/api_3_0_1/goods/getUserAddressList/user_id/5838?user_id='+user_id+'&ajax_get=1&version=2.0.0',//获取数据
				dataType:'jsonp',
				jsonp: 'jsoncallback',
				async:false,
				success:function(data){
                    // console.log('获取到地址');
					// console.log(data);
                    // console.log(2222);
                    // self_.adr_data = data.result.address;
                    // console.log(self_.data);
                    if(urlSearch('address_id')){
                        // console.log(1111);
                        for(var i=0;i < data.result.address.length;i++){
                            // console.log(i);
                            // console.log(urlSearch('address_id'));
                            if(urlSearch('address_id')==data.result.address[i].address_id){
                                // console.log('ok');
                                self_.adr_data = data.result.address[i];
                                // console.log(self_.data.user);
                                break;
							}
						};
					}else {
                        for(var i=0;i < data.result.address.length;i++){
                            // console.log(i);
                            // console.log(urlSearch('address_id'));
                            if(data.result.address[i].is_default==1){
                                // console.log('ok');
                                self_.adr_data = data.result.address[i];
                                // console.log(self_.data.user);
                                break;
                            }
                        };
                        // console.log('结束地址');
                    }
                    // self_.hint_info = self_.adr_data
                    // $('#hint-dialog').show();
				},
				error: function(xhr,type){
				    console.log('Ajax error!');
				}
			});
		},
		//获取可用优惠券列表
		get_coupon: function(){
			var self_ = this;
			//type -> 1->团购或者参团，2->单买
			var coupon_type = prom_type!=2?1:2;
			$.ajax({
				type:'POST',
				url:'https://testapi.pinquduo.cn/api_3_0_1/goods/getCoupon?user_id='+user_id+'&store_id='+store_id+'&goods_id='+goods_id+'&num='+self_.buy_count+'&type='+type+'&ajax_get=1&version=2.0.0',//获取数据
				dataType:'jsonp',
				jsonp: 'jsoncallback',
				async:false,
				success:function(data){
					self_.useful_coupon=data.result.items;
                    console.log(self_.useful_coupon);
                    // console.log('coupon_data',data);
                    // console.log(data);
                    $('#loading-dialog').hide();
					for(var i=0;i<self_.useful_coupon.length;i++){
                        console.log(1);
                        self_.useful_coupon[i].use_start_time=formatDate(new Date(self_.useful_coupon[i].use_start_time*1000));
						self_.useful_coupon[i].use_end_time=formatDate(new Date(self_.useful_coupon[i].use_end_time*1000));
					};
				},
				error: function(xhr,type){
				    console.log('Ajax error!');
				}
			});
		},
		//选择优惠券
		select_coupon: function(name,event){
			var self_ = this;
			var el = $(event.currentTarget);
			var index = el.index();
			self_.coupon_name = name;
			self_.coupon_price = self_.useful_coupon[index].money;
			self_.coupon_id = self_.useful_coupon[index].id;
			// console.log(self_.coupon_data[index].id);
		},
		//优惠券弹窗
		coupon_dialog: function(){
            var self_ = this;
			if(self_.data.coupon){
				self_.get_coupon();
				var dialog = $('#coupon-dialog');
				// var cancel_btn = $('#coupon-dialog .btn').eq(0);
				// var enter_btn = $('#coupon-dialog .btn').eq(1);
				// var mask = $('#coupon-dialog .mask');
				var enter_btn = $('#coupon-dialog .enter-btn');
                console.log(dialog);
                dialog.show();
                // var cancel_close_dialog = function(){
				// 	dialog.hide();
				// };
				enter_btn.unbind("click").click(function(){
					dialog.hide();
				});
				// cancel_btn.unbind("click").click(cancel_close_dialog);
				// mask.unbind("click").click(cancel_close_dialog);
			};
		},
		pay: function(){
			var self_ = this;
			if(self_.isPayClick){
				self_.isPayClick = false
				alert('已点击，3s后重试！')
				setTimeout(()=>{
            		self_.isPayClick = true
            	},3000)
            }
			self_.isPayClick = true;
			var openid = cookie.get('openid')||0;//获取微信/qq openid
			if(self_.data.user==null){
				self_.hint_info = '您还没有添加收货地址哦~';
				$('#hint-dialog').show();
		        hint_timer=setTimeout(function(){
		        	$('#hint-dialog').hide();
		        },1000);
		        return false;
			};
			if(!openid){
				self_.hint_info = '只有登录拼趣多QQ公众号和微信公众号才能支付哦~'
				$('#hint-dialog').show();
		        hint_timer=setTimeout(function(){
		        	$('#hint-dialog').hide();
		        },1000);
		        return false;
			};
			var address_id =urlSearch('address_id')||self_.data.user.address_id;
			if(self_.data.goods.prom==0&&prom_type==1){
				//免单拼开团
				var payScriptUrl='https://testapi.pinquduo.cn/api_3_0_1/Purchase/getBuy'+location.search.replace('&num='+buy_count,'&num='+self_.buy_count)+'&address_id='+address_id+'&prom='+self_.prom_count+'&free='+self_.free_count+'&openid='+openid+'&code='+self_.pay_oauth+'&ajax_get=1&version=2.0.0&wxv=2';
			}else{
				var payScriptUrl='https://testapi.pinquduo.cn/api_3_0_1/Purchase/getBuy'+location.search.replace('&num='+buy_count,'&num='+self_.buy_count)+'&address_id='+address_id+'&openid='+openid+'&code='+self_.pay_oauth+'&ajax_get=1&version=2.0.0&wxv=2';
			};
			//使用优惠券
			if(self_.coupon_id&&self_.coupon_id!=0){
				payScriptUrl+=('&coupon_id='+self_.coupon_id+'&coupon_list_id='+self_.coupon_list_id);
			};
			console.log('支付请求地址是：')
            console.log(payScriptUrl);
            //支付请求
            $('#loading-dialog').show();
            console.log($('#loading-dialog'));
            
            $.ajax({
				type:'GET',
				url: payScriptUrl,//获取数据
				//dataType:'jsonp',
				//jsonp: 'jsoncallback',
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
					// console.log(type);
				}
			});
		    return false;
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




























	    