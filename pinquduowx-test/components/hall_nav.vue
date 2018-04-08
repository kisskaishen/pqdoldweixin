
<template>
    
</template>

<script>
	import $ from 'webpack-zepto';
	import Vue from 'vue';
	import cookie from '../assets/cookie.js';
	module.exports = {
		data: function(){
			return {
				items: [],
				links: [
					{href: 'javascript:;'},
					{href: 'free_group.html'},
					{href: 'special_haitao.html'},
					{href: 'javascript:;'},
					{href: 'javascript:;'},
					{href: 'special99.html'},
					{href: 'special_timed.html'},
					{href: 'javascript:;'}
				],
				hint_timer: null
			}	
		},
		mounted: function() {
			this.update_data();
			this.goProm();
		},
		methods: {
			//导航功能
			nav_fn: function(index){
				var self_ = this;
				clearTimeout(self_.hint_timer);
				//为我点赞
				if(index==0){
					$('#hint-dialog').html('<p class="fs12 tc">'+'该功能为app专属，请下载拼趣多app'+'</p>');
					$('#hint-dialog').show();
					self_.hint_timer=setTimeout(function(){
			        	$('#hint-dialog').hide();
			        },1000);
				};
				//参团
				if(index==3){
					$('#join-group').show();
				};
				//为我拼
				if(index==4){
					$('#hint-dialog').html('<p class="fs12 tc">'+'程序员哥哥还在努力开发中...'+'</p>');
					$('#hint-dialog').show();
					self_.hint_timer=setTimeout(function(){
			        	$('#hint-dialog').hide();
			        },1000);
					return false;
				};

				//省钱大法
				if(index==7){
					$('#hint-dialog').html('<p class="fs12 tc">'+'程序员哥哥还在努力开发中...'+'</p>');
					$('#hint-dialog').show();
					self_.hint_timer=setTimeout(function(){
			        	$('#hint-dialog').hide();
			        },1000);
					return false;
				};
			},
			//参团（输入参团码）
			goProm: function(){
				var self_ = this;
				var promBtn = $('#prom-btn');
				var promInput = $('#prom-input');
				promBtn.click(function(){
					clearTimeout(self_.hint_timer);
					var prom_code = promInput.val().replace(/\s/g,"");
					if(prom_code==''||prom_code.length<6){
						$('#hint-dialog').html('<p class="fs11 tc">请输入正确的参团码</p>');
						$('#hint-dialog').show();
						self_.hint_timer=setTimeout(function(){
				        	$('#hint-dialog').hide();
				        },1000);
				        return;
					};
					$.ajax({
						type:'GET',
						url:'http://139.196.255.40/api/user/getPromDetail?invitation_num='+prom_code+'&user_id='+cookie.get('user_id')+'&ajax_get=1',
						dataType:'jsonp',
						jsonp: 'jsoncallback',
						async:true,
						success:function(data){
							console.log(data);
							var info = data.status==-1?'请输入正确的参团码':'验证成功';
							$('#hint-dialog').html('<p class="fs11 tc">'+info+'</p>');
							$('#hint-dialog').show();
							hint_timer=setTimeout(function(){
					        	$('#hint-dialog').hide();
					        	if(data.msg){
					        		location.href = "prom_regiment.html?order_id="+data.result.is_order.order.order_id+"&user_id="+cookie.get('user_id');
					        	};
					        },1000);
						},
						error: function(xhr,type){
						    console.log('Ajax error!');
						}
					});
				});

				$('#join-group .mask').click(function(){
					$('#join-group').hide();
				});
			},

			//更新数据
			update_data: function() {
				var self = this
				$.ajax({
					type:'GET',
					url:'http://139.196.255.40/api/Index/home?ajax_get=1&version=1.3.0' ,//获取首页数据
					dataType:'jsonp',
					jsonp: 'jsoncallback',
					async:true,
					success:function(data){
						self.items = data.result.cat;
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