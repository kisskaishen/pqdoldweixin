/**
 * Created by xubanxian on 2017/8/3.
 */
import $ from 'webpack-zepto';
import Vue from 'vue';
import urlSearch from '../assets/urlSearch.js';
import cookie from '../assets/cookie.js';
import {get} from '../config/http'
import {post} from '../config/http'
import {payGet} from '../config/http'
import axios from 'axios'
var user_id =urlSearch('user_id')|| cookie.get('user_id');
var terminal = urlSearch('terminal') || 'wx';

new Vue({
    el: '#wrap',
    data: function(){
        return {
            listData: [],
            terminal:terminal,
            url:"",
            imgUrl:'',
            qrcode:''
        }
    },
    mounted: function(){
        var self_ = this;
        self_.getList()
    },
    methods: {
        getList: function(){
            var self_ = this;
            get('/GroupBuy/danList',{
                userid:user_id
            }).then(function(data){
                data=data.data;
                for (var i = 0; i < data.list.length; i++) {
                    var time =new Date(data.list[i].end_time*1000);
                    data.list[i].end_time=time.getMonth()+1+'月'+time.getDate()+'日'+time.getHours()+':'+time.getMinutes();
                }
                self_.listData=data.list;
            }).catch(function(error){
                console.log(error);
                console.log('请求失败')
            })
       /*     payGet('/GroupBuy/danList',{
                userid:user_id,
            },function (data) {
                data=data.data;
                for (var i = 0; i < data.list.length; i++) {
                    var time =new Date(data.list[i].end_time*1000);
                    data.list[i].end_time=time.getMonth()+1+'月'+time.getDate()+'日'+time.getHours()+':'+time.getMinutes();
                }
                self_.listData=data.list;
            })*/
            /*$.ajax({
                type:'get',
                url:'https://api.hn.pinquduo.cn/api_3_0_1/GroupBuy/danList/userid/'+user_id,
                //获取数据
                // dataType:'jsonp',
                // jsonp: 'jsoncallback',
                async:true,
                success:function(data){
                    // console.log(data);
                    for (var i = 0; i < data.list.length; i++) {
                        var time =new Date(data.list[i].end_time*1000);
                        data.list[i].end_time=time.getMonth()+1+'月'+time.getDate()+'日'+time.getHours()+':'+time.getMinutes();
                    }
                    self_.listData=data.list;
                    // console.log(self_.listData);
                },
                error: function(xhr,type){
                    console.log('Ajax error!');
                }
            });*/
        },
        // 拉取二维码
        getQrcode:function (id) {
            var self_=this;
            // post('https://wx.pinquduo.cn/wechat/qrcode.php',{
            //     user_id:user_id,
            //     groupbuyid:id
            // }).then(function(data){
            //     data=data.data;
            //     data=JSON.parse(data)
            //     self_.qrcode=data.address;
            //     self_.getShareImg()
            // }).catch(function(){
            //     console.log('请求失败')
            // })
            $.ajax({
                type:'POST',
                url:'https://wx.pinquduo.cn/wechat/qrcode.php',
                data:{
                    user_id:user_id,
                    groupbuyid:id
                },
                // dataType:'jsonp',
                // jsonp: 'jsoncallback',
                async:true,
                success:function(data){
                    data=JSON.parse(data)
                    self_.qrcode=data.address;
                    self_.share(id)
                }
            });
        },
        share:function (prom_id) {
            var self_=this;
            $('#loading').css('display','flex')
            console.log(prom_id);
            post('/Raisepic/raise_pic',{
                user_id:user_id,
                prom_id:prom_id,
                Qr_code:this.qrcode,
            }).then(function(data){
                data=data.data;
                $('#loading').css('display','none')
                self_.imgUrl=data.result.url;
                console.log(self_.imgUrl);
                self_.url= "'"+data.result.url+"'";
                $('#share').css('display','flex')
                $("body").on("touchmove",function(event){
                    event.preventDefault();
                }, false)
            }).catch(function(){
                console.log('请求失败')
            })
            /*$.ajax({
                type:'GET',
                url:'https://api.hn.pinquduo.cn/api_3_0_1/Raisepic/raise_pic',
                data:{
                    user_id:user_id,
                    prom_id:prom_id,
                },
                dataType:'jsonp',
                jsonp: 'jsoncallback',
                async:true,
                success:function(data){
                    $('#loading').css('display','none')
                    self_.imgUrl=data.result.url;
                    self_.url= "'"+data.result.url+"'";
                    $('#share').css('display','flex')
                    $("body").on("touchmove",function(event){
                        event.preventDefault();
                    }, false)
                }
            });*/
        }
    }
});





















