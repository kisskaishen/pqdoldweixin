import $ from 'webpack-zepto';

module.exports=function(options,contents){
	$(document).ready(function(){
		//console.log(options.length);
		var pre = 0;
		options.each(function(){
			$(this).bind('click',function(){
				var this_= $(this);
				var cur = this_.index();
				if(pre == cur){
					return;
				};
				options.eq(pre).removeClass('active');
				contents.eq(pre).hide();
				this_.addClass('active');
				contents.eq(cur).show();
				pre = cur;
			});
		});
	});
};