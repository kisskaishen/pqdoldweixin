/**
 * Created by xubanxian on 2017/6/8.
 */
import $ from 'webpack-zepto';
import Vue from 'vue';

import cookie from '../assets/cookie.js';

// 第三方登陆
// import swiper from './swiper.min.js';
//set viewport&font-size
import set_viewport from '../assets/fontSize.js';
set_viewport();
import focus_swipe from '../assets/focus_swipe.js';
import nav_scroll from '../assets/nav_scroll.js';
//set tap-event-dom-style
// import set_active from '../assets/active.js';
// set_active();

// import pullup_load from '../assets/pullup_load.js';

import sign from '../assets/sign.js';

//引入loading 动画
// import loading from '../components/loading_ani.vue';
// var loading_dialog = new Vue({
//         el:'#loading-template',
//         render: h=>h(loading)
// });
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
            imgUrl: 'https://pinquduo.cn/Template/pc/pinquduo/Static/images/pqdlogo.jpg', // 分享图标
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
    pic: 'https://pinquduo.cn/Template/pc/pinquduo/Static/images/pqdlogo.jpg',
    url: share_url
});


var hint_timer = null;
// new Vue({
//     el: '#wrap',
//     data: function(){
//         return {
//             // 广告
//             banner_img:'',
//             //商品列表
//             goodsList: [],
//             //加载提示
//             load_hint: '',
//             //是否上拉加载
//             isloadmore: true,
//             //加载分页
//             page: 1,
//             //每页条目
//             pagesize: 20,
//             // 热销商品
//             hot_goods:[],
//             // 滚动消息数据
//             scroll_data:[],
//
//         }
//     },
//     mounted: function(){
//         var self_ = this;
//         console.log(1111);
//         var qs = sign.sign({
//             page: self_.page,
//             pagesize: self_.pagesize,
//             ajax_get: 1,
//             version:'2.0.2',
//         });
//         $.ajax({
//             type:'POST',
//             url:'http://api.hn.pinquduo.cn/api_3_0_1/index/getThe_raise?ajax_get=1&version=2.0.2',//获取数据
//             dataType:'jsonp',
//             jsonp: 'jsoncallback',
//             async:false,
//             success:function(data){
//                 console.log(data);
//                 $('#loading-dialog').hide()
//                 self_.banner_img=data.result.banner.ad_code;
//                 self_.goodsList = data.result.raisegoods;
//                 // console.log(data.result.goodsList.items.length);
//                 // if(data.result.raisegoods.items.length == 0){
//                 //     $('#more-hint').html('没有更多数据了');
//                 // }else if(data.result.raisegoods.items.length<self_.pagesize){
//                 //     $('#more-hint').html('没有更多数据了');
//                 //     self_.isloadmore = false;
//                 // }else{
//                 //     // $('#more-hint').html('上拉加载更多');
//                 //     //执行上拉加载
//                 //     self_.up_load();
//                 // };
//
//                 hint_timer=setTimeout(function(){
//                     $('#hint-dialog').hide();
//                 },1000);
//             },
//             error: function(xhr,type){
//                 console.log('Ajax error!');
//             }
//         });
//         $.ajax({
//             type:'POST',
//             url:'http://api.hn.pinquduo.cn/api_3_0_1/index/hot_goods?'+qs,//获取数据
//             dataType:'jsonp',
//             jsonp: 'jsoncallback',
//             async:false,
//             success:function(data){
//                 console.log(data);
//                 $('#loading-dialog').hide();
//                 self_.hot_goods = data.result.items;
//                 // console.log(data.result.goodsList.items.length);
//                 if(data.result.items.length == 0){
//                     $('#more-hint').html('没有更多数据了');
//                 }else if(data.result.items.length<self_.pagesize){
//                     $('#more-hint').html('没有更多数据了');
//                     self_.isloadmore = false;
//                 }else{
//                     // $('#more-hint').html('上拉加载更多');
//                     //执行上拉加载
//                     self_.up_load();
//                 };
//
//                 hint_timer=setTimeout(function(){
//                     $('#hint-dialog').hide();
//                 },1000);
//             },
//             error: function(xhr,type){
//                 console.log('Ajax error!');
//             }
//         });
//         // 获取滚动数据
//         $.ajax({
//             type:'GET',
//             url:'http://api.hn.pinquduo.cn/api_3_0_1/index/rolling?ajax_get=1&version=2.0.2',//获取数据
//             dataType:'jsonp',
//             jsonp: 'jsoncallback',
//             async:true,
//             success:function(data){
//                 console.log(data);
//                 self_.scroll_data=data.result;
//                 self_.$nextTick(function() {
//
//                     var mySwiper = new Swiper('.swiper-container', {
//                         autoplay: 2000,//可选选项，自动滑动
//                         direction: 'vertical',
//                         loop: true,
//                     })
//                 });
//                 // $('#loading-dialog').hide();
//                 // if(self_.isloadmore){
//                 //     $('#more-hint').html('上拉加载更多');
//                 //     if(data.result.items.length<self_.pagesize){
//                 //         console.log('没有更多数据了')
//                 //         $('#more-hint').html('没有更多数据了');
//                 //         self_.isloadmore = false;
//                 //     };
//                 //     self_.hot_goods = self_.hot_goods.concat(data.result.items);
//                 // };
//             },
//             error: function(xhr,type){
//                 console.log('Ajax error!');
//             }
//         });
//         // var swiper = new Swiper('#scroll', {
//         //     direction: 'vertical',
//         //     slidesPerView: 'auto',
//         //     paginationClickable: true,
//         //     spaceBetween:0,
//         //     observer:true,//修改swiper自己或子元素时，自动初始化swiper
//         //     observeParents:true,//修改swiper的父元素时，自动初始化swiper
//         //     freeMode: true
//         // });
//
//
//
//
//
//     },
//     methods: {
//         //上拉加载
//         up_load: function(){
//             var self_ = this;
//             pullup_load({
//                 wrap: $('body'),
//                 group: $('#page-good-group'),
//                 hintBar: $('#more-hint'),
//                 callback: function(){
//                     // $('#loading-dialog').show();
//                     if(!self_.isloadmore){
//                         console.log('stop loadinging');
//                         $('#more-hint').html('没有更多数据了');
//                         return;
//                     };
//                     self_.page += 1;
//                     var qs = sign.sign({
//                         page: self_.page,
//                         pagesize: self_.pagesize,
//                         ajax_get: 1,
//                         version:'2.0.1',
//                     });
//                     $.ajax({
//                         type:'POST',
//                         url:'http://api.hn.pinquduo.cn/api_3_0_1/index/hot_goods?' + qs,//获取数据
//                         dataType:'jsonp',
//                         jsonp: 'jsoncallback',
//                         async:true,
//                         success:function(data){
//                             // console.log(data);
//                             $('#loading-dialog').hide();
//                             if(self_.isloadmore){
//                                 $('#more-hint').html('上拉加载更多');
//                                 if(data.result.items.length<self_.pagesize){
//                                     console.log('没有更多数据了')
//                                     $('#more-hint').html('没有更多数据了');
//                                     self_.isloadmore = false;
//                                 };
//                                 self_.hot_goods = self_.hot_goods.concat(data.result.items);
//                             };
//                         },
//                         error: function(xhr,type){
//                             console.log('Ajax error!');
//                         }
//                     });
//
//                 }
//             });
//         }
//     }
// });

