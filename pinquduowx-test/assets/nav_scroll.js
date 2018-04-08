
//导航触屏滑动
import $ from 'webpack-zepto';
import swiper from './swiper.min.js';
module.exports= function(wrapId,innit_index){
    var pre=innit_index||0;
    var swiper = new Swiper(wrapId, {
        slidesPerView: 'auto',
        paginationClickable: true,
        spaceBetween:0,
        observer:true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents:true,//修改swiper的父元素时，自动初始化swiper
        freeMode: true
    });
    var tap='ontouchstart' in document?'touchstart':'mousedown';
    var items=$(wrapId).find('.swiper-slide');
    var pre=innit_index||0;
    var window_width=$(document).width();
    var pageX;
    items.eq(innit_index||0).addClass('active');
    $(window).bind('resize',function(){
        window_width=$(document).width();
    });
    items.each(function(){
        var this_=$(this);
        this_.bind(tap,function(e){
            var touchPoint='ontouchstart' in document?e.targetTouches[0]:e;
            pageX=touchPoint.pageX;
        });
        this_.bind('click',function(){
            if(this_.hasClass('active')){
                return;
            };
            var cur=this_.index();
            items.eq(pre).removeClass('active');
            this_.addClass('active');
            if(pageX>window_width/2){
                swiper.slideNext(); 
            }else if(pageX<window_width/2){
                swiper.slidePrev();
            };
            pre=cur;
        });
    });
}

 



