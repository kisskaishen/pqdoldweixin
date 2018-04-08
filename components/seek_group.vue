<template>
	<div class="seek-group">
		<div class="seek-header">
			<a href="goods_search.html" class="search-hall tap gray1">
				<i class="icon mr5"></i><span class="fs11">搜索商品</span>
			</a>
		</div>
		<div class="seek-container black3 fs11">
			<div class="tab-options">
				<div class="item clearfix" v-for="(item,index) in items" :class="{active:index==0}">
					<i class="fl icon mr10"></i>
					<p class="title">{{item.name}}</p>
				</div>
				<div class="item clearfix">
					<i class="fl icon mr10"></i>
					<p class="title">{{haitao.name}}</p>
				</div>
			</div>
			<div class="tab-contents-group fs11 black3">
				<div class="content-item" v-for="(item,cat1_index) in items">
					<a :href="'cat_page.html?type=0&id='+item.id+'&cat1_index='+cat1_index" class="black3 heading clearfix">
						<span class="fl">{{item.name}}</span>
						<span class="fr gray3 more">更多&nbsp;&nbsp;&nbsp;</span>
					</a>
					<div class="list-group">
						<ul class="clearfix tc mt10">
							<li v-for="(cat,index) in item.cat2">
								<a :href="'cat_page.html?type=0&rank=2&id='+cat.id+'&cat1_index='+cat1_index+'&cat2_index='+index">
									<img v-bind:src="cat.img" alt="">
									<p class="title">{{cat.name}}</p>
								</a>
							</li>
						</ul>
					</div>
				</div>
				<div class="content-item">
					<a :href="'cat_page.html?type=1&id='+haitao.id" class="black3 heading clearfix">
						<span class="fl">{{haitao.name}}</span>
						<span class="fr gray3 more">更多&nbsp;&nbsp;&nbsp;</span>
					</a>
					<div class="list-group">
						<ul class="clearfix tc mt10">
							<li v-for="(cat,index) in haitao.cat2">
								<a :href="'cat_page.html?type=1&rank=2&id='+cat.id+'&cat2_index='+index">
									<img v-bind:src="cat.img" alt="">
									<p class="title">{{cat.name}}</p>
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>		


<script>
	import $ from 'webpack-zepto';
	import Vue from 'vue';
	import tab from '../assets/tab.js';

	module.exports = {
		data: function(){
			return {
				haitao: {},
				items: []
			}
		},
		mounted: function(){
			this.update_data('http://139.196.255.40/api/index/getexplore&ajax_get=1');
		},
		methods: {
			update_data: function(url){
				var self=this;
				$.ajax({
					type:'GET',
					url:url,//获取数据
					dataType:'jsonp',
					jsonp: 'jsoncallback',
					async:true,
					success:function(data){
						console.log(data);
						self.items = data.result.cat;
						self.haitao = data.result.haitao;
						self.$nextTick(function(){
							tab($('.tab-options .item'),$('.tab-contents-group .content-item'));
							$('#loading-dialog').hide();
						});
						//console.log(data.result.cat);
					},
					error: function(xhr,type){
					    console.log('Ajax error!');
					}
				});
			}
		}
	}
</script>