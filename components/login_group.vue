<template>
	<div class="login-group form-group" id="login-group">
		<div class="item clearfix">
			<span class="title">
				<i class="icon mb"></i>
			</span>
			<div class="input-box">
				<input type="text" placeholder="请输入手机号" id="mobile-input">
			</div>
		</div>
		<div class="item clearfix">
			<span class="title">
				<i class="icon yzm"></i>
			</span>
			<div class="input-box yzm">
				<div class="input">
					<input type="text" placeholder="验证码" id="yzm-input">
				</div>
				<span class="yzm-btn fs12" id="yzm-btn">获取验证码</span>
			</div>
		</div>
		<div class="treaty-item">
			<div class="clearfix">
				<i class="select-box checked"></i>
				我已阅读并同意<a href="#" class="red1">《拼趣多用户协议》</a>
			</div>
		</div>
		<div class="btn-item">
			<span class="btn tap fs15 disabled" id="login-btn">立即登录</span>
		</div>
		<!-- <div class="other-hall tc mt15">
			<p class="fs13 gray3">其他方式登录</p>
			<div class="mt10">
				<a href="/login/auth/qq" class="tap icon qq"></a>
				<a href="/login/auth/qq" class="tap icon wx"></a>
				<a href="/login/auth/qq" class="tap icon wb"></a>
			</div>
		</div> -->
	</div>
</template>

<script>

	import $ from 'webpack-zepto';
	import Vue from 'vue';
	import cookie from '../assets/cookie.js';
	import urlSearch from '../assets/urlSearch.js';
	import userCenter_group from './userCenter_group.vue';
	
	
	
	

	module.exports = {
		data: function(){
			return {
				
			}	
		},
		mounted: function() {
			var self_ = this;
			self_.hasLogin = false;
			//获取订单导航状态
			self_.get_order_status();
			//判断微信用户登录
			function isWeiXin(){ 
				var ua = window.navigator.userAgent.toLowerCase(); 
				if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
					return true; 
				}else{ 
					return false; 
				} 
			};
			if(isWeiXin()){
				$('#exit-login-btn').hide();
				if(cookie.get('openid')){
					//获取登录信息
					$.ajax({
						type:'POST',
						url:'https://139.196.255.40/api/user/thirdLogin?ajax_get=1'+'&nickname='+cookie.get('user_name')+'&head_pic='+cookie.get('head_pic')+'&oauth=weixin'+'&openid='+cookie.get('openid'),
						dataType:'jsonp',
						jsonp: 'jsoncallback',
						async:true,
						success:function(data){
							console.log(data);
							self_.hasLogin = true;
			    			userCenter_group.methods.update_data({
								head_pic: cookie.get('head_pic'),
								mobile: '',
								user_name: cookie.get('user_name')
							});

							//获取订单导航状态
							self_.get_order_status();
						},
						error: function(xhr,type){
						    console.log('Ajax error!');
						}
					});
				};
			}else{
			    $('#exit-login-btn').show();

			    
				if(cookie.get('user_name')){
					$('#login-group').hide();
					$('#user-center').show();
				};
				var goGetYzm = true;
				var getTimer = null;

				console.log('user_id='+cookie.get('user_id'));

				

				
				$('#yzm-btn').click(function(){
					if(goGetYzm){
						goGetYzm = false;
						var time = 1;
						var btn = $(this);
						var mobile = $('#mobile-input').val();
						if(!(/^1[34578]\d{9}$/.test(mobile))){ 
					        alert("手机号码有误，请重填");  
					        goGetYzm = true;
					        return false; 
					    };
						self_.get_yzm(mobile);
						$(this).addClass('disabled');
						getTimer = setInterval(function(){
							time +=1;
							var timed = 60-time;
							btn.html(timed+"秒后重发");
							if(time == 60){
								clearInterval(getTimer);
								btn.removeClass('disabled');
								btn.html("重新验证");
								goGetYzm = true;
							};
						},1000);
					};

				});

				
				$('#login-hall').click(function(){
					if(!self_.hasLogin&&!cookie.get('user_name')){
						$('#login-group').show();
						$('#user-center').hide();
						return false;
					};
				});

				//支付|收藏 未登陆 状态
				if(urlSearch('islogin')=='false'){
					$('#login-group').show();
					$('#user-center').hide();
				};



				//是否已登录 导航是否跳转登录状态
				$('.login-hall-item').each(function(){
					$(this).click(function(){
						if(!cookie.get('user_name')||cookie.get('user_name')==undefined){
							$('#login-group').show();
							$('#user-center').hide();
							return false;
						};
					});
				});


				//退出登录
				$('#exit-login-btn').bind('click',function(){
					$('#login-group').show();
					$('#user-center').hide();
					userCenter_group.methods.update_data({
						head_pic: 'images/ts_p1.jpg',
						mobile: '',
						user_name: '请登录/注册'
					});
					//清除cookie
					cookie.clear('user_name');
					cookie.clear('head_pic');
					cookie.clear('user_id');
				});
			}

			$('#loading-dialog').hide();
		},
		methods: {
			go_login: function(url,mobile,yzm) {
				var self_ = this;
				$.ajax({
					type:'POST',
					url:url+'&mobile='+mobile+'&code='+yzm,//获取数据
					dataType:'jsonp',
					jsonp: 'jsoncallback',
					async:true,
					success:function(data){
						console.log(data);
						self_.hasLogin = true;
						if(data.status!==1){
							alert('验证码有误，请重新输入!');
							return;
						};
						userCenter_group.methods.update_data(data.result);
						$('#login-group').hide();
						$('#user-center').show();

						userCenter_group.methods.update_data({
							head_pic: data.result.head_pic,
							mobile: '',
							user_name: data.result.name
						});

						//设置cookie
						cookie.set('user_name',data.result.name,15);
						cookie.set('head_pic',data.result.head_pic,15);
						cookie.set('user_id',data.result.user_id,15);

						//获取订单导航状态
						self_.get_order_status();

					},
					error: function(xhr,type){
					    console.log('Ajax error!');
					}
				});	
			},
			get_yzm: function(mobile){
				var self_ = this;
				$.ajax({
					type:'POST',
					url:'http://139.196.255.40/api/user/getCode?ajax_get=1&mobile='+mobile,//获取数据
					dataType:'jsonp',
					jsonp: 'jsoncallback',
					async:true,
					success:function(data){
						//console.log(data);
						$('#login-btn').removeClass('disabled');
						$('#login-btn').bind('click',function(){
							var yzm = $('#yzm-input').val();
							if(!/^\d{4}$/.test(yzm)){
								alert('验证码有误，请重新输入');
								return;
							};
							//console.log(mobile+" "+yzm);
							self_.go_login('http://139.196.255.40/api/user/confirm?ajax_get=1',mobile,yzm);
						});	
					},
					error: function(xhr,type){
					    console.log('Ajax error!');
					}
				});
			},
			get_order_status: function(){
				if(cookie.get('user_id')){
					console.log('user_id='+cookie.get('user_id'));
					$.ajax({
						type:'POST',
						url:'http://139.196.255.40/api/user/getRefresh?ajax_get=1&user_id='+cookie.get('user_id'),
						dataType:'jsonp',
						jsonp: 'jsoncallback',
						async:true,
						success:function(data){
							// console.log(data);
							// console.log(userCenter_group);
							userCenter_group.methods.update_status(data.result.userdetails);
						},
						error: function(xhr,type){
						    console.log('Ajax error!');
						}
					});
				};
			}
		}
	}
		
</script>
