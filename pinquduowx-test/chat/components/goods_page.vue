
<template>
	<div id="list-page-template"></div>
</template>

<script>
	import $ from 'webpack-zepto';
	import Vue from 'vue';
	import list_page from './list_page.vue';
	module.exports = {
		render: function(component){
			$('#home').html(
				component.template
			);
			var render_list_page=new Vue({
				el:'#list-page-template',
				render:h=>h(list_page)
			});
		}
	}
</script>

		
