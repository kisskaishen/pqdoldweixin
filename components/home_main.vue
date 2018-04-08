

<template>
	<div class="home-main-group">
	    <div id="focus-template"></div>
	    <div id="hall-nav-template"></div>
	    <div id="hotlists-template"></div>
	    <div id="goods-list-template"></div>
	</div>
</template>

<script>

	import $ from 'webpack-zepto';
	import Vue from 'vue';
	import banner from './banner.vue';
	import hall_nav from './hall_nav.vue';
	import hotlists from './hotlists.vue';
	import goods_list from './goods_list.vue';
	import focus_swipe from '../assets/focus_swipe.js';


	module.exports = {
		render: function(component){
			$('#home').html(
				component.template
			);
			//焦点图
			// console.log(banner.items);
			var render_banner=new Vue({
				el:'#focus-template',
				render:h=>h(banner)
			});

			//首页入口导航

			var render_hall_nav=new Vue({
				el:'#hall-nav-template',
				render:h=>h(hall_nav)
			});

			//首页热门推荐

			var render_hotlists=new Vue({
				el:'#hotlists-template',
				render:h=>h(hotlists)
			});

			//首页商品列表

			var render_goods_list=new Vue({
				el:'#goods-list-template',
				render:h=>h(goods_list)
			});
		}
	};
</script>

		
