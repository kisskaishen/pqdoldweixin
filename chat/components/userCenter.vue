
<template>
	<div class="main-body" id="main-body">
		<div id="userCenter"></div>
		<div id="login"></div>
	</div>
</template>

<script>
	import $ from 'webpack-zepto';
	import Vue from 'vue';
	import userCenter_group from './userCenter_group.vue';
	import login_group from './login_group.vue';




	module.exports = {
		render: function(){
			new Vue({
				el: '#userCenter',
				render: h=>h(userCenter_group)
			});
			new Vue({
				el: '#login',
				render: h=>h(login_group)
			});
		}
	}
</script>
		