
import $ from 'webpack-zepto';
import Vue from 'vue';
// import MD5 from '../assets/MD5.js';
// console.log(MD5('https://z.pinquduo.cn/api_3_0_1/index/get_Free_Order?appversion=1.3.6&latitude=0&longitude=0&os=10.3.1&terminal=i&user_id=10928&version=2.0.0'));
import cookie from './cookie.js';

//引入设置视图适配
import set_viewport from '../assets/fontSize.js';
set_viewport();

//引入tap事件反馈样式js
import set_active from '../assets/active.js';

import pullup_load from '../assets/pullup_load.js';

//引入订单/开团 浮动推送
//import hot_feed from '../assets/hot_feed.js';
//hot_feed();




//引入loading 动画
import loading from '../components/loading_ani.vue';
var loading_dialog = new Vue({
	el:'#loading-template',
	render: h=>h(loading)
});

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



new Vue({
	el: '#wrap',
	data: function(){
		return {
			items: [],
			url: '',
			isloadmore: true,
			page: 1,
			free_num:1,
			index:0,
			total:0,
			xhr:null,
			goods_name:''
		}
	},
	mounted: function(){
		var self_ = this;
		self_.url='https://z.pinquduo.cn/api_3_0_1/index/get_Free_Order?free_num='+self_.free_num+'&page=1&pagesize=8&version=2.0.0';
		// self_.url=MD5(self_.url)
		self_.click();
		self_.get_regiment(self_.url);
		// self_.timeCount();
        // if(self_.items.length<self_.total){
            pullup_load({
                wrap: $('body'),
                group: $('#goods-list'),
                hintBar: $('#more-hint'),
                callback: function(){
                    self_.page +=1;
                    self_.url='https://z.pinquduo.cn/api_3_0_1/index/get_Free_Order?free_num='+self_.free_num+'&page='+self_.page+'&pagesize=8&version=2.0.0&ajax_get=1';
                    if(!self_.isloadmore){
                        self_.isloadmore = true;
                    };
                    // console.log(1);
                    // console.log(self_.page);
                    self_.get_regiment(self_.url);
                }
            });
		// }
	},
	methods: {
		get_regiment: function(url){
			var self_ = this;
            self_.url='https://z.pinquduo.cn/api_3_0_1/index/get_Free_Order?free_num='+self_.free_num+'&page=1&pagesize=8&version=2.0.0&ajax_get=1';
            // self_.url=MD5(self_.url);
            // console.log(self_.url);
            // self_.url=self_.url.concat('&ajax_get=1')
			$('#more-hint').html('正在加载...');
			$('#loading-dialog').show();
			self_.xhr=$.ajax({
				type:'GET',
				url:self_.url,//获取数据
				dataType:'jsonp',
				jsonp: 'jsoncallback',
				async:true,
				success:function(data){
                    // console.log(self_.url);
                    $('#loading-dialog').hide();
					// console.log(data);
					// 判断是否拉到底了
                    self_.total=data.result.total;
                    data.result.items.forEach(function (e,i) {
                        console.log(e);
                        console.log(i);
                        data.result.items[i].goods.goods_name = self_.cutString(e.goods.goods_name,58)
                    })
                    self_.items = self_.items.concat(data.result.items);

                    // self_.goods_name=self_.cutString(data.result.items.)
                    if(self_.items.length==data.result.total){

                        $(window).unbind('scroll');
                        $('#more-hint').html('没有更多数据了');
                    }

                    // console.log(1111);
                    Vue.nextTick(function () {
                        self_.timeCount()
					})
					$('#loading-dialog').hide();
				},
				error: function(xhr,type){
				    console.log('Ajax error!');
				}
			});
			return self_.xhr;
		},
		// 拼免
		click:function () {
			var self_=this;
            $('.free-number').on('click','li',function () {
                // 取消上一个正在发送的ajax
                self_.xhr.abort();
            	self_.items=[];
                // console.log(this.id);
                $('.free-number').children().removeClass('free-active');
                $(this).addClass('free-active');
                self_.free_num=this.id;
                // console.log(self_.free_num);
                self_.url='https://z.pinquduo.cn/api_3_0_1/index/get_Free_Order?free_num='+self_.free_num+'&page=1&pagesize=8&version=2.0.0&ajax_get=1';
                self_.get_regiment(self_.url);
                // console.log(self_.url);
            })
        },
		// 倒计时
		timeCount:function(){
            // console.log($('.timed'));
			var self_=this;
            var timeCounts = $('.timed');
            // console.log(timeCounts);
            // console.log(parseInt(Date.now()/1000));
            timeCounts.each(function(i){
                var end_time=self_.items[i].end_time;
                // console.log(end_time);
                var count = $(this);
                var timer = null;
                (function(i){
                    timer = setInterval(function(){
                        // console.log(end_time)
                        var timed_time = parseInt(end_time) - parseInt(Date.now()/1000);
                        if(timed_time>0){
                            // console.log(timed_time);
                            // console.log(1);
                            var day = Math.floor(timed_time/86400)%30;
                            day = day<=0?'' : day+'天'
                            var h = Math.floor(timed_time/3600)%24;
                            h = h < 10 ? '0' + h : h;
                            var m = Math.floor(timed_time/60)%60;
                            m = m<10?'0' + m : m;
                            var s = Math.floor(timed_time%60);
                            s = s < 10 ? '0'+ s : s;
                            count.html(day+' '+h+':'+m+':'+s);
                        }else{
                            clearInterval(timer);
                            count.html('00:00:00');
                            return;
                        }
                    },1000);
                })(i);
            });
		},
		// 字符串超出省略
		cutString:function (str,len) {
            //length属性读出来的汉字长度为1
            if(str.length*2 <= len) {
                return str;
            }
            var strlen = 0;
            var s = "";
            for(var i = 0;i < str.length; i++) {
                s = s + str.charAt(i);
                if (str.charCodeAt(i) > 128) {
                    strlen = strlen + 2;
                    if(strlen >= len){
                        return s.substring(0,s.length-1) + "...";
                    }
                } else {
                    strlen = strlen + 1;
                    if(strlen >= len){
                        return s.substring(0,s.length-2) + "...";
                    }
                }
            }
            return s;
        }
	}
});




















	    