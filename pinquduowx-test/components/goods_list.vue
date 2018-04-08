<template>
	
</template>


<script>
    import $ from 'webpack-zepto';
	import Vue from 'vue';
	import pullup_load from '../assets/pullup_load.js';

	//console.log(getData);

	module.exports = {
		data: function(){
			return {
				items: [],
				//每页数目
				pagesize: 6
			}
			
		},
		mounted: function() {
			var self_ = this;
			self_.update_data('http://139.196.255.40/api/Index/home'+'?pagesize='+self_.pagesize+'&ajax_get=1');
			self_.$nextTick(function(){
				//上拉加载
				var page = 1;
				pullup_load({
					wrap: $('body'),
					group: $('#goods-list'),
					hintBar: $('#more-hint'),
					callback: function(){
						if(!self_.isloadmore){
							self_.isloadmore = true;
						};
						page +=1;
						self_.update_data("http://139.196.255.40/api/Index/home?ajax_get=1"+'&pagesize='+self_.pagesize+'&page='+page);
					}
				});
				
			});
		},
		methods: {
			update_data: function(url) {
				var self_ = this;
				$.ajax({
					type:'GET',
					url:url,//获取首页数据
					dataType:'jsonp',
					jsonp: 'jsoncallback',
					async:true,
					success:function(data){
						if(!self_.isloadmore){
							self_.items = data.result.goods2.items;
						}else{
							$('#more-hint').html('上拉加载更多');
							if(data.result.goods2.items.length==0){
								//console.log('没有更多数据了')
								$('#more-hint').html('没有更多数据了');
							};
							self_.items = self_.items.concat(data.result.goods2.items);
						};
						$('#loading-dialog').hide();
						//console.log(data.result);
					},
					error: function(xhr,type){
					    console.log('Ajax error!');
					}
				});
			}
		}
	}
</script>