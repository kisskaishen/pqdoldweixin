<template>
	<div>
		<div class="filtrate-group fs10" id="filtrate-group">
			<div class="item" data-max="200" data-init="200">
				<span class="gray2 num start-num">0</span>
				<span class="gray2 num end-num">200元</span>
				<dl class="clearfix">
					<dt class="fl">选择价格：</dt>
					<dd>
						<div class="linebg"></div>
						<div class="linebox">
							<span class="point-start point"><span class="count">0</span></span>
							<span class="point-end point"><span class="count">0</span></span>
						</div>
					</dd>
				</dl>
			</div>
			<div class="item mt5" data-max="5" data-init="5">
				<span class="gray2 num start-num">0</span>
				<span class="gray2 num end-num">5人</span>
				<dl class="clearfix">
					<dt class="fl">免单人数：</dt>
					<dd>
						<div class="linebg"></div>
						<div class="linebox">
							<span class="point-start point"><span class="count">0</span></span>
							<span class="point-end point"><span class="count">0</span></span>
						</div>
					</dd>
				</dl>
			</div>
		</div>
	    <div class="good-group free mt5">
	    	<a v-bind:href="'prom_regiment.html?order_id='+item.order_id" class="item tap" v-for="item in items">
	    		<div class="pic tc">
					<img v-bind:src="item.original_img" alt="">
	    		</div>
	    		<div class="intro mt10">
	    			<p class="fs12">
	    				{{item.goods_name}}
	    			</p>
	    		</div>
	    		<div class="clearfix fs12 mt10">
					<span class="btn fr">去参团</span>
					<span>
						<span class="fs12 gray1">{{item.goods_num+'人团'+'免'+item.free}}</span>
						<span class="red1">￥{{item.price}}</span>
					</span>
	    		</div>
	    	</a>
	    	<p class="more-hint tc gray1" id="more-hint" style="padding:1rem;">上拉加载更多</p>
		</div>
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
				url: 'http://139.196.255.40/api/index/getMany_people_spell_group?free_min=1&free_max=5&price_min=0&price_max=200&ajax_get=11&pagesize=6&page=',
				isloadmore: true,
				page: 1
			}
		},
		mounted: function(){
			var self_ = this;
			self_.get_regiment(self_.url+'1');
			
			//筛选
			(function(){
				var touchstart = 'ontouchstart' in document?'touchstart':'mousedown';
				var touchend = 'ontouchend' in document?'touchend':'mouseup';
				var touchmove = 'ontouchmove' in document?'touchmove':'mousemove';
				var filtrate_wrap = $('#filtrate-group');
				var linebg = $('#filtrate-group .linebg').eq(0);
				var item = $('#filtrate-group .item');
				var linebox = $('#filtrate-group .linebox');
				var countbox = $('#filtrate-group').find('.count');
				var z=10;//point层级
				var hasTouchend = false;//手指离开监听
				var current_point = null;
				item.each(function(){
					var this_ = $(this);
					var cur = this_.index();
					var point_start = this_.find('.point-start').eq(0);
					var point_end = this_.find('.point-end').eq(0);
					var data_max = this_.attr('data-max');
					var data_init = this_.attr('data-init');
					var endCount_box = point_end.find('.count');
					endCount_box.html(data_init);
					linebox.eq(cur).css({right: ((data_max-data_init)/data_max)*100+'%'});
					point_start.bind(touchstart,function(e){
						current_point = $(this);
						hasTouchend = false;
						z++;
						var countbox = $(this).find('.count');
						var offsetLeft = linebg.offset().left;
						var lineWidth = linebg.width();
						point_end.moveX = Math.ceil(point_end.offset().left-offsetLeft+point_start.width()/2);
						$(this).addClass('hover');
						$(this).css({'z-index':z});
						$(document).bind(touchmove,function(e){
							var touch_move = e.touches?e.touches[0]:e;
							var moveX = touch_move.pageX - offsetLeft;
							if(moveX <= 0){
								moveX = 0;
							};
							if(moveX >= point_end.moveX){
								moveX = point_end.moveX;
							};
							var data_num = Math.ceil(data_max*moveX/lineWidth);
							countbox.html(data_num);
							$(this).moveX = moveX;
							linebox.eq(cur).css({left: moveX/lineWidth*100+'%'});
							e.preventDefault();
						});
						e.preventDefault();
					});
					point_end.bind(touchstart,function(e){
						current_point = $(this);
						hasTouchend = false;
						z++;
						var countbox = $(this).find('.count');
						var offsetLeft = linebg.offset().left;
						var lineWidth = linebg.width();
						point_start.moveX = Math.ceil(point_start.offset().left-offsetLeft+point_start.width()/2);
						$(this).addClass('hover');
						$(this).css({'z-index':z});
						$(document).bind(touchmove,function(e){
							var touch_move = e.touches?e.touches[0]:e;
							var moveX = lineWidth - (touch_move.pageX-offsetLeft);
							if(moveX <= 0){
								moveX = 0;
							};
							if(lineWidth - moveX <= point_start.moveX){
								moveX = lineWidth-point_start.moveX;
							};
							var data_num = Math.ceil(data_max*(lineWidth-moveX)/lineWidth);
							countbox.html(data_num);
							$(this).moveX = moveX;
							linebox.eq(cur).css({right:moveX/lineWidth*100+'%'});
							e.preventDefault();
						});
						e.preventDefault();
					});
				});

				filtrate_wrap.bind(touchstart,function(){
					if(current_point == null){
						return false;
					};
					$(document).unbind(touchend).bind(touchend,function(e){
						current_point.removeClass('hover');
						$(document).unbind(touchmove);
						if(hasTouchend){
							return;
						};
						//e.preventDefault();
						self_.isloadmore = true;
						self_.items = [];
						self_.page = 1;
						self_.url = "http://139.196.255.40/api/index/getMany_people_spell_group?free_min="+(countbox.eq(2).html()<=0?1:countbox.eq(2).html())+"&free_max="+countbox.eq(3).html()+"&price_min="+countbox.eq(0).html()+"&price_max="+countbox.eq(1).html()+"&ajax_get=1&pagesize=6"+'&page=';
						self_.get_regiment(self_.url+self_.page);
						hasTouchend = true;
						//console.log('xxx')
					});
				});

				pullup_load({
					wrap: $('body'),
					group: $('#goods-list'),
					hintBar: $('#more-hint'),
					callback: function(){
						if(!self_.isloadmore){
							self_.isloadmore = true;
						};
						self_.page +=1;
						self_.get_regiment(self_.url+self_.page);
					}
				});
			})();		
		},
		methods: {
			get_regiment: function(url){
				var self_ = this;
				$('#more-hint').html('正在加载...');
				$('#loading-dialog').show();
				$.ajax({
					type:'POST',
					url:url,//获取数据
					dataType:'jsonp',
					jsonp: 'jsoncallback',
					async:true,
					success:function(data){
						$('#loading-dialog').hide();
						console.log(data);
						if(data.result.items.length<data.result.pagesize){
							$('#more-hint').html('没有更多数据了');
							self_.isloadmore = false;
						}else{
							$('#more-hint').html('上拉加载更多');
						};
						self_.items = self_.items.concat(data.result.items);
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