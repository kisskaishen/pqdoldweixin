
<template>
	<div class="main-body" id="main-body">
		<div id="ranking"></div>
	</div>
</template>

<script>
	import $ from 'webpack-zepto';
	import Vue from 'vue';
	import ranking_group from './ranking_group.vue';
	


	module.exports = {
		render: function(){
			new Vue({
				el: '#ranking',
				render: h=>h(ranking_group)
			});
		}
	}
</script>
		