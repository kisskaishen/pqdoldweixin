import $ from 'webpack-zepto';

import cookie from '../assets/cookie.js';




//浮动订单推送
module.exports = function(){
	var doc = document;
	var feed_wrap = doc.createElement('div');
	var item = doc.createElement('a');
	var pic = doc.createElement('img');
	var intro = doc.createElement('div');
	feed_wrap.className = "hot-feed";
	item.className = "item tl";
	pic.className = "pic";
	intro.className = "intro fs9";

	$(feed_wrap).hide();

	$('body').append($(feed_wrap).append($(item).append($(pic)).append($(intro))));

	//获取user_id
	var user_id = cookie.get('user_id')||295;

	var hide_timer = null;
	var count_timer = null;
	var start_count = 0;

	function refresh_data(){
		
		$.ajax({
			type:'POST',
			url:'https://testapi.pinquduo.cn/api_3_0_1/user/TuiSong'+'?user_id='+user_id+'&ajax_get=1&version=2.0.0',//获取数据
			dataType:'jsonp',
			jsonp: 'jsoncallback',
			async:false,
			success:function(data){
				//console.log(data);
				var data_items = data.result;
				var len = data_items.length;
				clearInterval(count_timer);
				count_timer = setInterval(function(){
					start_count += 1;
					if(start_count>=len){
						start_count = 0;
					};
					var data_item = data_items[start_count];
					$(item).attr('href','prom_regiment.html?prom_id='+data_item.prom_id);
					$(pic).attr('src',data_item.userInfo.head_pic);
					$(pic).bind('error',function(){
						$(this).attr('src','images/ts_p1.jpg');
						$(this).unbind('error');
					});
					$(intro).html('最新订单来自'+data_item.userInfo.name+'，一秒前');
					$(feed_wrap).show();
					clearTimeout(hide_timer);
					hide_timer = setTimeout(function(){
						$(feed_wrap).hide();
					},2500);
				},5000);
			},
			error: function(xhr,type){
			    console.log('Ajax error!');
			}
		});
	};

	refresh_data();

	setInterval(refresh_data,60*1000);
	
};


















	    