<template>
	<div class="main-body" id="main-body">
		<div id="regiment"></div>
	</div>
</template>

<script>
	import $ from 'webpack-zepto';
	import Vue from 'vue';
	import regiment_group from './regiment_group.vue';

	module.exports = {
		render: function(){
			new Vue({
				el: '#regiment',
				render: h=>h(regiment_group)
			});
		}
	}
</script>