<template>
	<div class="user-center" id="user-center">
		<div class="user-header">
			<div class="userId-box">
				<a style="color:#fff;" id="login-hall">
					<dl class="fs12 tc">
						<dt>
							<div class="pic">
								<img v-bind:src="user_data.head_pic" alt="">
							</div>
						</dt>
						<dd>
							<div>
								{{user_data.user_name}}
							</div>
						</dd>
					</dl>
				</a>
			</div>
			<div class="nav-group tc clearfix fs10">
				<a href="customer/msg_group.html" class="item login-hall-item">
					<span class="item-box">
						<i class="icon"></i>
						<p class="title">我的消息</p>
					</span>
				</a>
				<a href="coupon_group.html" class="item login-hall-item">
					<span class="item-box">
						<i class="icon"></i>
						<p class="title">我的优惠券</p>
					</span>
				</a>
				<a href="my_freeprom.html" class="item login-hall-item">
					<span class="item-box">
						<i class="icon"></i>
						<p class="title">我的免单</p>
					</span>
				</a>
				<a href="my_prom.html" class="item login-hall-item">
					<span class="item-box">
						<i class="icon"></i>
						<p class="title">我的拼团</p>
					</span>
				</a>
			</div>
		</div>
		<div class="order-hall" id="order-hall">
			<a href="goods_order.html" class="heading clearfix black3">
				<span class="fl fs12">全部订单</span>
				<span class="fr gray3 more">&nbsp;&nbsp;&nbsp;</span>
			</a>
			<div class="nav-group tc clearfix fs10">
				<a href="goods_order.html?id=1" class="item login-hall-item">
					<span class="item-box">
						<i class="icon"></i>
						<p class="title">拼团中</p>
						<span class="mark fs10" :class="{show:parseInt(order_status.in_prom)}">{{order_status.in_prom}}</span>
					</span>
				</a>
				<a href="goods_order.html?id=2" class="item login-hall-item">
					<span class="item-box">
						<i class="icon"></i>
						<p class="title">待发货</p>
						<span class="mark fs10" :class="{show:parseInt(order_status.daifahuo)}">{{order_status.daifahuo}}</span>
					</span>
				</a>
				<a href="goods_order.html?id=3" class="item login-hall-item">
					<span class="item-box">
						<i class="icon"></i>
						<p class="title">待收货</p>
						<span class="mark fs10" :class="{show:parseInt(order_status.daishouhuo)}">{{order_status.daishouhuo}}</span>
					</span>
				</a>
				<a href="goods_order.html?id=4" class="item login-hall-item">
					<span class="item-box">
						<i class="icon"></i>
						<p class="title">待付款</p>
						<span class="mark fs10" :class="{show:parseInt(order_status.daifukuan)}">{{order_status.daifukuan}}</span>
					</span>
				</a>
				<a href="after_sales.html" class="item login-hall-item">
					<span class="item-box">
						<i class="icon"></i>
						<p class="title">退款/售后</p>
					</span>
				</a>
			</div>
		</div>
		<a href="http://a.app.qq.com/o/simple.jsp?pkgname=com.jumper.spellgroup" class="app-ad mt5">
			<img :src="app_banner">
		</a>
		<div class="hall-group fs12 mt5">
			<a href="goods_collection.html" class="item login-hall-item tap">
				<div class="item-box">
					<i class="icon fl"></i>
					<span class="title">我的收藏</span>
				</div>
			</a>
			<a href="adr_add.html" class="item login-hall-item tap">
				<div class="item-box">
					<i class="icon fl"></i>
					<span class="title">收货地址</span>
				</div>
			</a>
			<a href="help.html" class="item tap">
				<div class="item-box">
					<i class="icon fl"></i>
					<span class="title">常见问题</span>
				</div>
			</a>
		</div>
		<p class="tc gray1 mt30" id="exit-login-btn">
			<span class="fs10">退出登录</span>
		</p>
	</div>
</template>		


<script>
	import $ from 'webpack-zepto';
	import Vue from 'vue';
	import cookie from '../assets/cookie.js';

	


	var userCenter_vm = null;
	module.exports = {
		data: function(){
			return {
				user_data: {
					head_pic: cookie.get('head_pic')||'images/ts_p1.jpg',
					mobile: cookie.get('mobile')||'12345678901',
					user_name: cookie.get('user_name')||'请登录/注册'
				},
				app_banner: 'images/user_app_banner.jpg',
				//订单导航数字状态数据
				order_status: {}
			}
		},
		mounted: function(){
			userCenter_vm = this;
		},
		methods: {
			update_data: function(data){
				console.log('更新用户信息成功！');
				userCenter_vm.user_data = data;
			},
			update_status: function(data){
				console.log('更新订单导航状态信息成功！');
				userCenter_vm.order_status = data;
			}
		}
	}
</script>