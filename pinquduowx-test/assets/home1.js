// //第三方登录
alert('加载前')
import oauth_login from '../assets/oauth_login.js';
oauth_login("page_name=home");


import $ from 'webpack-zepto';
import Vue from 'vue';

import cookie from './cookie.js';

//引入设置视图适配
import set_viewport from '../assets/fontSize.js';
set_viewport();

import focus_swipe from '../assets/focus_swipe.js';
import nav_scroll from '../assets/nav_scroll.js';

//引入tap事件反馈样式js
import set_active from '../assets/active.js';

import pullup_load from '../assets/pullup_load.js';

//引入订单/开团 浮动推送
import hot_feed from '../assets/hot_feed.js';
hot_feed();



//引入loading 动画
import loading from '../components/loading_ani.vue';
var loading_dialog = new Vue({
    el: '#loading-template',
    render: h => h(loading)
});



console.log(1)
console.log(location.href)

//分享
var locurl = location.href;
if (locurl.indexOf("?") > -1 && !(locurl.indexOf("&") > -1)) {
    var share_url = locurl.replace('?', '?_wv=1');
} else if (!(locurl.indexOf("?") > -1)) {
    var share_url = locurl + '?_wv=1';
} else {
    var share_url = locurl + '&_wv=1';
};
//微信分享
$.ajax({
    url: "./wechat/share_index.php",
    type: "get",
    data: {
        'url': location.href.split('#')[0]
    },
    success: function(data) {
        var data = JSON.parse(data);
        //console.log('share_data='+data);
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名
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
            success: function() {
                //alert('分享成功！');
            },
            cancel: function() {
                //alert('已取消分享！');
            }
        };

        wx.ready(function() {
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



new Vue({
    el: '#wrap',
    data: function() {
        return {
            //首页数据
            home_data: {},
            //顶部导航数据
            header_data: {},
            //首页商品列表
            goods_items: [],
            //导航tab商品分类
            cat_goods_data: [],
            total:0,
            hint_timer: null,
            dialog_hint: '',
            hot_banner_url: 'images/hot_banner.jpg',
            //首页焦点图下功能导航配置
            // links: [
            //     {
            //         href: 'likes.html'
            //     },
            //     {
            //         href: 'free_group.html'
            //     },
            //     {
            //         href: 'special_haitao.html'
            //     },
            //     {
            //         href: 'javascript:;'
            //     },
            //     {
            //         href: 'javascript:;'
            //     },
            //     {
            //         href: 'special99.html'
            //     },
            //     {
            //         href: 'special_timed.html'
            //     },
            //     {
            //         href: 'save_money.html'
            //     }
            // ],
            links: [
                'likes.html',
                'qualityFruit.html?nav',
                'special_haitao.html',
                'strict_selection.html',
                'homeProducts.html',
                'special99.html',
                'brandClearance.html',
                'save_money.html'
            ],
            page: 1,
            pagesize: 20,
            pullup_load: null,
            cat_index: 0,
            isInit: false,
            index:0,
            control:false,
            lotteryCtr:false,
            homeBanner:[],
            dialogCtr:'',
            redPacketInfo:'',
        }
    },
    mounted: function() {
        var self_ = this;
        self_.get_header_data();
        // console.log(self_.header_data);
        self_.get_home_data(self_.page);
        // self_.get_cats();
        // $('#more-hint').html('正在加载...');
        //首页商品上拉加载
            self_.pullup_load = pullup_load({
                wrap: $('body'),
                group: $('#home-goods-group'),
                hintBar: $('#more-hint'),
                control:self_.control,
                callback: function() {
                    // if(self_.items.length<self_.total){
                    self_.page += 1;
                    self_.get_home_data(self_.page);
                    // }
                }
            });

        // self_.goProm();
        // Vue.nextTick(function () {
        //     console.log(document.querySelector('#main'));
        //
        // })
    },
    methods: {
        //获取首页顶部菜单
        get_header_data: function() {
            var self_ = this;
            $.ajax({
                type: 'GET',
                url: 'https://testapi.pinquduo.cn/api_3_0_1/api/index/getexplore?ajax_get=1&version=2.0.0', //获取首页数据
                dataType: 'jsonp',
                jsonp: 'jsoncallback',
                async: true,
                success: function(data) {
                    // console.log(data);
                    self_.header_data=[{name:'首页'}];
                    self_.header_data =self_.header_data.concat(data.result.cat)
                    console.log(self_.header_data);
                    self_.$nextTick(function() {
                        nav_scroll("#cat-nav-scroll");
                    });
                    for (var i = 0; i < data.length - 1; i++) {
                        self_.cat_goods_data.goods_items.push([]);
                    };
                    // console.log(self_.cat_goods_data.goods_items);
                },
                error: function(xhr, type) {
                    console.log('Ajax error!');
                }
            });
        },
        //获取首页数据
        // get_home_data: function(page) {
        //     var self_ = this;
        //     $.ajax({
        //         type: 'GET',
        //         url: 'https://testapi.pinquduo.cn/api_3_0_1/index/home?version=2.0.0' + '&pagesize=' + self_.pagesize + '&page=' + page + '&ajax_get=1&version=2.3', //获取首页数据
        //         dataType: 'jsonp',
        //         jsonp: 'jsoncallback',
        //         async: true,
        //         success: function(data) {
        //             $('#loading-dialog').hide();
        //             //console.log(data);
        //             self_.home_data = data.result;
        //             self_.goods_items = self_.goods_items.concat(data.result.goodsList.items);
        //             // 判断是否拉到底了
        //             if(self_.goods_items.length==data.result.goodsList.total){
        //                 $(window).unbind('scroll');
        //                 $('#more-hint').html('没有更多数据了');
        //             }
        //             if (!self_.isInit) {
        //                 self_.$nextTick(function() {
        //                     setTimeout(function() {
        //                         focus_swipe('#focus-pic');
        //                         pullup_load().initLoad();
        //                         self_.isInit = true;
        //                     }, 300);
        //                 });
        //             };
        //         },
        //         error: function(xhr, type) {
        //             console.log('Ajax error!');
        //         }
        //     });
        // },
        //获取商品分类菜单数据
        // get_cats: function() {
        //     var self_ = this;
        //     $.ajax({
        //         type: 'GET',
        //         url: 'https://testapi.pinquduo.cn/api_3_0_1/api/index/getexplore&ajax_get=1', //获取数据
        //         dataType: 'jsonp',
        //         jsonp: 'jsoncallback',
        //         async: true,
        //         success: function(data) {
        //             self_.cat_goods_data.cat_items = data.result.cat;
        //             console.log(1);
        //             $('#loading-dialog').hide();
        //         },
        //         error: function(xhr, type) {
        //             console.log('Ajax error!');
        //         }
        //     });
        // },
        //获取顶部导航分页商品列表
        get_cats_goods: function(url, index) {
            var self_ = this;
            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'jsonp',
                jsonp: 'jsoncallback',
                async: true,
                success: function(data) {
                    // console.log(data);
                    var items = data.result.items;
                    self_.cat_goods_data=self_.cat_goods_data.concat(items)
                    if(self_.cat_goods_data.length==data.result.total){
                        $(window).unbind('scroll');
                        $('#more-hint').html('没有更多数据了');
                    }

                    // self_.$set(self_.cat_goods_data.goods_items, index, self_.cat_goods_data.goods_items[index].concat(items));
                    // pullup_load().initLoad();
                },
                error: function(xhr, type) {
                    console.log('Ajax error!');
                }
            });
        },
        //首页焦点图下面功能导航
        //导航功能
        // nav_fn: function(index) {
        //     var self_ = this;
        //     clearTimeout(self_.hint_timer);
        //     //为我点赞
        //     if (index == 0) {
        //         self_.dialog_hint = '该功能为app专属，请下载拼趣多app';
        //         $('#hint-dialog').show();
        //         self_.hint_timer = setTimeout(function() {
        //             $('#hint-dialog').hide();
        //         }, 1000);
        //     };
        //     //趣多严选
        //     if (index == 3) {
        //         // $('#join-group').show();
        //         self_.dialog_hint = '程序员哥哥还在努力开发中...';
        //         $('#hint-dialog').show();
        //         self_.hint_timer = setTimeout(function() {
        //             $('#hint-dialog').hide();
        //         }, 1000);
        //         return false;
        //     };
        //     //为我拼
        //     if (index == 4) {
        //         self_.dialog_hint = '程序员哥哥还在努力开发中...';
        //         $('#hint-dialog').show();
        //         self_.hint_timer = setTimeout(function() {
        //             $('#hint-dialog').hide();
        //         }, 1000);
        //         return false;
        //     };

            //省钱大法
            // if (index == 7) {
            //     self_.dialog_hint = '程序员哥哥还在努力开发中...';
            //     $('#hint-dialog').show();
            //     self_.hint_timer = setTimeout(function() {
            //         $('#hint-dialog').hide();
            //     }, 1000);
            //     return false;
            // };
        },
        //参团（输入参团码）
        // goProm: function() {
        //     var self_ = this;
        //     var promBtn = $('#prom-btn');
        //     var promInput = $('#prom-input');
        //     promBtn.click(function() {
        //         clearTimeout(self_.hint_timer);
        //         var prom_code = promInput.val().replace(/\s/g, "");
        //         if (prom_code == '' || prom_code.length < 6) {
        //             self_.dialog_hint = '请输入正确的参团码';
        //             $('#hint-dialog').show();
        //             self_.hint_timer = setTimeout(function() {
        //                 $('#hint-dialog').hide();
        //             }, 1000);
        //             return;
        //         };
        //         $.ajax({
        //             type: 'GET',
        //             url: 'https://testapi.pinquduo.cn/api_3_0_1/api/user/getPromDetail?invitation_num=' + prom_code + '&user_id=' + cookie.get('user_id') + '&ajax_get=1',
        //             dataType: 'jsonp',
        //             jsonp: 'jsoncallback',
        //             async: true,
        //             success: function(data) {
        //                 // console.log(data);
        //                 var info = data.status == -1 ? '请输入正确的参团码' : '验证成功';
        //                 self_.dialog_hint = info;
        //                 $('#hint-dialog').show();
        //                 hint_timer = setTimeout(function() {
        //                     $('#hint-dialog').hide();
        //                     if (data.msg) {
        //                         location.href = "prom_regiment.html?order_id=" + data.result.is_order.order.order_id + "&user_id=" + cookie.get('user_id');
        //                     };
        //                 }, 1000);
        //             },
        //             error: function(xhr, type) {
        //                 console.log('Ajax error!');
        //             }
        //         });
        //     });
        //
        //     $('#join-group .mask').click(function() {
        //         $('#join-group').hide();
        //     });
        // },
        // //顶部导航tab
        // tab: function(index, id, event) {
        //     var self_ = this;
        //     self_.cat_goods_data=[];
        //     var el = $(event.currentTarget);
        //     self_.index=index;
        //     console.log(self_.index);
        //     // console.log(el);
        //     // $('#more-hint').html('正在加载...');
        //     if (index == self_.cat_index || el.hasClass('active')) {
        //         return;
        //     };
        //     var page = parseInt(el.attr('data-page'));
        //     $(window).scrollTop(0);
        //     // var this_ = $(this);
        //     // var cur = this_.index();
        //     // if (pre == cur) {
        //     //     return;
        //     // };
        //     //首页
        //     if (index == 0) {
        //         self_.pullup_load = pullup_load({
        //             wrap: $('body'),
        //             group: $('#home-goods-group'),
        //             hintBar: $('#more-hint'),
        //             control:self_.control,
        //             callback: function() {
        //                 // console.log(3);
        //                 self_.page += 1;
        //                 self_.get_home_data(self_.page);
        //             }
        //         });
        //         // console.log(1);

        //     } else { //其他分类页
        //         self_.get_cats_goods("https://testapi.pinquduo.cn/api_3_0_1/goods/getMore?version=2.0.0&page=" + page + "&ajax_get=1&id=" + id + "&pagesize="+ self_.pagesize,index-1);
        //         self_.pullup_load = pullup_load({
        //             wrap: $('body'),
        //             group: $('.page-goods-list').eq(index - 1),
        //             hintBar: $('#more-hint'),
        //             control:self_.control,
        //             callback: function() {
        //                 page += 1;
        //                 el.attr('data-page', page);
        //                 self_.get_cats_goods("https://testapi.pinquduo.cn/api_3_0_1/goods/getMore?version=2.0.0&page=" + page + "&ajax_get=1&id=" + id + "&pagesize=" + self_.pagesize,index-1);
        //             }
        //         });
        //     };
        //     self_.cat_index = index;
        // },
        // //提示弹窗
        // hint_show: function(str) {
        //     var self_ = this;
        //     self_.dialog_hint = str;
        //     $('#hint-dialog').show();
        //     clearTimeout(self_.hint_timer)
        //     self_.hint_timer = setTimeout(function() {
        //         $('#hint-dialog').hide();
        //     }, 1000);
        // },
        // img_error: function(url,e){
        //     var img=e.currentTarget;
        //     img.src=url;
        //     img.onerror=null;
        // },
        // // 不知道是什么鬼，20180224--21:11
        // dialogCtr() {

        // }

    // }
});
alert('执行后123aa1')