
<template>
    
</template>

<script>
	import $ from 'webpack-zepto';
	import Vue from 'vue';
	module.exports = {
		data: function(){
			return {
				banner_url: 'images/hot_banner.jpg',
				hint_timer: null
			}	
		},
		mounted: function() {
			
		},
		methods: {
			app_hint_show: function() {
				var self_ = this
				$('#hint-dialog').html('<p class="fs11 tc">此活动为APP专享功能，参与活动请先下载拼趣多APP哦！</p>');
				$('#hint-dialog').show();
				self_.hint_timer=setTimeout(function(){
		        	$('#hint-dialog').hide();
		        },1000);
		        return false;
			}
		}
	}
</script>