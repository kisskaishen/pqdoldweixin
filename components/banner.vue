
	<template>
		<div class="focus-pic swiper-container" id="focus-pic">
	        <div class="swiper-wrapper">
            	<div class="swiper-slide" v-for="item in items">
	            	<a v-bind:href="item.ad_link">
	            		<img v-bind:src="item.ad_code">
            		</a>
	            </div>
	        </div>
	        <div class="swiper-pagination"></div>
	    </div>
	</template>


	<script>
	    import $ from 'webpack-zepto';
		import Vue from 'vue';
		import focus_swipe from '../assets/focus_swipe.js';

		module.exports = {
			data: function(){
				return {
					items: []
				}	
			},
			mounted: function() {
				this.update_data('http://139.196.255.40/api/Index/home?ajax_get=1');
			},
			methods: {
				update_data: function(url) {
					var self = this;
					$.ajax({
						type:'GET',
						url:url,//获取首页数据
						dataType:'jsonp',
						jsonp: 'jsoncallback',
						async:true,
						success:function(data){
							console.log(data);
							self.items = data.result.ad;
							self.$nextTick(function(){
								focus_swipe('#focus-pic');
							});						
							//console.log(data.result.ad);
						},
						error: function(xhr,type){
						    console.log('Ajax error!');
						}
					});
				}
			}
		}
	</script>
    
    
			    