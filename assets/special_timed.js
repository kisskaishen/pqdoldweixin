import $ from 'webpack-zepto';
import Vue from 'vue';




//set viewport&font-size
import set_viewport from '../assets/fontSize.js';
set_viewport();

//set tap-event-dom-style
import set_active from '../assets/active.js';



import pullup_load from '../assets/pullup_load.js';
import tab from '../assets/tab.js';
import Swiper from '../assets/swiper.min.js';
//https://z.pinquduo.cn/api_3_0_1/api/index/get_seconds_kill_time&ajax_get=1

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

//日期格式转10位时间戳
function date_format(format){
	return parseInt(new Date(format.replace(/-/g, '/')).getTime())/1000;
};

//提示延迟
var hint_timer = null;

new Vue({
	el: '#wrap',
	data: function(){
		return {
			goods_data: [],
			times_data: [],
			starttime: 0,
			endtime: 0,
			nowtime: 0,
			active: 0,
			isloadmore: true,
			load_hint: '正在加载...',
			hint_info: '还未到秒杀时间哦~',
			page: 1,
			pagesize: 6
		}
	},
	mounted: function(){
		var self_ = this;
		self_.get_times();
		self_.$nextTick(function(){
			set_active();
		});
		self_.upload_data();
		self_.get_nowtime();
	},	
	methods: {
		//获取时间轴
		get_times: function(){
			var self_ = this;
			$.ajax({
				type:'POST',
				url:'https://z.pinquduo.cn/api_3_0_1/index/get_seconds_kill_time&ajax_get=1&version=2.0.0',//获取时间轴数据
				dataType:'jsonp',
				jsonp: 'jsoncallback',
				async:true,
				success:function(data){
					//console.log(data);
					if (!data.result.time) {
						return;
					}
					self_.times_data = data.result.time;
					//限时滑动
				    var brand_scroll = new Swiper('#rush-scroll', {
				        slidesPerView: 'auto',
				        paginationClickable: true,
				        spaceBetween:0,
				        observer:true,//修改swiper自己或子元素时，自动初始化swiper
						observeParents:true,//修改swiper的父元素时，自动初始化swiper
				        freeMode: true
				    });
				    self_.starttime = date_format(self_.times_data[0].datetime+':00:00');
				    self_.endtime = self_.times_data.length>1?date_format(self_.times_data[1].datetime+':00:00')
				    :date_format('2500-12-31 00:00:00');
			    	self_.get_data();
				},
				error: function(xhr,type){
				    console.log('Ajax error!');
				}
			});
		},
		//时间轴切换
		tab_time: function(item,e){
			var self_ = this;
			var el = $(e.currentTarget);
			var index = el.index();
			if(self_.active==index){
				return;
			};
			self_.active = index;
			self_.page = 1;
			self_.goods_data = [];
			self_.isloadmore = true;
			self_.starttime = date_format(item.datetime+':00:00');
		    if(self_.times_data[index+1]){ 
		    	self_.endtime = date_format(self_.times_data[1].datetime+':00:00');
		    }else{
		    	self_.endtime = date_format('2500-12-31 00:00:00');
		    };
			$('#more-hint').html('正在加载...');
			self_.get_data();
		},
		//获取商品数据
		get_data: function(){
			var self_ = this;
			$('#loading-dialog').show();
			$.ajax({
				type:'POST',
				url:'https://z.pinquduo.cn/api_3_0_1/index/get_Seconds_Kill?ajax_get=1&version=2.0.0&starttime='+self_.starttime+'&endtime='+self_.endtime+'&page='+self_.page+'&pagesize='+self_.pagesize,//获取商品列表数据
				dataType:'jsonp',
				jsonp: 'jsoncallback',
				async:true,
				success:function(data){
					//console.log(data);
					$('#loading-dialog').hide();
					self_.goods_data = self_.goods_data.concat(data.result.items);
					$('#more-hint').html('上拉加载更多');
					if(data.result.items.length<data.result.pagesize){
						//console.log('没有更多数据了')
						self_.isloadmore = false;
						$('#more-hint').html('没有更多数据了');
					};
					
				}
			})
		},
		//上拉加载
		upload_data: function(){
			var self_  = this;
	    	pullup_load({
				wrap: $('body'),
				group: $('#goods-group'),
				hintBar: $('#more-hint'),
				callback: function(){
					if(!self_.isloadmore){
						$('#more-hint').html('没有更多数据了');
						return;
					};
					self_.page+=1;
					self_.get_data();
				}
			});
		},
		//获取服务器时间
		get_nowtime: function(){
			var self_ = this;
			$.ajax({
				type:'POST',
				url:'ext/get_time.php',
				dataType:'string',
				jsonp: 'jsoncallback',
				async:true,
				success:function(data){
					console.log('time:'+data);
					self_.nowtime = data;
				}
			})
		},
		//开始抢购
		start_buy: function(goods_id){
			var self_ = this;
			//console.log(self_.starttime);
			if(self_.nowtime<self_.starttime){
				$('#hint-dialog').show();
		        hint_timer=setTimeout(function(){
		        	$('#hint-dialog').hide();
		        },1000);
				return false;
			}else{
				location.href = "goods_detail.html?goods_id="+goods_id;
			}
		}

	}
});








	
























	    