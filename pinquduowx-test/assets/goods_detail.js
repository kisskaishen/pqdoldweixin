
import urlSearch from '../assets/urlSearch.js';
//第三方登录
import oauth_login from '../assets/oauth_login.js';
oauth_login("page_name=goods_detail");
cookie.set('goods_id',urlSearch('goods_id'));

import $ from 'webpack-zepto';
import Vue from 'vue';
import focus_swipe from '../assets/focus_swipe.js';


//set viewport&font-size
import set_viewport from '../assets/fontSize.js';
set_viewport();
//set tap-event-dom-style
import set_active from '../assets/active.js';
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



//获取商品url参数
var url_string = location.search;
//获取user_id和商品id
var user_id = cookie.get('user_id')||0;
var goods_id = urlSearch('goods_id');
var order_id = urlSearch('order_id');
var prom_id = urlSearch('prom_id');
// console.log('user_id='+user_id);
// console.log('goods_id='+goods_id);
// console.log('order_id='+order_id);

//获取参团参数 0为参团
var prom_type = urlSearch('type')||'undefined';

var hint_timer = null;//弹窗延时关闭

//分享链接
var locurl = location.href;
if(locurl.indexOf("?")>-1&&!(locurl.indexOf("&")>-1)){
	var share_url = locurl.replace('?','?_wv=1&');
}else if(!(locurl.indexOf("?")>-1)){
	var share_url = locurl+'?_wv=1';
}else{
	var share_url = locurl+'&_wv=1';
};
var data_={};
$.ajax({
	type:'post',
	url:'https://testapi.pinquduo.cn/api_3_0_1/Goods/getDetaile?goods_id='+goods_id+'&user_id='+user_id+'&ajax_get=1&version=2.0.0',//获取数据
	dataType:'jsonp',
	jsonp: 'jsoncallback',
	async:true,
	success:function(data){
		// console.log(data);
		//设置分享页面标题与内容
        data_=data;
        console.log(data_);
        //微信分享
        $.ajax({
            url: "./wechat/share_index.php",
            type: "get",
            data : {
                'url' : location.href.split('#')[0]
            },
            success: function(data) {
                //console.log(data);
                console.log(data_);
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
                console.log('1111');
                console.log(data_);
                console.log(2324);
                var share_config = {
                    title: data_.result.prom_price+'元'+data_.result.goods_name, // 分享标题
                    desc: data_.result.goods_remark, // 分享描述
                    shareUrl: share_url,
                    link: share_url, // 分享链接
                    imgUrl: data_.result.fenxiang_url, // 分享图标
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
            title: data_.result.prom_price+'元'+data_.result.goods_name,
            summary: data_.result.goods_remark,
            pic: data_.result.fenxiang_url,
            url: share_url
        });
        $('#loading-dialog').hide();
        //商品服务标识
        if (data.result.is_special == 1 || data.result.the_raise == 1 || data.result.prom == 0) {
            data.result.goods_service = [
                {title:"包邮"},
                {title:"假一赔十"},
                {title:"48小时发货"}
            ];
        }else{
            data.result.goods_service = [
                {title:"包邮"},
                {title:"七天退换"},
                {title:"假一赔十"},
                {title:"48小时发货"}
            ];
        };
        new Vue({
            el: '#wrap',
            data: function(){
                return {
                    data: data_.result,
                    is_collect: false, //是否收藏过商品
                    hint_info: '收藏成功', //弹窗提示
                    //库存
                    stock_count: data_.result.spec_goods_price[0].store_count,
                    //支付筛选产品图片
                    goods_pic:'images/icon_place.png',
                    //user_id
                    user_id: cookie.get('user_id'),
                    //购买数量
                    buy_count: 1,
                    //商品筛选价格
                    price: data_.result.shop_price||0,
                    //是否参团
                    prom_type: prom_type,
                    //是否单独购买
                    is_prom: 0,
                    // 弹窗数据
                    data_expand:'',
                    // 团购信息
                    group_buy:'',
                    spec_key:'',
                    goodsPic:data_.result.spec_goods_price[0].img || '',//商品图片
                    spec_key:''
                }
            },
            mounted: function(goods_id,user_id){
                // console.log(goods_id);
                var self_ = this;
                self_.data=data.result;
                self_.expand();
                self_.getGroup();
                // console.log(self_.data_expand);
                // console.log(self_.group_buy);
                //商品服务标识
                self_.data.goods_service = data.result.goods_service;
                //console.log(self_.data);
                focus_swipe('#focus-pic');
                $('#detail-container').append(data.result.html);

                //筛选默认产品图片
                $('.select-box .item').each(function(){
                    if($(this).attr('pic-src')){
                        self_.goods_pic = $(this).attr('pic-src');
                        return false
                    };
                });

                //参团人员信息显示
                if(self.group_buy){
                    $('#prom-group').show();
                };

                //收藏状态判断（是否收藏过 收藏按钮高亮样式状态）
                // console.log('collect='+self_.data.collect)
                // if(self_.data.collect==1){
                //     self_.is_collect = true;
                // };
                set_active();
                //购买
                var buy_dialog = $('#buy-dialog');
                var hasprom = false;//价格(团/单买) 判断
                function buy_dialog_show(){
                    $('#wrap').css({
                        'height': $(window).height(),
                        'overflow': 'hidden'
                    });
                    buy_dialog.show();
                };
                function buy_dialog_hide(){
                    $('#wrap').css({
                        'height': 'auto',
                        'overflow': 'auto'
                    });
                    buy_dialog.hide();
                };

                // 价格,销量 筛选
                var select_groups = $('.select-box .select-group');
                function spec_goods(){
                	var spec_price = self_.data.spec_goods_price;
                    var spec_key='';
                	var spec_key2='';
                	select_groups.each(function(i){
                		if(select_groups.eq(i).attr('select_spec_id')){
                            spec_key += (select_groups.eq(i).attr('select_spec_id')+'_');
                			spec_key2 = spec_key.split("_").reverse().join("_");
                		};
                	});
                	spec_key = spec_key.substr(0, spec_key.length - 1);
                    spec_key2 = spec_key2.substr(1,spec_key2.length)
                	for(var i=0,len=spec_price.length;i<len;i++){
                		if(spec_key==spec_price[i].key || spec_key2 ==spec_price[i].key){
                            if (spec_key==spec_price[i].key) {
                                self_.spec_key = spec_key
                            } else {
                                self_.spec_key = spec_key2
                            }
                            self_.goodsPic = spec_price[i].img
                			if(hasprom){
                				self_.price = spec_price[i].prom_price;
                			}else{
                				self_.price = spec_price[i].price;
                			};
                			self_.stock_count = spec_price[i].store_count;
                		}
                	};
                };
                // var select_groups = $('.select-box .select-group');
                // function spec_goods(){
                //     var spec_price = self_.data.spec_goods_price;
                //     var spec_key='';
                //     select_groups.each(function(i){
                //         if(select_groups.eq(i).attr('select_spec_id')){
                //             spec_key += (select_groups.eq(i).attr('select_spec_id')+'_');
                //         };
                //     });
                //     spec_key = spec_key.substr(0, spec_key.length - 1);
                //     for(var i=0,len=spec_price.length;i<len;i++){
                //         if(spec_key==spec_price[i].key){
                //             if(hasprom){
                //                 self_.price = spec_price[i].prom_price;
                //             }else{
                //                 self_.price = spec_price[i].price;
                //             };
                //             self_.stock_count = spec_price[i].store_count;
                //         }
                //     };
                // };
                function select(items){
                    var pre = 0;
                    items.eq(0).addClass('checked');
                    items.eq(0).parents('.select-group').attr('select_spec_id',items.eq(0).attr('spec_id'));
                    items.each(function(){
                        $(this).click(function(){
                            var this_ = $(this);
                            var cur = this_.index();
                            items.eq(pre).removeClass('checked');
                            this_.addClass('checked');
                            this_.parents('.select-group').attr('select_spec_id',this_.attr('spec_id'));
                            if(this_.attr('pic-src')){
                                self_.goods_pic = this_.attr('pic-src');
                            };
                            //价格,销量筛选
                            spec_goods();
                            pre = cur;
                        });
                    });
                };
                select_groups.each(function(i){
                    select(select_groups.eq(i).find('.item'));
                });
                // 不支持团购商品改变购买样式
                // console.log(self_.data_expand.is_prom_buy);


                // 点击之后弹窗
                // 单独购买
                $('#buy-s-btn').click(function(){
                    hasprom = false;
                    console.log(self_.data_expand.is_support_buy);
                    if(self_.data_expand.is_support_buy==0){
                        // console.log(data_.is_support_buy);
                        self_.hint_info = self_.data_expand.support_prompt;
                        $('#hint-dialog').show();
                        hint_timer=setTimeout(function(){
                            $('#hint-dialog').hide();
                        },1000);
                        return false;
					}
                    self_.is_prom = 0;
                    self_.price = self_.data.shop_price;
                    buy_dialog_show();
                    spec_goods();
                });
                // 团购
                $('#buy-m-btn').click(function(){
                    if(self_.data_expand.is_prom_buy==0){
                        self_.hint_info = self_.data_expand.prom_prompt;
                        $('#hint-dialog').show();
                        hint_timer=setTimeout(function(){
                            $('#hint-dialog').hide();
                        },1000);
                        return false;
                    }
                    if(self_.data.is_special==8){
                        self_.hint_info = 'app专享';
                        $('#hint-dialog').show();
                        hint_timer=setTimeout(function(){
                            $('#hint-dialog').hide();
                        },1000);
                        return false;
                    }
                    hasprom = true;
                    self_.is_prom = 1;
                    self_.price = self_.data.prom_price;
                    buy_dialog_show();
                    spec_goods();
                });
                // 关闭弹窗
                buy_dialog.find('.mask').click(function(){
                    buy_dialog_hide();
                });
                buy_dialog.find('.close').click(function(){
                    buy_dialog_hide();
                });
                //参团进入显示筛选弹窗 筛选商品规格 //立即参团
                if(prom_type==0||prom_type==1){
                    hasprom = true;
                    self_.price = self_.data.prom_price;
                    buy_dialog_show();
                    spec_goods();
                };
                //商品筛选
                function select(items){
                    var pre = 0;
                    items.eq(0).addClass('checked');
                    items.eq(0).parents('.select-group').attr('select_spec_id',items.eq(0).attr('spec_id'));
                    items.each(function(){
                        $(this).click(function(){
                            var this_ = $(this);
                            var cur = this_.index();
                            items.eq(pre).removeClass('checked');
                            this_.addClass('checked');
                            this_.parents('.select-group').attr('select_spec_id',this_.attr('spec_id'));
                            if(this_.attr('pic-src')){
                                self_.goods_pic = this_.attr('pic-src');
                            };
                            //价格,销量筛选
                            spec_goods();
                            pre = cur;
                        });
                    });
                };
                select_groups.each(function(i){
                	select(select_groups.eq(i).find('.item'));
                });
                //立即支付
                if(!cookie.get('user_id')){
                    $('#buy-btn').click(function(){
                        location.href='user_center.html?islogin=false';
                        return false;
                    });
                }else{
                    var data_ = data.result;
                    var goods_id = data_.goods_id;
                    var store_id = data_.store.id;
                    var user_id = cookie.get('user_id')||0;
                    //data_.spec_goods_price[0].key;//商品规格
                    var spec_key='';
                    var type_;//购买类型：0 参团 1开团 2单买
                    var is_prom = 0;//是否拼/参/开团 1为参开团 0为单买
                    $('#buy-btn').click(function(){
                    	// 库存判断
                        // if(self_.stock_count==0){
                         //    self_.hint_info = '库存不足哦~';
                         //    $('#hint-dialog').show();
                         //    hint_timer=setTimeout(function(){
                         //        $('#hint-dialog').hide();
                         //    },1000);
                         //    return false;
                        // };
                        // select_groups.each(function(i){
                        // 	if(select_groups.eq(i).attr('select_spec_id')){
                        // 		spec_key += (select_groups.eq(i).attr('select_spec_id')+'_');
                        // 	};
                        // });
                        // spec_key = spec_key.substr(0, spec_key.length - 1);
                        //alert(spec_key);
                        if(!hasprom){
                            is_prom = 0;
                            type_ = 2;
                        }else{
                            is_prom = 1;
                            type_ = 1;
                        };
                        //参团进入 设置参团参数
                        if(prom_type == 0){
                            is_prom = 1;
                            type_ = 0;
                            location.href="topay.html?"+'goods_id='+goods_id+'&user_id='+user_id+'&store_id='+store_id+'&num='+self_.buy_count+'&spec_key='+self_.spec_key+'&is_prom='+is_prom+'&type='+type_+'&prom_id='+prom_id;
                            return false;
                        };
                        location.href="topay.html?"+'goods_id='+goods_id+'&user_id='+user_id+'&store_id='+store_id+'&num='+self_.buy_count+'&spec_key='+self_.spec_key+'&is_prom='+is_prom+'&type='+type_;
                        return false;
                    });
                };
            },
            methods: {
                //获取扩展内容
                expand:function (){
                    var self_=this;
                    $.ajax({
                        type: 'POST',
                        url: 'https://testapi.pinquduo.cn/api_3_0_1/goods/getDetaile_expand?goods_id=' + goods_id + '&user_id=' + user_id + '&ajax_get=1&version=2.0.0',//获取数据
                        dataType: 'jsonp',
                        jsonp: 'jsoncallback',
                        async: true,
                        success: function (data) {
                            self_.data_expand=data.result;
                            if(self_.data_expand.is_prom_buy==0){
                                console.log(3333);
                                console.log($('#buy-s-btn'));
                                $('#buy-s-btn').css('background-color','#df2728');
                                $('#buy-m-btn').css('background-color','gray');
                            }
                            // console.log(self_.data_expand);
                            //收藏状态判断（是否收藏过 收藏按钮高亮样式状态）
                            // console.log('collect='+self_.data.collect)
                            // console.log(222);
                            if(data.result.collect==1){
                                // console.log(1111);
                                self_.is_collect = true;
                                // console.log(self_.is_collect);
                            };
                        },
                        error: function (xhr, type) {
                            console.log('Ajax error!');
                        }
                    })
                },
                // 获取团购信息
                getGroup:function (){
                    var self_=this;
                    $.ajax({
                        type: 'POST',
                        url: 'https://testapi.pinquduo.cn/api_3_0_1/goods/getAvailableGroup?goods_id=' + goods_id + '&user_id=' + user_id + '&ajax_get=1&version=2.0.0',//获取数据
                        dataType: 'jsonp',
                        jsonp: 'jsoncallback',
                        async: true,
                        success: function (data) {
                            self_.group_buy=data.result.group_buy;
                            console.log(data.result.group_buy);
                            Vue.nextTick(function () {
                                var timeCounts = $('.timed');
                                timeCounts.each(function(i){
                                    console.log(1);
                                    var count = $(this);
                                    var timer = null;
                                    (function(i){
                                        timer = setInterval(function(){
                                            var timed_time = parseInt(self_.group_buy[i].end_time) - parseInt(Date.now()/1000);
                                            console.log(timed_time);
                                            if(timed_time>0){
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
                            })
                        },
                        error: function (xhr, type) {
                            console.log('Ajax error!');
                        }
                    })
                },
                //商品收藏
                collect: function(){
                    //如果未登录跳转到登录页面
                    if(!cookie.get('user_name')){
                        location.href='user_center.html?islogin=false';
                        return;
                    };
                    var self_ = this;
                    var collect_type;//收藏状态 1 ->取消收藏  0 ->已经收藏了 2 ->收藏成功
                    if(!self_.is_collect){
                        self_.is_collect = true;
                        self_.hint_info = '收藏成功';
                        collect_type = 0;
                    }else{
                        self_.is_collect = false;
                        self_.hint_info = '已取消收藏';
                        collect_type = 1;
                    };
                    $.ajax({
                        type:'POST',
                        url:'https://testapi.pinquduo.cn/api_3_0_1/goods/collectGoods'+'?user_id='+user_id+'&goods_id='+goods_id+'&type='+collect_type+'&ajax_get=1',//获取数据
                        dataType:'jsonp',
                        jsonp: 'jsoncallback',
                        async:true,
                        success: function(data){
                            // console.log(data);
                            $('#hint-dialog').show();
                            hint_timer=setTimeout(function(){
                                $('#hint-dialog').hide();
                            },1000);
                        },
                        error: function(xhr,type){
                            console.log('Ajax error!');
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























	    