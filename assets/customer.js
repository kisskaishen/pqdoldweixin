
import $ from 'webpack-zepto';
import Vue from 'vue';

import urlSearch from '../assets/urlSearch.js';

//set viewport&font-size
import set_viewport from '../assets/fontSize.js';
set_viewport();


//引入订单/开团 浮动推送
//import hot_feed from '../assets/hot_feed.js';
//hot_feed();

import sign from '../assets/sign.js';

import cookie from '../assets/cookie.js';

// //引入loading 动画
// import loading from '../components/loading_ani.vue';
// var loading_dialog = new Vue({
// 	el:'#loading-template',
// 	render: h=>h(loading)
// });




//获取user_id和商品id
var user_id = cookie.get('user_id')||0;
var goods_id = urlSearch('goods_id')||0;
var store_id = urlSearch('store_id')||0;
var store_name = urlSearch('store_name')||'客服-拼趣多';
var store_logo = urlSearch('store_logo')||'../images/icon_place.png';

document.title = decodeURI(store_name);

if(!user_id||user_id==undefined){
	//跳转登录
	location.href='../user_center.html?islogin=false';
};

console.log('user_id='+user_id);
console.log('goods_id='+goods_id);
console.log('store_id='+store_id);


// function formatDate(now,format){     
// 	var year=now.getFullYear();     
//   	var month=parseInt(now.getMonth())+1<10?'0'+(parseInt(now.getMonth())+1):parseInt(now.getMonth())+1;     
//   	var date=now.getDate()<10?'0'+now.getDate():now.getDate();     
//   	var hour=now.getHours()<10?'0'+now.getHours():now.getHours();     
//   	var minute=now.getMinutes()<10?'0'+now.getMinutes():now.getMinutes();     
//   	var second=now.getSeconds()<10?'0'+now.getSeconds():now.getSeconds();
//   	switch(format){
//   		case 'YY-MM-DD hh:mm:ss':
//   			return year+"-"+month+"-"+date+"   "+hour+":"+minute+":"+second; 
//   		break;
//   		case 'MM-DD hh:mm:ss':
//   			return month+"-"+date+"   "+hour+":"+minute+":"+second; 
//   		break;
//   		case 'hh:mm:ss':
//   			return hour+":"+minute+":"+second; 
//   		break;
//   		default: return '刚刚';
//   	};	   
// }




new Vue({
	el: '#wrap',
	data: function(){
		return {
			goods_info: {},
			head_pic: cookie.get('head_pic')||'../images/ts_p1.jpg',
			user_name: cookie.get('user_name'),
			user_id: cookie.get('user_id'),
			msg_data: [],
			timeKey: cookie.get('user_id')+'_'+store_id+'_time',//时间记录key: user_id+'_'+store_id+'_time'
			MsgExKey: cookie.get('user_id')+'_'+store_id,//历史记录key: user_id+'_'+store_id
			sendPrivateText: null
		}
	},
	mounted: function(){
		var self_ = this;
		if(goods_id){
			self_.get_goods();
		};
		self_.connect();
		self_.send_msg();


		//存储店铺昵称和头像等信息
		var store = {
			'time':Date.now(),
			'store_id': store_id,
			'store_name': decodeURI(store_name),
			'store_logo': store_logo
		};
		localStorage.setItem('store'+store_id,JSON.stringify(store));
		
		
		//获取写入消息记录
		var chat_history = localStorage.getItem(self_.MsgExKey)||false;
		if(chat_history){
			//console.log(localStorage);
			chat_history = JSON.parse(chat_history);
			self_.msg_data = self_.msg_data.concat(chat_history);
		};
	},
	methods: {
		//连接第三方平台
		connect: function(){
			var self_ = this;
			//连接
			var conn = new WebIM.connection({
			    https: WebIM.config.https,
			    url: WebIM.config.xmppURL,
			    isAutoLogin: WebIM.config.isAutoLogin,
			    isMultiLoginSessions: WebIM.config.isMultiLoginSessions
			});
			//用户信息配置
			var customer_info = {
				userid: cookie.get('user_id'),
				username: 'user'+cookie.get('user_id'),
				headpic: cookie.get('head_pic'),
				password: 'user'+cookie.get('user_id'),
				appKey: '1165160929115391#pqd'
			};

			//console.log(customer_info);
			//注册
			var options = { 
			    username: customer_info.username,
			    password: customer_info.password,
			    nickname: customer_info.username,
			    appKey: customer_info.appKey,
			    success: function () {
			        console.log('注册成功');
			    },  
			    error: function () {
			        console.log('已注册');
			    }, 
			    apiUrl: WebIM.config.apiURL
			}; 
			Easemob.im.Helper.registerUser(options);


			//登录
			conn.open({ 
			    apiUrl: WebIM.config.apiURL,
			    user: customer_info.username,
			    pwd: customer_info.password,
			    appKey: customer_info.appKey//WebIM.config.appkey
			});
			//初始化
			conn.init({
			    onOpened : function() {
			    	console.log("连接成功");
			        var ext = null;
			        conn.setPresence();
			        //添加好友
			    	(function(){
			    		//console.log('添加好友');

		    			//添加
			    		conn.subscribe({
					        to: 'store'+store_id,
					        message: '[resp:true]'   
					    });

					    //console.log('添加好友成功');

			    	})();
			        //发送信息
			        self_.sendPrivateText = function (message) {
			            var id = conn.getUniqueId();                 // 生成本地消息id
			            var msg = new WebIM.message('txt', id);      // 创建文本消息
			            msg.set({
			                msg: message,                  // 消息内容
			                to: 'store'+store_id,                // 接收消息对象（用户id）
			                roomType: false,
			                success: function () {
			                    console.log('发送成功');
			                },
			                error: function(){
			                    console.log('发送失败');
			                }
			            });
			            msg.body.chatType = 'singleChat';
			            msg.body.from = customer_info.userid;
			            msg.body.data = msg.body.msg;
			            msg.body.ext.recevierUser= {
			                'avatar': store_logo,
			                'userid': 'store'+store_id,
			                'username': store_name
			            };
			            msg.body.ext.senderUser= {
			                'avatar': customer_info.headpic,
			                'userid': customer_info.userid,
			                'username': self_.user_name
			            };
			            ext = msg.body.ext;
			            //console.log(msg.body);
			            conn.send(msg.body);

			            // 发送文本消息到环信服务器
			            // conn.sendTextMessage({
			            //     to: 'store913',
			            //     from: '993',
			            //     avatar: 'yizh',
			            //     id: msg.body.id,
			            //     msg: 'yizh', //文本消息
			            //     data: 'yizh', //文本消息
			            //     type: "chat",
			            //     //用户自扩展的消息内容
			            //     ext: ext,
			            //     success: function (msg) {
			            //         console.log(msg);
			            //         console.log('发送成功2');
			            //     },
			            //     error: function(){
			            //         console.log('发送失败');
			            //     }
			            // });
			        };
			        //接收消息
			        conn.listen({
			        	//收到文本消息
			        	onTextMessage: function (message){
			        		var msg = message.data;
			        		self_.msg_data.push({
			        			'time': Date.now(),
								'msg': msg,
								'head_pic': message.ext.senderUser.avatar,
								'origin': 'left'
							});
			        		self_.save_msg();
			        	}   
			        });
			    }
			});
		},
		//发送文本消息
		send_msg: function(){
			var self_ = this;
			$('#send-btn').click(function(e){
				var msg = $('#input').val();
				if(msg==''){
					return;
				};
				self_.msg_data.push({
					'time': Date.now(),
					'msg': msg,
					'head_pic': self_.head_pic,
					'origin': 'right'
				});
				self_.sendPrivateText(msg);
				self_.save_msg();
				$('#input').val('');
			});
		},
		//获取商品数据
		get_goods: function(){
			var self_ = this;
			var qs = sign.sign({
				goods_id: goods_id,
				user_id: user_id,
				ajax_get: 1
			});
			$.ajax({
				type:'POST',
				url:'https://z.pinquduo.cn/api_3_0_1/api/goods/getGoodsDetails?' + qs,//获取数据
				dataType:'jsonp',
				jsonp: 'jsoncallback',
				async:false,
				success:function(data){
					console.log(data);
					self_.goods_info = data.result;
				},
				error: function(xhr,type){
				    console.log('Ajax error!');
				}
			});
		},
		//发送商品链接
		send_goods: function(){
			var self_ = this;
			var msg = 'https://wx.pinquduo.cn/goods_detail.html?goods_id='+goods_id+' 请复制地址打开';
			//$('#input').val('https://wx.pinquduo.cn/goods_detail.html?goods_id='+goods_id+' 请复制地址打开');
			self_.msg_data.push({
				'time': Date.now(),
				'msg': msg,
				'head_pic': self_.head_pic,
				'origin': 'right'
			});
			self_.sendPrivateText(msg);
			self_.save_msg();
		},
		//保存聊天记录
		save_msg: function(){
			var self_ = this;
			//设置最大保存的数目
			var save_items = self_.msg_data.slice(0,self_.msg_data.length);
			save_items.reverse();
			save_items = save_items.slice(0,30);
			save_items.reverse();
			localStorage.setItem(self_.MsgExKey,JSON.stringify(save_items));
		},
		//时间转换
		timestampFormat: function(timestamp) {
			if(isNaN(timestamp)||timestamp==0){
				return '';
			};
		    function zeroize( num ) {
		        return (String(num).length == 1 ? '0' : '') + num;
		    }
		 
		    var curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
		    var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数
		 
		    var curDate = new Date( curTimestamp * 1000 ); // 当前时间日期对象
		    var tmDate = new Date( timestamp * 1000 );  // 参数时间戳转换成的日期对象
		 
		    var Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
		    var H = tmDate.getHours(), i = tmDate.getMinutes(), s = tmDate.getSeconds();
		 
		    if ( timestampDiff < 60 ) { // 一分钟以内
		        return "刚刚";
		    } else if( timestampDiff < 3600 ) { // 一小时前之内
		        return Math.floor( timestampDiff / 60 ) + "分钟前";
		    } else if ( curDate.getFullYear() == Y && curDate.getMonth()+1 == m && curDate.getDate() == d ) {
		        return '今天 ' + zeroize(H) + ':' + zeroize(i);
		    } else {
		        var newDate = new Date( (curTimestamp - 86400) * 1000 ); // 参数中的时间戳加一天转换成的日期对象
		        if ( newDate.getFullYear() == Y && newDate.getMonth()+1 == m && newDate.getDate() == d ) {
		            return '昨天 ' + zeroize(H) + ':' + zeroize(i);
		        } else if ( curDate.getFullYear() == Y ) {
		            return  zeroize(m) + '-' + zeroize(d) + ' ' + zeroize(H) + ':' + zeroize(i);
		        } else {
		            return  Y + '-' + zeroize(m) + '-' + zeroize(d) + ' ' + zeroize(H) + ':' + zeroize(i);
		        }
		    }
		}
	}
});















	    