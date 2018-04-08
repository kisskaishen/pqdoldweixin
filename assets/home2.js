// //第三方登录
alert('加载前')


import $ from 'webpack-zepto';
import Vue from 'vue';





new Vue({
    el: '#wrap',
    data: function() {
        return {
            topData:[],
        }
    },
    created() {
        this.get_header_data()
    },
    // mounted: function() {
    //    this.get_header_data()
    // },
    methods: {
        //获取首页顶部菜单
        get_header_data: function() {
            var self_ = this;
            $.ajax({
                type: 'GET',
                url: 'https://pinquduo.cn/api_3_0_1/index/getexplore?ajax_get=1&version=2.0.0', //获取首页数据
                dataType: 'jsonp',
                jsonp: 'jsoncallback',
                async: true,
                success: function(data) {
                    alert(111)
                    self_.topData = data.result.cat
                    alert(data.status)
                    alert(333)
                },
                error: function(xhr, type) {
                    console.log('Ajax error!');
                }
            });
        }
        
     }
});
alert('执行后')