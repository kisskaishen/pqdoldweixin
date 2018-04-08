
<template>
	<div class="ranking-group" id="ranking-group">
    	<a v-bind:href="'goods_detail.html?goods_id='+item.goods_id" class="tap ranking-item" v-for="(item, index) in items">
    		<span class="mark-num">{{index+1}}</span>
    		<dl class="clearfix">
    			<dt class="pic mr15">
					<img v-bind:src="item.original_img" alt="">
    			</dt>
    			<dd>
					<div class="intro">
		    			<p class="fs12">
		    				{{item.goods_name}}
		    			</p>
		    		</div>
		    		<div class="mt15 clearfix">
						<span class="btn fr mt15"></span>
						<div>
							<span class="fs11">{{item.prom==0?'免单拼':item.prom+'人团'}}</span>
							<span class="red1">￥{{item.prom_price}}</span>
							<br>
							<div class="mt5 gray1 fs10">单买价格：{{item.market_price}}</div>
						</div>
		    		</div>
    			</dd>
    		</dl>
    	</a>
    	<p class="more-hint tc gray1" id="more-hint" style="padding:1rem;">上拉加载更多</p>
    </div>
</template>

<script>
	import $ from 'webpack-zepto';
	import Vue from 'vue';
	import pullup_load from '../assets/pullup_load.js';
	
	module.exports = {
		data: function(){
			return {
				items: [],
				//加载条目
				pagesize: 8
			}
		},
		mounted: function(){
			var page = 1;
			var self_ = this;
			self_.update_data("http://139.196.255.40/api/index/getRankingList?page="+page+'&pagesize='+self_.pagesize+"&ajax_get=1");
			self_.$nextTick(function(){
				pullup_load({
					wrap: $('body'),
					group: $('#ranking-group'),
					hintBar: $('#more-hint'),
					callback: function(){
						if(!self_.isloadmore){
							self_.isloadmore = true;
						};
						page +=1;
						self_.update_data("http://139.196.255.40/api/index/getRankingList?page="+page+'&pagesize='+self_.pagesize+"&ajax_get=1");
					}
				});
			});
		},
		methods: {
			update_data: function(url){
				var self_ = this;
				$.ajax({
					type:'POST',
					url:url,//获取排行榜数据
					dataType:'jsonp',
					jsonp: 'jsoncallback',
					async:true,
					success:function(data){
						console.log(data);
						//console.log('loading');
						if(self_.isloadmore){
							self_.items = self_.items.concat(data.result.items);
						}else{
							//init loading
							self_.items = data.result.items;
						};
						$('#more-hint').html('上拉加载更多');
						if(data.result.items.length==0){
							//console.log('没有更多数据了')
							$('#more-hint').html('没有更多数据了');
						};
						$('#loading-dialog').hide();
					},
					error: function(xhr,type){
					    console.log('Ajax error!');
					}
				});
			}
		}
	}
</script>
		