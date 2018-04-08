import $ from 'webpack-zepto';
import Vue from 'vue';

import cookie from '../assets/cookie.js';


//set viewport&font-size
import set_viewport from '../assets/fontSize.js';
set_viewport();

//set tap-event-dom-style
import set_active from '../assets/active.js';
set_active();

import urlSearch from '../assets/urlSearch.js';

//引入订单/开团 浮动推送
//import hot_feed from '../assets/hot_feed.js';
//hot_feed();


//获取用户id
var user_id = cookie.get('user_id')||false;

console.log('user_id='+user_id);

var edit_id = urlSearch('edit_id')||undefined;
var address_id = urlSearch('address_id')||undefined;

//是否是支付页面跳转过来的
var is_pay_route = urlSearch('pay_adr_route')||false;








//提示延迟
var hint_timer = null;
//是否保存过
var is_save = false;

var selected_adr = {
	//选中的详细地址
	province: '',
	city: '',
	area: ''
};

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

new Vue({
	el: '#adr-dialog',
	data: function(){
		return {
			//省
			province_data: dsy.Items['0'],
			//市
			city_data: dsy.Items['0_0'],
			//区
			area_data: dsy.Items['0_0_0'],
			//地址选项名
			province_name: '',
			city_name: '',
			area_name: '',
			//地址下标
			province_index: 0,
			
		}
	},
	mounted: function(){
		var self_ = this;
	},
	methods: {
		//地址选择
		province_select: function(name,event){
			var el = $(event.currentTarget);
			var index = el.index();
			if(this.province_name==name){
				return false;
			};
			this.province_name = name;
			this.city_data = dsy.Items['0_'+index];
			this.area_data = dsy.Items['0_'+index+'_'+0];
			this.province_index = index;
			selected_adr.province = el.attr('adr-data');
			selected_adr.city = this.city_data[0];
			selected_adr.area = this.area_data[0];
			this.city_name = selected_adr.city;
			this.area_name = selected_adr.area;
		},
		city_select: function(name,event){
			var el = $(event.currentTarget);
			var index = el.index();
			if(this.city_name==name){
				return false;
			};
			this.city_name = name;
			this.area_data = dsy.Items['0_'+this.province_index+'_'+index];
			selected_adr.city = el.attr('adr-data');
			selected_adr.area = this.area_data[0];
			this.area_name = selected_adr.area;
		},
		area_select: function(name,event){
			var el = $(event.currentTarget);
			var index = el.index();
			if(this.area_name==name){
				return false;
			};
			this.area_name = name;
			selected_adr.area = el.attr('adr-data');
		},
		//隐藏弹窗
		hide_adr_dialog: function(){
			var history_adr = $('#city_input').attr('adr-data');
			var full_adr0 = selected_adr.province+selected_adr.city+selected_adr.area;
			var full_adr = (full_adr0==''&&history_adr!='')?history_adr:full_adr0;
			$('#city_input').html(full_adr==''?'请选择所在地区':full_adr);
			$('#city_input').attr('adr-data',full_adr);
			$('#adr-dialog').hide();

		}
	}
});


new Vue({
	el: '#wrap',
	data: function(){
		return {
			address_data: []
		}
	},
	mounted: function(){
		var self_ = this;
		if(edit_id!=undefined){
			self_.get_Address(edit_id);
		};
	},
	methods: {
		show_adr_dialog: function(){
			$('#adr-dialog').show();
		},
		//获取地址 设置地址状态
		get_Address: function(edit_id){
			var self_ = this;
			$.ajax({
				type:'POST',
				url:'https://testapi.pinquduo.cn/api_3_0_1/goods/getUserAddressList/user_id/5838?version=2.0.0&user_id='+user_id+'&ajax_get=1',//获取数据
				dataType:'jsonp',
				jsonp: 'jsoncallback',
				async:true,
				success:function(data){
					console.log(data);
					self_.address_data = data.result.address[edit_id];
				},
				error: function(xhr,type){
				    console.log('Ajax error!');
				}
			});
		}
	}
});


$('#save-btn').click(function(){
	if(!user_id){
		$('#hint-dialog').html('<p class="fs11">保存失败！</p>');
        $('#hint-dialog').show();
        hint_timer=setTimeout(function(){
        	$('#hint-dialog').hide();
        },1000);
        return false;
	};
	var name = $('#name_input').val().replace(/\s/g,"");
	var mobile = $('#phone_input').val();
	var adr_detail = $('#adr_input').val().replace(/\s/g,"");


	var province = $('#s_province').val();
	var city = $('#s_city').val();
	var county = $('#s_county').val();
	var street = $('#adr_input').val();

	var history_adr = $('#city_input').attr('adr-data');
	var address_base = history_adr!=''?history_adr:'';
	var full_adr = address_base+street;

	if(name==''){ 
		$('#hint-dialog').html('<p class="fs11">收货人输入有误，请重新输入！</p>');
        $('#hint-dialog').show();
        hint_timer=setTimeout(function(){
        	$('#hint-dialog').hide();
        },1000);
        return false; 
    };

	if(!(/^1[34578]\d{9}$/.test(mobile))){ 
		$('#hint-dialog').html('<p class="fs11">手机号码输入有误，请重新输入！</p>');
        $('#hint-dialog').show();
        hint_timer=setTimeout(function(){
        	$('#hint-dialog').hide();
        },1000);
        return false; 
    };
    
    if($('#city_input').attr('adr-data')==''){ 
		$('#hint-dialog').html('<p class="fs11">地址有误，请重新输入！</p>');
        $('#hint-dialog').show();
        hint_timer=setTimeout(function(){
        	$('#hint-dialog').hide();
        },1000);
        return false; 
    };

    if(adr_detail==''){ 
		$('#hint-dialog').html('<p class="fs13">地址有误，请重新输入！</p>');
        $('#hint-dialog').show();
        hint_timer=setTimeout(function(){
        	$('#hint-dialog').hide();
        },1000);
        return false; 
    };

    //设为默认地址
    var is_default = 0;
    if($('#init-set').is(':checked')){
    	is_default = 1;
    };
    if(!is_save){
    	$.ajax({
			type:'POST',
			url:'https://testapi.pinquduo.cn/api_3_0_1/goods/addEidtAddress'+'?version=2.0.0&user_id='+user_id+'&address_id='+address_id+'&consignee='+name+'&default='+is_default+'&address_base='+address_base+'&address='+street+'&mobile='+mobile+'&type='+(is_pay_route?2:urlSearch('type'))+'&ajax_get=1',//获取数据
			dataType:'jsonp',
			jsonp: 'jsoncallback',
			async:true,
			success:function(data){
				console.log(data);
				$('#hint-dialog').show();
				$('#hint-dialog').html('<p class="fs13">保存成功！</p>');
		        hint_timer=setTimeout(function(){
		        	$('#hint-dialog').hide();
		        },1000);
		        is_save = true;
		        //路由跳转
		        if(urlSearch('route')||urlSearch('route')!=undefined){
		        	if(is_pay_route=='topay'){
		        		location.href = urlSearch('route')+'.html?'
		        		+"order_id="+urlSearch('order_id')
						+"&goods_id="+urlSearch('goods_id')
						+"&user_id="+urlSearch('user_id')
						+"&store_id="+urlSearch('store_id')
						+"&num="+urlSearch('num')
						+"&spec_key="+urlSearch('spec_key')
						+"&is_prom="+urlSearch('is_prom')
						+"&type="+urlSearch('type')
						+"&pay_adr_route="+is_pay_route
		        		;
		        	}else{
		        		location.href = urlSearch('route')+'.html';
		        	};
		        	
		        };
			},
			error: function(xhr,type){
			    console.log('Ajax error!');
			}
		});
    }else{
    	$('#hint-dialog').show();
		$('#hint-dialog').html('<p class="fs13">您已经保存了哦！</p>');
        hint_timer=setTimeout(function(){
        	$('#hint-dialog').hide();
        },1000);
    };
    

	
});





















	    