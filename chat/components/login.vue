
<template>
	<div class="main-body" id="main-body">
		<div id="login"></div>
	</div>
</template>

<script>
	import $ from 'webpack-zepto';
	import Vue from 'vue';
	import login_group from './login_group.vue';
	
	module.exports = {
		render: function(){
			new Vue({
				el: '#login',
				render: h=>h(login_group)
			});
		}
	}
</script>
		