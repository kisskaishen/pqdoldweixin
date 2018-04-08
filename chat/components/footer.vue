
<template>
	<footer class="footer">
		<nav class="nav-group clearfix">
			<router-link to="/home/foo" class="item active">
				<div class="box">
					<i class="icon icon-1"></i>
					<p class="fs9 title">首页</p>
				</div>
			</router-link>
			<router-link to="/home/paihangbang" class="item">
				<div class="box">
					<i class="icon icon-2"></i>
					<p class="fs9 title">排行榜</p>
				</div>
			</router-link>
			<a href="#" class="item">
				<i class="icon icon-3"></i>
			</a>
			<a href="#" class="item">
				<div class="box">
					<i class="icon icon-4"></i>
					<p class="fs9 title">探索</p>
				</div>
			</a>
			<a href="#" class="item">
				<div class="box">
					<i class="icon icon-5"></i>
					<p class="fs9 title">个人中心</p>
				</div>
			</a>
		</nav>
	</footer>
</template>

<script>
	import $ from 'webpack-zepto';
	import Vue from 'vue';
	module.exports = {
		data: function(){
			return {
				items: []
			}
		}
	}
</script>
		