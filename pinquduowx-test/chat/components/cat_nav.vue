
<template>
	<nav class="top-nav">
		<div class="plays_tab">
			<div class="swiper-container nav_scroll" id="cat-nav-scroll">
		        <ul class="swiper-wrapper" id="nav_list">
		            <li class="swiper-slide" v-for="(item,index) in items" v-bind:data-id="item.id" v-on:click="tab(index,item.id,$event)">
		            	{{item.name}}
		            </li>
		        </ul>
	        </div>
		</div>
	</nav>
</template>

<script>
	import $ from 'webpack-zepto';
	import Vue from 'vue';
	import list_page from './list_page.vue';
	import home_main from './home_main.vue';
	import goods_page from './goods_page.vue';
	import nav_scroll from '../assets/nav_scroll.js';
	import pullup_load from '../assets/pullup_load.js';



	module.exports = {
		data: function(){
			return {
				items: [],
				index: 0,
				//每页数目
				pagesize: 6
			}
		},
		mounted: function() {
			var self_ = this
			self_.update_data('http://139.196.255.40/api/Index/getHeader?ajax_get=1'+'&pagesize='+self_.pagesize);
		},
		methods: {
			update_data: function(url) {
				var self_ = this
				$.ajax({
					type:'GET',
					url:url,//获取顶部导航数据
					dataType:'jsonp',
					jsonp: 'jsoncallback',
					async:true,
					success:function(data){
						self_.items = data;
						self_.$nextTick(function(){
							nav_scroll("#cat-nav-scroll");
						});
					},
					error: function(xhr,type){
					    console.log('Ajax error!');
					}
				});
			},
			tab:function(index,id,event){
				var self_ = this;
				if(id==self_.index){
					return;
				};
				$('#loading-dialog').show();
				var el= $(event.target);
				if(el.hasClass('active')){
					return;
				};
				if(id==0){
					home_main.render(home_main);
				}else{
					goods_page.render(goods_page);
					list_page.methods.get_cats(index-1);
					var page = 1;
					list_page.methods.isloadmore = false;
					list_page.methods.update_data("http://139.196.255.40/api/index/getNewData?page="+page+"&ajax_get=1&id="+id+'&pagesize='+self_.pagesize);
					pullup_load({
						wrap: $('body'),
						group: $('#page-good-group'),
						hintBar: $('#more-hint'),
						callback: function(){
							if(!list_page.methods.isloadmore){
								list_page.methods.isloadmore = true;
							};
							page +=1;
							list_page.methods.update_data("http://139.196.255.40/api/index/getNewData?page="+page+"&ajax_get=1&id="+id+'&pagesize='+self_.pagesize);
						}
					});
				};
				self_.index = id;	
			}
		}
	}
</script>