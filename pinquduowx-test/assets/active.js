
import $ from 'webpack-zepto';
module.exports=function(){
	$(document).ready(function(){
		var touch_start='ontouchstart' in document?'touchstart':'mousedown';
		var touch_end='ontouchend' in document?'touchend':'mouseup';
		var touch_move='ontouchmove' in document?'touchmove':'mousemove';
		var taps = $('.tap');
		//console.log(taps.length)
		taps.each(function(){
			var this_=$(this);
			this_.bind(touch_start,function(){
				this_.addClass('active');
			});
			this_.bind(touch_end,function(){
				this_.removeClass('active');
			});
			this_.bind(touch_move,function(){
				this_.removeClass('active');
			});
		});
	});
};