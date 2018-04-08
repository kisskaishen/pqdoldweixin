import Vue from 'vue';
import $ from 'webpack-zepto';
//import Vue from 'vue';

import cookie from '../assets/cookie.js';
import urlSearch from '../assets/urlSearch.js';

//import Swiper from './swiper.min.js';

//set viewport&font-size
import set_viewport from '../assets/fontSize.js';
set_viewport();

//set tap-event-dom-style
import set_active from '../assets/active.js';
set_active();

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

var user_id = cookie.get('user_id') || 0;
var order_id = urlSearch('order_id') || 0;
var isget = urlSearch('isget');
// var goods_name = urlSearch('goods_name') || '';
// var goods_img = urlSearch('goods_img') || '';
// var order_amount = urlSearch('order_amount') || 0;
var totalImages = 0;
var refundImageArr = [null, null, null];

// 自调用函数显示数据

	new Vue ({
		el:'#wrap',
		data:function(){
			return {
				order_id:'',
				goods_name:'',
				goods_img:'',
				order_amount:'',
				isget:'1',
			}
		},
		mounted:function() {

			var self = this;
			self.isget = isget
			self.goods_name = decodeURI(urlSearch('goods_name'))
			self.goods_img = urlSearch('goods_img')
			self.order_amount = urlSearch('order_amount')
			self.order_id = urlSearch('order_id')
		},

	})


// $("#max-refund-desc").html('(最高可退款￥' + parseFloat(order_amount).toFixed(2) + ')');

$(".radio-select>div").click(function(){
	if (!$(this).hasClass("checked")) {
		$(this).siblings().removeClass("checked");
		$(this).addClass("checked");
	}
});

var hint_timer;

function showErrorMsg(errMsg) {
	$('#hint-dialog').html('<p class="fs13">' + errMsg + '</p>');
    $('#hint-dialog').show();
    hint_timer = setTimeout(function(){
    	$('#hint-dialog').hide();
    },1000);
}
function bindImgDel(obj) {
	//var imgDels = $("#upload-images .img-del");
	obj.click(function(){
		var xindex = $(this).attr('data-index');
		$(this).parent().remove();
		refundImageArr[xindex] = null;
		totalImages -= 1;
		console.log("totalImages:", totalImages);
		$("#upload-file-btn").show();
	});
}


$("#refund-images").change(function(){
	$("#upload-images").show();

	totalImages += 1;
	console.log("totalImages:", totalImages);
	if (totalImages == 3) {
		$("#upload-file-btn").hide();
		//showErrorMsg("最多上传3张图片");
		//return false;
	}

	var file=this.files[this.files.length-1];
	var filepath = file.name;


    var thisIndex = 0;
	for(var i=0; i<refundImageArr.length; i++) {
		if (refundImageArr[i] == null) {
			thisIndex = i;
			refundImageArr[i] = file;
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

    let obj = {};
    // let picture = {}
	let arrName = []
	let arrType = []
    arrName.push(file.name)
    arrType.push(file.type)

    obj.name = arrName
    obj.tmp_name = arrName
    obj.type = arrType

    $.ajax({
        type:'POST',
        url:'https://z.pinquduo.cn/api_3_0_1/index/uploadimage',
        dataType:'json',
        data: {
            file:obj
        },
        async:false,
        success:function(data){
            console.log(data);
        },
        error: function(xhr,type){
            console.log('Ajax error!');
        }
    });


});
$('#refund-type').change(function(e) {
	if (e.target.value == 2) {
		$('.tuikuanMoney').hide()
		$("#refund-amount").val() == '0'
	} else {
		$('.tuikuanMoney').show()
		$("#refund-amount").val() == ''
	}
});

function checkRefundForm() {
	$('#loading-dialog').hide();
	// var refundType = $(".radio-select>.checked>.title").html();
	var refundAmount = $("#refund-amount").val();
    if (refundAmount == "" || !/^([1-9]\d*|0)(\.\d{1,2})?$/.test(refundAmount)) {
		showErrorMsg('退款金额必须为有效数字!');
		return false;
	} else {
		var maxRefund =  $("#refund-amount").attr('data-maxMoney');
		//maxRefund = parseFloat(maxRefund);
		var xrefundAmount = parseFloat(refundAmount);
		if (xrefundAmount > maxRefund) {
			showErrorMsg('退款金额不能超过' + maxRefund + '元');
			return false;
		}
	}

	var refundType = $("#refund-type").val();

	var refundReason = $("#refund-reason").val();
	if (refundReason == "请选择退款原因") {
		showErrorMsg('请选择退款原因!');
		return false;
	}

	var refundDesc = $("#refund-desc").val();
	if (refundDesc.replace(/^\s+/g, "").replace(/\s+$/g, "") == "") {
		showErrorMsg('问题描述不能为空!');
		return false;
	}

	//var refundImages = $("input[name='refund-images']").files;
	if (totalImages <=0 || refundImageArr.length == 0) {
		showErrorMsg('请上传退款凭证!');
		return false;
	}

	// var refundContact = $("#refund-contact").val();
	// if(!(/^1[34578]\d{9}$/.test(refundContact))) {
	// 	showErrorMsg('请填写有效的联系人手机号!');
	// 	return false;
	// }

	return {
		gold: refundAmount,
		reason: refundReason,
		problem: refundDesc,
		// mobile: refundContact,
		desc:refundDesc,
		picture: refundImageArr,
		type: refundType
	};
};

function uploadFinish() {
	$('#loading-dialog').hide();
	showErrorMsg('申请提交成功!请耐心等待商家处理');
	setTimeout(function(){
		location.href = 'https://wx.pinquduo.cn/goods_order.html?id=6'
	}, 1000);
}

function uploadFailed() {
	$('#loading-dialog').hide();
	showErrorMsg('上传失败,请重试');
}

$("#submit-refund").click(function(){
    console.log('11111');
    var refundData = checkRefundForm();
	
	console.log("refundData:", refundData);

	if (refundData == false) {
		return false;
	}

	var formData = new FormData();
	for(var k in refundData) {
		formData.append(k, refundData[k]);
	}

	var refundImageIndex = 0;
	for(var i=0; i<refundImageArr.length; i++) {
		if (refundImageArr[i] != null) {
			formData.append("picture[" + refundImageIndex + "]", refundImageArr[i]);
			refundImageIndex++;
		}
	}



	console.log(formData);

	formData.append('user_id', user_id);
	formData.append('order_id', order_id);
	formData.append('service_type', refundData.type);
	formData.append('reason', refundData.reason);
	formData.append('return_money', refundData.gold);
	formData.append('description', refundData.desc);
	formData.append('proof_imgs', refundData.picture);

	var xhr = new XMLHttpRequest();
	$('#loading-dialog').show();
	xhr.open("post", "https://z.pinquduo.cn/api_3_0_1/user/order_service", true);
	xhr.addEventListener("load", uploadFinish, false);
	xhr.addEventListener("error", uploadFailed, false);

	xhr.send(formData);

});


