
import $ from 'webpack-zepto';
import Vue from 'vue';

import cookie from './cookie.js';

//引入设置视图适配
import set_viewport from '../assets/fontSize.js';
set_viewport();



//引入tap事件反馈样式js
import set_active from '../assets/active.js';

// import tab from '../assets/tab.js';

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
	var share_url = locurl.replace('?','?_wv=1');
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
			haitao: {},
			items:[],
			itemContent:{},
            cat1_index:'',
		}
	},
	mounted: function(){
		this.update_data('https://z.pinquduo.cn/api_3_0_1/index/getexplore&ajax_get=1&version=2.0.0');
            // this.tab();
        // console.log(this.items);
    },
	methods: {
        update_data: function (url) {
            var self_ = this;
            $.ajax({
                type: 'GET',
                url: url,//获取数据
                dataType: 'jsonp',
                jsonp: 'jsoncallback',
                async: true,
                success: function (data) {
                    // console.log(data);
                    self_.items = data.result.cat.concat(data.result.haitao);
                    self_.itemContent=self_.items[0];
                    console.log(self_.items);
                    // self_.haitao = data.result.haitao;
                    self_.$nextTick(function () {
                        self_.tab($('.tab-options .item'), $('.tab-contents-group .content-item'));
                        $('#loading-dialog').hide();
                    });
                    // console.log(data.result.cat);
                },
                error: function (xhr, type) {
                    console.log('Ajax error!');
                }
            });
        },
        tab: function (options, contents) {
        	var self_=this;
            $(document).ready(function () {
                //console.log(options.length);
                var pre = 0;
                options.each(function () {
                    $(this).bind('click', function () {
                        var this_ = $(this);
                        var cur = this_.index();
                        self_.cat1_index=cur;
                        // console.log(self_.items);
                        self_.itemContent=self_.items[cur];
                        console.log(self_.itemContent);
                        console.log(self_.itemContent);
                        console.log(cur);
                        if (pre == cur) {
                            return;
                        };
                        options.eq(pre).removeClass('active');
                        // contents.eq(pre).hide();
                        this_.addClass('active');
                        // contents.eq(cur).show();
                        pre = cur;
                    });
                });
            });
        }
    }
});




















	    