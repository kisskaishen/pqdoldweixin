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

$('#loading-dialog').hide();

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


var hint_timer = null;
new Vue({
	el: '#wrap',
	data: function(){
		return {
			//搜索关键词
			key_words: '',
			//搜索提示
			search_hint: '',
			//历史记录
			history: []
		}
	},
	mounted: function(){
		var self_ = this;	
		self_.get_search();
		self_.get_history();
	},
	methods: {
		//搜索
		get_search: function(){
			var self_ = this;
			$('#search-form').submit(function(e){
				e.preventDefault();
				//搜索关键字
				self_.key_words = $('#words_input').val();
				//console.log(self_.key_words);
				//去除空格
				self_.key_words = self_.key_words.replace(/\s/g,"");
				//空字符判断
				if(self_.key_words== ""){
			        self_.search_hint = '请输入搜索内容';
			        $('#hint-dialog').show();
			         hint_timer=setTimeout(function(){
			        	$('#hint-dialog').hide();
			        },1000);
			        return;
			    };
			    //设置历史记录
			    var history_words = localStorage.getItem('history_words')!=null?'|'+localStorage.getItem('history_words'):'';
			    if(!(history_words.indexOf(self_.key_words)>0)){
			    	localStorage.setItem('history_words',self_.key_words+history_words);
			    };
			    //跳转搜索结果
				location.href = 'goods_search_results.html?key_words='+self_.key_words;
			});
		},
		//获取搜索记录
		get_history: function(){
			var self_ = this;
			//console.log(localStorage);
			if(localStorage.getItem('history_words')!=null&&localStorage.getItem('history_words')){
				self_.history = localStorage.getItem('history_words').split("|");
				//删除大于指定条数目的历史记录
				var max_count = 5;
				if(self_.history.length>=max_count){
					self_.history.length = max_count;
					localStorage.setItem('history_words',self_.history.join("|"));
				};
			};
			
		}
	}
});























	    