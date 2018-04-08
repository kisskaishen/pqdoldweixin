

<template>
	<div class="page-good-group" id="page-good-group">
		<div class="goods-cats-group clearfix tc mt5" v-cloak>
			<a class="item" v-for="(item,cat2_index) in cat_items" :href="'cat_page.html?type=0&rank=2&id='+item.id+'&cat1_index='+cat1_index+'&cat2_index='+cat2_index" v-if="cat2_index<7">
				<img :src="item.img" alt="">
				<p class="title fs11">{{item.name}}</p>
			</a>
			<a v-if="cat_items.length>0" class="item" :href="'cat_page.html?type=0&id='+cat1_id+'&cat1_index='+cat1_index">
				<img :src="more_icon_url">
				<p class="title">更多</p>
			</a>
		</div>
		<ul class="clearfix mt5" v-cloak>
			<li v-for="item in items">
				<a v-bind:href="'goods_detail.html?goods_id='+item.goods_id" class="tap">
					<div class="pic">
						<img v-bind:src="item.original_img" @error="img_error('images/lazy_400x400.jpg',$event)" alt="">
					</div>
					<div class="title fs11">
						{{item.goods_name}}
					</div>
					<div class="footing clearfix">
						<div class="fl price fs11">
							<span class="red1">￥{{item.prom_price}}</span>
							<span class="gray1 ml5 fs9">{{item.prom==0?'免单拼':item.prom+'人团'}}</span>
							<!-- <br>
							<p class="mt3 gray1 fs10">单买价格：{{item.market_price}}</p> -->
						</div>
					</div>
				</a>
			</li>
		</ul>
		<p class="more-hint tc gray1" id="more-hint" style="padding:1rem;">上拉加载更多</p>
	</div>
</template>

<script>
	import $ from 'webpack-zepto';
	import Vue from 'vue';
	

	var page_list_vm = null;
	

	module.exports = {
		data: function(){
			return {
				items: [],
				cat_items: [],
				cat1_id: 0,
				cat1_index: 0,
				more_icon_url: 'images/classMore@3x.png'
			}	
		},
		mounted: function() {
			page_list_vm=this;
		},
		methods: {
			//获取分类导航列表
			get_cats: function(id){
				page_list_vm.cat1_index = id;
				$.ajax({
					type:'GET',
					url:'http://139.196.255.40/api/index/getexplore&ajax_get=1',//获取数据
					dataType:'jsonp',
					jsonp: 'jsoncallback',
					async:true,
					success:function(data){
						page_list_vm.cat_items = data.result.cat[id].cat2;
						page_list_vm.cat1_id = data.result.cat[id].id;
						$('#loading-dialog').hide();
					},
					error: function(xhr,type){
					    console.log('Ajax error!');
					}
				});
			},
			//获取商品列表
			update_data: function(url) {
				var self = this;
				$.ajax({
					type:'GET',
					url:url,//获取列表页数据
					dataType:'jsonp',
					jsonp: 'jsoncallback',
					async:true,
					success:function(data){
						//console.log('请求成功~更新成功');
						if(self.isloadmore){
							//console.log(data.result.items);
							if(data.result.items.length>0){
								page_list_vm.items = page_list_vm.items.concat(data.result.items);
								//console.log(page_list_vm.items);
							};	
						}else{
							//init loading
							page_list_vm.items = data.result.items;
							//data.result.pagesize == 6????
						};
						$('#more-hint').html('上拉加载更多');
						if(data.result.items.length==0){
							//console.log('没有更多数据了')
							$('#more-hint').html('没有更多数据了');
						};
						

					},
					error: function(xhr,type){
					    console.log('Ajax error!');
					}
				});
			},
			img_error: function(url,e){ 
				var img=e.currentTarget; 
				img.src=url; 
				img.onerror=null; 
			}
		}
	}
</script>

		
