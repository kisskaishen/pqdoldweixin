// 需要引用swiper.js
//焦点图

import swiper from './swiper.min.js';
module.exports= function(wrapId){
    var swiper = new Swiper(wrapId, {
        pagination: wrapId+' .swiper-pagination',
        speed:300,
        autoplay:3000,
        observer:true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents:true,//修改swiper的父元素时，自动初始化swiper
        autoplayDisableOnInteraction:false,
        click:true,
        loop:true,
        paginationClickable: true
    });
}

 



