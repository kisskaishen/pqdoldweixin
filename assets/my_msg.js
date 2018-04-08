import $ from 'webpack-zepto';
import Vue from 'vue';

import cookie from '../assets/cookie.js';


//set viewport&font-size
import set_viewport from '../assets/fontSize.js';
set_viewport();

//set tap-event-dom-style
import set_active from '../assets/active.js';
set_active();

import urlSearch from '../assets/urlSearch.js';

//引入loading 动画
import loading from '../components/loading_ani.vue';
var loading_dialog = new Vue({
	el:'#loading-template',
	render: h=>h(loading)
});

//引入订单/开团 浮动推送
//import hot_feed from '../assets/hot_feed.js';
//hot_feed();



//获取user_id
var user_id = cookie.get('user_id')||null;

console.log('user_id='+user_id);


// function formatDate(now,format){
// 	if(isNaN(now)){
// 		return '';
// 	};
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
			roster: [],
			hint_info: '',
			user_id: user_id,
			msg: {
				key:''
			}
		}
	},
	mounted: function(){
		var self_ = this;
		self_.connect();
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
			        var ext = null;
			        console.log("连接成功");
			        conn.setPresence();
			        // 列出好友列表
					conn.getRoster({
					    success: function(roster){
					    	$('#loading-dialog').hide();
					        //获取好友列表
					        //console.log(roster);
					        for(var i=0,len=roster.length;i<len;i++){
					        	if(roster[i].name in localStorage){
					        		var key = roster[i].name;
					        		var roster_json = JSON.parse(localStorage.getItem(key));
					        		roster_json.MsgExKey = user_id+'_'+key.replace(/[^0-9]/ig,"");
					        		self_.roster.push(roster_json);
					        	};
					        };
					        self_.roster.length==0&&(self_.hint_info = '暂无消息');
					    }    
					});
					//接收消息
			        conn.listen({
			        	//收到文本消息
			        	onTextMessage: function (message){
			        		var msg = message.data;
			        		//console.log(message);
			        		self_.msg.key = user_id+'_'+message.from.replace(/[^0-9]/ig,"");
			        		self_.msg[self_.msg.key] = {
		        				'time': Date.now(),
								'msg': msg,
								'head_pic': message.ext.senderUser.avatar,
								'origin': 'left'
							};
							self_.save_msg(user_id+'_'+message.from.replace(/[^0-9]/ig,""));
			        	}   
			        });
			    }

			});
		},
		//保存消息记录
		save_msg: function(MsgExKey){
			var self_ = this;
			var chat_history = localStorage.getItem(MsgExKey)||'[]';
			chat_history = JSON.parse(chat_history);
			chat_history.push(self_.msg[MsgExKey]);
			localStorage.setItem(MsgExKey,JSON.stringify(chat_history));
		},
		//获取消息记录
		get_localmsg: function(MsgExKey){
			if(localStorage.getItem(MsgExKey)){
				var msg_item = JSON.parse(localStorage.getItem(MsgExKey));
				var len = msg_item.length;
				return msg_item[len-1];
			}else{
				return {
					'time': '',
					'msg': ''
				}
			}
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




















	    