
<template>
	<div class="main-body" id="main-body">
		<div id="seek"></div>
	</div>
</template>

<script>
	import $ from 'webpack-zepto';
	import Vue from 'vue';
	import seek_group from './seek_group.vue';
	


	module.exports = {
		render: function(){
			new Vue({
				el: '#seek',
				render: h=>h(seek_group)
			});
		}
	}
</script>
		