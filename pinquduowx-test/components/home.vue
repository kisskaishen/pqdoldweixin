

<template>
	<div class="main-body" id="main-body">
		<div id="catNav-template"></div>
		<div id="home">
		    <div id="focus-template"></div>
		    <div id="hall-nav-template"></div>
		    <div id="hotlists-template"></div>
		    <div id="goods-list-template"></div>
		</div>
	</div>
</template>

<script>

	import $ from 'webpack-zepto';
	import Vue from 'vue';
	import cat_nav from './cat_nav.vue';
	import banner from './banner.vue';
	import hall_nav from './hall_nav.vue';
	import hotlists from './hotlists.vue';
	import goods_list from './goods_list.vue';
	


	module.exports = {
		render: function(){
			//顶部分类导航
			var render_catNav=new Vue({
				el:'#catNav-template',
				render:h=>h(cat_nav)
			});
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

		
