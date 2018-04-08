/**
 * Created by xubanxian on 2017/6/8.
 */
import $ from 'webpack-zepto';
import Vue from 'vue';

import cookie from '../assets/cookie.js';

import swiper from './swiper.min.js';
//set viewport&font-size
import set_viewport from '../assets/fontSize.js';
set_viewport();
import oauth_login from '../assets/oauth_login.js';
oauth_login("page_name=refund_difference");//set tap-event-dom-style
import set_active from '../assets/active.js';
set_active();

import {postFormData} from '../config/http'
import pullup_load from '../assets/pullup_load.js';

import sign from '../assets/sign.js';
var user_id = cookie.get("user_id");
console.log(user_id);
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
            desc: '拼趣多买贵赔三倍差价入口，你也可以来赚钱', // 分享描述
            shareUrl: share_url,
            link: share_url, // 分享链接
            imgUrl: 'https://pinquduo.cn/Template/pc/pinquduo/Static/images/pqdlogo.jpg', // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                //alert('分享成功！');
                location.href='https://wx.pinquduo.cn'
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
            // wx.onMenuShareQQ(share_config);
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
new Vue({
    el: '#wrap',
    data: function(){
        return {
            refundImageArr:[null,null,null,null,null],
            totalImages:0,
        }
    },
    mounted: function(){
        var self_=this
        // 错误信息提示
        function showErrorMsg(errMsg) {
            $('#hint-dialog').html('<p class="fs13">' + errMsg + '</p>');
            $('#hint-dialog').show();
            hint_timer = setTimeout(function(){
                $('#hint-dialog').hide();
            },1000);
        }
        //图片上传
        function bindImgDel(obj) {
            //var imgDels = $("#upload-images .img-del");
            obj.click(function(){
                var xindex = $(this).attr('data-index');
                $(this).parent().remove();
                self_.refundImageArr[xindex] = null;
                self_.totalImages -= 1;
                // console.log("totalImages:", totalImages);
                $("#upload-file-btn").show();
            });
        }
        $("#refund-images").change(function(){
            $("#upload-images").show();

            self_.totalImages += 1;
            console.log("totalImages:", self_.totalImages);
            if (self_.totalImages == 5) {
                $("#upload-file-btn").hide();
            }

            var file=this.files[this.files.length-1];
            var filepath = file.name;
            var thisIndex = 0;
            for(var i=0; i<self_.refundImageArr.length; i++) {

                if (self_.refundImageArr[i] == null) {
                    thisIndex = i;
                    self_.refundImageArr[i] = file;
                    break;
                }
            }

            var reader=new FileReader();
            reader.onload=function(e){
                // 通过 reader.result 来访问生成的 DataURL
                var dataUrl=reader.result;
                // begin
                var img = document.createElement("img");
                img.setAttribute("src", dataUrl);
                img.setAttribute("class", "file");
                //img.setAttribute("style", "border:dashed 1px #000;margin-right:10px");
                var li = document.createElement("div");
                $(li).addClass('pic');
                var ix = document.createElement("i");
                ix.setAttribute('class', "img-del");
                ix.setAttribute("data-index", thisIndex);

                li.appendChild(img);
                li.appendChild(ix);

                document.getElementById("upload-images").appendChild(li);

                bindImgDel($(ix));
            };
            reader.readAsDataURL(file);
        });
        function uploadFailed() {
            $('#loading-dialog').hide();
            showErrorMsg('上传失败,请重试');
        }
        $("#submit-refund").click(function(){
            if ( self_.checkRefundForm()== false) {
                return false;
            }
            var refundImageIndex = 0;
            var formData ={};
            for(var i=0; i<self_.refundImageArr.length; i++) {
                if (self_.refundImageArr[i] != null) {
                    // pictures=pictures.concat(self_.refundImageArr[i])

                    formData["picture[" + refundImageIndex + "]"]=self_.refundImageArr[i]
                    refundImageIndex++;
                }
            }
            // var formData = new FormData();
            // // var pictures='';
            // for(var i=0; i<self_.refundImageArr.length; i++) {
            //     if (self_.refundImageArr[i] != null) {
            //         // pictures=pictures.concat(self_.refundImageArr[i])
            //
            //         formData.append("picture[" + refundImageIndex + "]", self_.refundImageArr[i])
            //         refundImageIndex++;
            //     }
            // }
            // console.log(pictures);
            var order_sn=$("#order_sn").val();
            var goods_price=$("#goods_price").val();
            var bought_date=$("#my_data").val();
            var other_name=$("#other_name").val();
            var other_price=$("#other_price").val();
            var other_date=$("#other_date").val();
            var qq=$("#qq").val();
            var mobile=$("#mobile").val();
            var create_time=parseInt(new Date()/1000);
            var alipay=$("#alipay").val();

            // formData.append('picture',pictures)
            formData=Object.assign(formData,{
                order_sn:order_sn,
                goods_price:goods_price,
                bought_date:bought_date,
                other_name:other_name,
                other_price:other_price,
                other_date:other_date,
                qq:qq,
                mobile:mobile,
                create_time:create_time,
                alipay:alipay,
                user_id:user_id
            })
            // formData.append('order_sn',order_sn)
            // formData.append('goods_price',goods_price)
            // formData.append('bought_date',bought_date)
            // formData.append('other_name',other_name)
            // formData.append('other_price',other_price)
            // formData.append('other_date',other_date)
            // formData.append('qq',qq)
            // formData.append('mobile',mobile)
            // formData.append('create_time',create_time)
            // formData.append('alipay',alipay)
            // formData.append('user_id',user_id)
            // formData.append('version','2.0.1')
            // formData.append('ajax_get',1)
            postFormData('/compensate/apply',formData).then(function(data){
                self_.success()
            }).catch(function(data){
                console.log('请求失败')
                self_.showErrorMsg(data.msg)
            })
            /*var xhr = new XMLHttpRequest();
             // $('#loading-dialog').show();
             xhr.open("post", "http://api.hn.pinquduo.cn/api_3_0_1/compensate/apply", true);
             xhr.onreadystatechange = function () {
             if (xhr.readyState==4)
             {// 4 = "loaded"
             if (xhr.status==200)
             {// 200 = OK
             var data = JSON.parse(xhr.responseText);
             if(data.code==200){
             self_.success()
             }else{
             self_.showErrorMsg(data.msg)
             }
             }
             else
             {

             }
             }
             };
             // xhr.addEventListener("load",self_.success(), false);
             // xhr.addEventListener("error", false);
             xhr.send(formData);*/
        });
    },
    methods: {
        // 提交成功
        success:function () {
            $('.success').css('display','flex')
        },
        // 分享
        share:function () {
            $(".success").css('display','none')
            $('#shareMask').css('display','block')
        },
        // 返回首页
        index:function () {
            location.href='https://wx.pinquduo.cn'
        },
        //表单验证
        checkRefundForm:function () {
            var self_ = this;
            // 订单编号
            if (!/^\d{18}$/.test($("#order_sn").val())) {
                self_.showErrorMsg('订单编号必须为有效数字!');
                return false;
            }
            // 我方平台商品价格
            if ($("#goods_price").val() == "" || !/^([1-9]\d*|0)(\.\d{1,2})?$/.test($("#goods_price").val())) {
                self_.showErrorMsg('我方平台商品价格必须为有效数字!');
                return false;
            }
            //我方平台购买日期
            if ($("#my_data").val() == "") {
                self_.showErrorMsg('请选择我方平台购买日期！');
                return false;
            }
            // 其他平台商品价格
            if ($("#other_price").val() == "" || !/^([1-9]\d*|0)(\.\d{1,2})?$/.test($("#other_price").val())) {
                self_.showErrorMsg('其他平台商品价格必须为有效数字!');
                return false;
            }
            //其他平台购买日期
            if ($("#my_data").val() == "") {
                self_.showErrorMsg('请选择其他平台购买日期！');
                return false;
            }
            // 证明图片
            if(self_.totalImages ==0){
                self_.showErrorMsg('请上传证明图片');
                return false;
            }
            // 手机号码
            if(!(/^1[34578]\d{9}$/.test( $("#mobile").val()))) {
                self_.showErrorMsg('请填写有效的联系人手机号!');
                return false;
            }
            // qq号
            if(!/^[1-9][0-9]{4,9}$/.test( $("#qq").val())) {
                self_.showErrorMsg('请填写正确qq号!');
                return false;
            }
            // 支付宝
            if ($("#alipay").val().replace(/^\s+/g, "").replace(/\s+$/g, "") == "") {
                self_.showErrorMsg('请填写支付宝账户');
                return false;
            }
        },
        showErrorMsg:function showErrorMsg(errMsg) {
            $('#hint-dialog').html('<p class="fs13">' + errMsg + '</p>');
            $('#hint-dialog').show();
            hint_timer = setTimeout(function(){
                $('#hint-dialog').hide();
            },1000);
        }
    }
});
