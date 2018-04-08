import urlSearch from '../assets/urlSearch.js';
//第三方登录
import oauth_login from '../assets/oauth_login.js';
oauth_login("page_name=prom_regiment");
cookie.set('order_id',urlSearch('order_id'));

import $ from 'webpack-zepto';
import Vue from 'vue';

//set viewport&font-size
import set_viewport from '../assets/fontSize.js';
set_viewport();

//set tap-event-dom-style
import set_active from '../assets/active.js';

import pullup_load from '../assets/pullup_load.js';

import cookie from '../assets/cookie.js';

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



var prom_id= urlSearch('prom_id');//cookie.get('order_id')
var user_id=cookie.get('user_id');



//分享链接
var locurl = location.href;
if(locurl.indexOf("?")>-1&&!(locurl.indexOf("&")>-1)){
    var share_url = locurl.replace('?','?_wv=1&');
}else if(!(locurl.indexOf("?")>-1)){
    var share_url = locurl+'?_wv=1';
}else{
    var share_url = locurl+'&_wv=1';
};



function formatDate(now){
    var year=now.getFullYear();
    var month=parseInt(now.getMonth())+1<10?'0'+(parseInt(now.getMonth())+1):parseInt(now.getMonth())+1;
    var date=now.getDate()<10?'0'+now.getDate():now.getDate();
    var hour=now.getHours()<10?'0'+now.getHours():now.getHours();
    var minute=now.getMinutes()<10?'0'+now.getMinutes():now.getMinutes();
    var second=now.getSeconds()<10?'0'+now.getSeconds():now.getSeconds();
    return   year+"-"+month+"-"+date+"   "+hour+":"+minute+":"+second;
}

// var qs = sign.sign({
//     prom_id:prom_id,
//     ajax_get: 1
// });
$.ajax({
    type:'POST',
    url:'https://testapi.pinquduo.cn/api_3_0_1/user/get_Detaile_for_Prom?prom_id=' +prom_id+'&user_id='+user_id+'&ajax_get=1&version=2.0.0',//获取数据
    dataType:'jsonp',
    jsonp: 'jsoncallback',
    async:false,
    success:function(data){
        console.log('一进页面就加在的数据：')
        console.log(data);
        if (data.status != 1) {
            location.href = 'https://www.pinquduo.cn'
        }
        $('#loading-dialog').hide();
        var data_ = data;
        var is_promed =false;//判断是否已经购买了/参团/开团
        // for(var i=0,len=data_.result.isGroup.order.promInfo.join_num.length;i<len;i++){
        //     if(user_id==data_.result.isGroup.order.promInfo.join_num[i].user_id){
        //         is_promed = true;
        //         break;
        //     };
        // };

        // var prom_order = data_.result.isGroup.order;
        // var prom_price = ;

        if(data_.is_successful){
            var title = '我'+data_.result.goods.prom_price+'拼了 '+data_.result.goods.goods_name;
        }else{
            // var title = '快来拼 '+data_.result.goods.prom_price+'元 '+data_.result.goods.goods_name;
            var title = '['+data_.result.prom+'免'+data_.result.free+'商品] '+'你的运气好不好，就看这件商品谁免单！';
        };
        // if(prom_order.promInfo.prom==0){
            // var title = '['+data_.result.prom+'免'+data_.result.free+'商品] '+'你的运气好不好，就看这件商品谁免单！';
        // };

        //微信分享
        $.ajax({
            url: "./wechat/share_index.php",
            type: "get",
            data : {
                'url' : location.href.split('#')[0]
            },
            success: function(data) {
                //console.log(data);
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
                    title: title, // 分享标题
                    desc: data_.result.goods.goods_name, // 分享描述
                    shareUrl: share_url,
                    link: share_url, // 分享链接
                    imgUrl: data_.result.goods.fenxiang_url, // 分享图标
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
            title: title,
            summary: data_.result.goods.goods_name,
            pic: data_.result.goods.fenxiang_url,
            url: share_url
        });
        new Vue({
            el: '#main-body',
            data: function(){
                return {
                    data:[],
                    //猜你喜欢
                    like_goods_data:[],
                    //加载提示
                    load_hint: '上拉加载更多',
                    //是否上拉加载
                    isloadmore: true,
                    //加载分页
                    page: 1,
                    //每页条目
                    pagesize: 6,
                    //弹层信息提示
                    hint_info: '',
                    //弹层延时计时器
                    hint_timer: null,
                    // 团成员
                    prom_num:[],
                    style:'',
                    // 团是否过期
                    timeOut:'',
                    entrance:[],
                    peopleNum:0,//已经参团人数
                }
            },
            // created() {
            //     var self_ = this;
            //     console.log('this是')
            //     console.log(this)
            //     self_.data=data_.result;
            //     console.log('vue渲染模板,并拿到数据：')
            //     console.log(data_.result)
            //     self_.like_goods_data=data_.result.like.items;
            //     console.log(data_.result.like.items)

            //     if (self_.data.join_num) {
            //         self_.data.join_num.forEach(function (e,i) {
            //             self_.data.join_num[i].addtime=self_.getLocalTime(e.addtime)
            //         })
            //     }
            //     if(data.result.prom>7){
            //         self_.style='margin: 0 auto;display: flex;flex-wrap: nowrap;overflow-y: auto;height: 5.6rem;'
            //     }else{
            //         self_.style="display: flex;flex-wrap: nowrap;justify-content: center;align-items: center;"
            //     }
            //     if (data_.result.prom) {
            //         for (var i = 0; i < data_.result.prom; i++) {
            //             // var obj = timer[i];
            //             if(data_.result.join_num[i]){
            //                 self_.prom_num=self_.prom_num.concat(data_.result.join_num[i]);
            //             }else{
            //                 self_.prom_num=self_.prom_num.concat({});
            //             }
            //         }
            //     }

            //     //倒计时

            //     Vue.nextTick(function () {
            //         var timed_cont = $('#timed-count');
            //         console.log(timed_cont);
            //         var timer = null;
            //         (function(){
            //             timer = setInterval(function(){
            //                 var timed_time = parseInt(self_.data.end_time) - parseInt(Date.now()/1000);
            //                 if(timed_time>0){
            //                     self_.timeOut=false;
            //                     var day = Math.floor(timed_time/86400)%30;
            //                     day = day<=0?'' : day+'天'
            //                     var h = Math.floor(timed_time/3600)%24;
            //                     h = h < 10 ? '0' + h : h;
            //                     var m = Math.floor(timed_time/60)%60;
            //                     m = m<10?'0' + m : m;
            //                     var s = Math.floor(timed_time%60);
            //                     s = s < 10 ? '0'+ s : s;
            //                     timed_cont.html('剩余'+"<span class=\"time-num\" style=\"background-color:#1e1e1e;color: #f6f6f6;padding: .2rem;\">"+h+"</span>"+' : '+"<span class=\"time-num\" style=\"background-color:#1e1e1e;color: #f6f6f6;padding: .2rem\">"+m+"</span>"+' : '+"<span class=\"time-num\" style=\"background-color:#1e1e1e;color: #f6f6f6\;padding: .2rem\">"+s+"</span>"+'结束');
            //                 }else{
            //                     self_.timeOut=true;
            //                     clearInterval(timer);
            //                     timed_cont.html('剩余&nbsp'+"<span class=\"time-num\" style=\"background-color:#1e1e1e;color: #f6f6f6;padding: .2rem;\">已</span>"+' : '+"<span class=\"time-num\" style=\"background-color:#1e1e1e;color: #f6f6f6;padding: .2rem\">结</span>"+' : '+"<span class=\"time-num\" style=\"background-color:#1e1e1e;color: #f6f6f6;padding: .2rem\">束</span>"+'&nbsp结束');
            //                     return;
            //                 }
            //             },1000);
            //         })()
            //     })

            //     //猜你喜欢
            //     self_.up_load();
            // },
            mounted: function(){
                var self_ = this;
                console.log('this是')
                console.log(this)
                self_.data=data_.result;
                console.log('vue渲染模板,并拿到数据：')
                console.log(data_.result)
                self_.like_goods_data=data_.result.like.items;
                console.log(data_.result.like.items)
                self_.peopleNum = data_.result.join_num.length

                if (self_.data.join_num) {
                    self_.data.join_num.forEach(function (e,i) {
                        self_.data.join_num[i].addtime=self_.getLocalTime(e.addtime)
                    })
                }
                if(data.result.prom>7){
                    self_.style='margin: 0 auto;display: flex;flex-wrap: nowrap;overflow-y: auto;height: 5.6rem;'
                }else{
                    self_.style="display: flex;flex-wrap: nowrap;justify-content: center;align-items: center;"
                }
                for (var i = 0; i < data_.result.prom; i++) {
                    // var obj = timer[i];
                    if(data_.result.join_num[i]){
                        self_.prom_num=self_.prom_num.concat(data_.result.join_num[i]);
                    }else{
                        self_.prom_num=self_.prom_num.concat({});
                    }
                }

                //倒计时

                Vue.nextTick(function () {
                    var timed_cont = $('#timed-count');
                    console.log(timed_cont);
                    var timer = null;
                    (function(){
                        timer = setInterval(function(){
                            var timed_time = parseInt(self_.data.end_time) - parseInt(Date.now()/1000);
                            if(timed_time>0){
                                self_.timeOut=false;
                                var day = Math.floor(timed_time/86400)%30;
                                day = day<=0?'' : day+'天'
                                var h = Math.floor(timed_time/3600)%24;
                                h = h < 10 ? '0' + h : h;
                                var m = Math.floor(timed_time/60)%60;
                                m = m<10?'0' + m : m;
                                var s = Math.floor(timed_time%60);
                                s = s < 10 ? '0'+ s : s;
                                timed_cont.html('剩余'+"<span class=\"time-num\" style=\"background-color:#1e1e1e;color: #f6f6f6;padding: .2rem;\">"+h+"</span>"+' : '+"<span class=\"time-num\" style=\"background-color:#1e1e1e;color: #f6f6f6;padding: .2rem\">"+m+"</span>"+' : '+"<span class=\"time-num\" style=\"background-color:#1e1e1e;color: #f6f6f6\;padding: .2rem\">"+s+"</span>"+'结束');
                            }else{
                                self_.timeOut=true;
                                clearInterval(timer);
                                timed_cont.html('剩余&nbsp'+"<span class=\"time-num\" style=\"background-color:#1e1e1e;color: #f6f6f6;padding: .2rem;\">已</span>"+' : '+"<span class=\"time-num\" style=\"background-color:#1e1e1e;color: #f6f6f6;padding: .2rem\">结</span>"+' : '+"<span class=\"time-num\" style=\"background-color:#1e1e1e;color: #f6f6f6;padding: .2rem\">束</span>"+'&nbsp结束');
                                return;
                            }
                        },1000);
                    })()
                })

                //猜你喜欢
                self_.up_load();
            },
            methods: {
                // 立即参团
            go_prom: function(text){
                var self_ = this;
                console.log(text);
                self_.hint_info='请点击右上角分享！'
                $('#hint-dialog').show()
                self_.hint_timer = setTimeout(function() {
                    $('#hint-dialog').hide();
                }, 2000);
                if(text=='再开一团'){
                    // 为我点赞
                    if(self_.data.goods.is_special==8){
                        $('#loadMask').show()
                        $('#close').click(function () {
                            $('#loadMask').hide();
                            $('#loadMask').click(function (e) {
                                if (e.target.id == 'cur') {
                                    $('#loadMask').hide();
                                }
                            })
                        })
                    }else {
                        var url ='goods_detail.html?type=0&'+'goods_id='+self_.data.goods.goods_id+'&prom_id='+self_.data.prom_id;
                        // console.log(url);
                        location.href =url;
                    }
                }
                if (text=='我要参团'){
                    var url ='goods_detail.html?type=0&'+'goods_id='+self_.data.goods.goods_id+'&prom_id='+self_.data.prom_id;
                    if(self_.data.goods.is_special==8){
                        var ua = navigator.userAgent.toLowerCase();
                        if(ua.indexOf('qq/')!= -1){
                            self_.hint_info='前往微信，为好友助力！'
                            $('#hint-dialog').show()
                            self_.hint_timer = setTimeout(function() {
                                $('#hint-dialog').hide();
                            }, 1000);
                        }else{
                            location.href =url;
                        }
                    }else{
                        location.href =url;
                    }

                    // console.log(url);

                }
                // if(text=='我要分享'){
                //     // console.log('chenggong');
                //     $('#shareMask').show();
                //     $('#shareMask').on('click',function () {
                //         $('#shareMask').hide();
                //     })
                // }
                if(text=='我要开团'){
                    // 为我点赞
                    if(self_.data.goods.is_special==8){
                        $('#loadMask').show()
                        $('#close').click(function () {
                            $('#loadMask').hide();
                        })
                        $('#loadMask').click(function(e){
                            if (e.target.id == 'cur') {
                                $('#loadMask').hide();
                            }
                        })
                    }else {
                        var url ='goods_detail.html?type=0&'+'goods_id='+self_.data.goods.goods_id+'&prom_id='+self_.data.prom_id;
                        // console.log(url);
                        location.href =url;
                    }
                }
            },
                //上拉加载
                up_load: function(){
                    var self_ = this;
                    pullup_load({
                        wrap: $('body'),
                        group: $('#page-goods-group'),
                        hintBar: $('#more-hint'),
                        callback: function(){
                            self_.page += 1;
                            // $('#loading-dialog').show();
                            var qs = sign.sign({
                                prom_id:prom_id,
                                user_id:user_id,
                                page: self_.page,
                                version:'2.0.0',
                                // pagesize: self_.pagesize,
                                // order_id: order_id,
                                ajax_get: 1
                            });
                            $.ajax({
                                type:'POST',
                                url:'https://testapi.pinquduo.cn/api_3_0_1/user/get_Detaile_for_Prom?' + qs,//获取数据
                                dataType:'jsonp',
                                jsonp: 'jsoncallback',
                                async:true,
                                success:function(data){
                                    console.log('这里是初加载和上拉加载的数据')
                                    console.log(data);
                                    $('#loading-dialog').hide();

                                        // $('#more-hint').html('上拉加载更多');
                                        // var load_items = data.result.isGroup!=null?data.result.isGroup.goods.items:data.result.is_order.like.items;
                                        // console.log(data.result.like.items);
                                        self_.like_goods_data = self_.like_goods_data.concat(data.result.like.items);
                                    // console.log(self_.like_goods_data);
                                    if(self_.like_goods_data.length==data.result.like.total){
                                        $(window).unbind('scroll');
                                        $('#more-hint').html('没有更多数据了');
                                        };
                                },
                                error: function(xhr,type){
                                    console.log('Ajax error!');
                                }
                            });
                        }
                    });
                },
                img_error: function(url,e){
                    var img=e.currentTarget;
                    img.src=url;
                    img.onerror=null;
                },
                // 时间戳转换
                getLocalTime: function (nS) {
                    return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
                },
            }
        });
    }
});






















