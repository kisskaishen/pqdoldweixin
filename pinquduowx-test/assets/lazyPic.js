
// import $ from 'webpack-zepto';
// //图片懒加载
// module.exports = {
// 	lazy_delay: null,
// 	wd: $(window),
// 	startLoad: function(el){
// 		if(el[0].getBoundingClientRect().top<=this.wd.height()){
// 			el.attr('src',el.attr('data-src'));
// 			el.attr('lazy','loaded');
// 		};
// 	},
// 	initLoad: function(){
// 		var self_ = this;
// 		clearTimeout(self_.lazy_delay);
// 		self_.lazy_delay = setTimeout(function(){
// 			$("[lazy='true']").each(function(){
// 				var this_pic = $(this);
// 				self_.startLoad(this_pic);
// 			});
// 		},300);
// 	},
// 	scrollLoad: function(){
// 		var self_ = this;
// 		clearTimeout(self_.lazy_delay);
// 		self_.lazy_delay = setTimeout(function(){
// 			$("[lazy='true']").each(function(){
// 				var this_pic = $(this);
// 				self_.startLoad(this_pic);
// 			});
// 		},300);
// 	}
// };