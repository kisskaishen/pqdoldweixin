/**
 * Created by xubanxian on 2017/6/8.
 */
import $ from 'webpack-zepto';
import Vue from 'vue';
import cookie from '../assets/cookie.js';

import swiper from './swiper.min.js';
import sign from '../assets/sign.js';
import urlSearch from '../assets/urlSearch.js';
import {get} from '../config/http'
import {post} from '../config/http'

import oauth_login from '../assets/oauth_login.js';

if (!user_id) {
    console.log(1);
    oauth_login("page_name=likes");
}
console.log(user_id);
var user_id = urlSearch('user_id') || cookie.get('user_id') || undefined;
var openid = urlSearch('openid') || cookie.get('openid') || 0;//获取微信/qq openid
var head_pic = urlSearch('head_pic') || cookie.get('head_pic');
var terminal = urlSearch('terminal') || 'wx';
var group_id = urlSearch('group_id') || '';
// 登陆

var selected_adr = {
    //选中的详细地址
    province: '',
    city: '',
    area: ''
};
var hint_timer = null;
function isWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    console.log(ua);//mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}

new Vue({
    el: '#wrap',
    data: function () {
        return {
            // 广告
            banner_img: '',
            //商品列表
            goodsList: [],
            //加载提示
            load_hint: '',
            //是否上拉加载
            isloadmore: true,
            //加载分页
            page: 1,
            //每页条目
            pagesize: 20,
            // 热销商品
            hot_goods: [],
            // 滚动消息数据
            scroll_data: [],
            // 地址列表
            data: [],
            goods_info: 0,
            qrcode: '',
            goods_img: '',
            goods_name: '',
            market_price: '',
            share_src: '',
            terminal: terminal,
            user_id: user_id,
            url: "",
            imgUrl: '',
            // 地址
            city: '',
            district: '',
            address: '',
            provinceOptions: [],
            cityOptions: [],
            districtOptions: [],

            //新版地址
            dialogCtr: '',
            consignee: '',
            mobile: '',
            province: '请选择',
            city: '请选择',
            district: '请选择',
            provinceId: 0,
            cityId: 0,
            districtId: 0,
            address: '',
            selectorActive: 'provinceOptions',
            provinceOptions: [],
            cityOptions: [],
            districtOptions: [],
            area: '选择地区',


            newCodeImg: 'https://z.pinquduo.cn/api_3_0_1/raisepic/captcha?user_id=' + this.user_id,          // 新人图形验证码
            code: '',
            groupId: group_id,            // 团id，true则显示新人验证，否则没有
            resMsg: '',
            userInfoType: '',

            specGoodsInfo:'',
            specData:[],
            specShow:false,
            currentIndex:0,
            current2Index:0,
            currentIndexId:'',
            current2IndexId:'',

            spec_key_obj:'',
            
        }
    },

    mounted: function () {


        var self_ = this;

        var qs = sign.sign({
            page: self_.page,
            pagesize: self_.pagesize,
            ajax_get: 1,
            version: '2.0.2',
        });
        if(isWeiXin()){

        }else {
            let u = navigator.userAgent
            if (u.indexOf('iPhone') > -1 ) {
                self_.userInfoType = getAppUserInfo().terminal
                self_.terminal = getAppUserInfo().terminal
                self_.user_id = getAppUserInfo().userId
                if (!self_.user_id) {
                    showAppLoginView()
                }
            } else {
                self_.userInfoType = JSON.parse(webview.getAppUserInfo()).terminal
                self_.terminal = JSON.parse(webview.getAppUserInfo()).terminal
                self_.user_id = JSON.parse(webview.getAppUserInfo()).userId
                if (!self_.user_id) {
                    webview.showAppLoginView()
                }
            }
        }


        // 页面信息包括列表和banner图片
        post('/index/getThe_raise', {
            userid: self_.user_id,
        }).then(function (data) {
            data = data.data,
                $('#loading-dialog').hide()
            self_.banner_img = data.result.banner.ad_code;
            self_.goodsList = data.result.raisegoods;
            hint_timer = setTimeout(function () {
                $('#hint-dialog').hide();
            }, 1000);
            if (self_.groupId) {
                self_.show()
            } else {
                self_.hide()
            }
        }).catch(function () {
            console.log('请求失败')
        })

        get('Area/areaList', {}).then(function (data) {
            console.log(data.data);
            self_.provinceOptions = data.data.result.items
        })
        // 获取滚动数据
        get('/index/rolling', {})
            .then(function (data) {
                data = data.data
                self_.scroll_data = data.result;
                self_.$nextTick(function () {
                    var mySwiper = new Swiper('.swiper-container', {
                        autoplay: 2000,//可选选项，自动滑动
                        direction: 'vertical',
                        loop: true,
                    })
                });
            }).catch(function () {
            console.log('请求失败')
        })

    },

    methods: {
        // 点击刷新
        refleshCode: function () {
            location.reload()
        },
        //为我助力开团,显示规格选择框
        prom_like: function (index) {
            var _this = this
            // this.share_dialog=true;
            _this.goods_info = index;
            post('Goods/get_spec_goods_price',{
                goods_id:_this.goodsList[_this.goods_info].goods_id
            })
                .then(function(res){
                    if (res.data.status == '1') {

                        _this.specGoodsInfo = res.data.result
                        _this.specData = res.data.result.filter_spec
                        _this.currentIndexId = res.data.result.filter_spec[0].items[0].item_id
                        $('#spec_dialog_bg').show()
                        if (res.data.result.filter_spec.length>1) {
                            _this.current2IndexId = res.data.result.filter_spec[1].items[0].item_id
                            _this.spec_key_obj = _this.currentIndexId +'_'+_this.current2IndexId
                        } else {
                            _this.current2IndexId = ''
                            _this.spec_key_obj = _this.currentIndexId
                        }
                    }
                })
                .catch(function(err) {
                    console.log(err)
                })
            _this.specShow = true
        },
        //closeSpecDiolog
        closeSpecDiolog() {
            this.specShow = false
        },

        specClick:function(val,index) {
            this.currentIndex = index
            this.currentIndexId = val.item.id
        },
        spec2Click:function(val,index) {
            this.current2Index = index
            this.current2IndexId = val.item.id

        },
        buyNow:function() {
            this.select_address()
            this.specShow = false
            
        },
        //选择地址
        select_address: function () {
            $('body').css('height', '20rem')
            $('#address_select_dialog').css('display', 'block')
            // 解决滚动穿透
            this.ModalHelper('modal-open').afterOpen();
            // 拉取地址列表
            this.get_Address();

        },
        //获取地址列表
        get_Address: function () {
            if (!this.user_id) {
                return;
            }
            ;
            var self_ = this;
            $('#loading-dialog').show();
            post('/goods/getUserAddressList', {
                user_id: self_.user_id
            }).then(function (data) {
                data = data.data
                self_.data = data.result.address;
            }).catch(function () {
                console.log('请求失败')
            })

        },
        //新增地址
        add_address: function () {
            // console.log(111);
            this.ModalHelper('modal-open').afterOpen();
            $('#address_select_dialog').css('display', 'none')
            // this.address_select_dialog=false;
            // this.add_address_dialog=true;
            $('#add_address_dialog').css('display', 'flex')
            this.dialogCtr = 'adrEditorDialog'
        },
        show_adr_dialog: function () {//显示地址选择
            $('#adr-dialog').show();
            $('.adr-group').children()[0].click()
        },
        saveAddress: function (id) {
            let self_ = this
            if (!id) {
                id = '';
            }
            if (this.consignee == '') {
                $('#hint-dialog').find('p').text('请填写收货人');
                $('#hint-dialog').show();
                hint_timer = setTimeout(function () {
                    $('#hint-dialog').hide();
                }, 1000);
                return
            }
            if (this.mobile == '' || !/^1[34578]\d{9}$/.test(this.mobile)) {
                $('#hint-dialog').find('p').text('请填写正确手机号码');
                $('#hint-dialog').show();
                hint_timer = setTimeout(function () {
                    $('#hint-dialog').hide();
                }, 1000);
                return
            }
            if (this.area == '请选择地区') {
                $('#hint-dialog').find('p').text('请选择收货地区');
                $('#hint-dialog').show();
                hint_timer = setTimeout(function () {
                    $('#hint-dialog').hide();
                }, 1000);
                return
            }
            if (this.address == '') {
                $('#hint-dialog').find('p').text('请填写详细地址');
                $('#hint-dialog').show();
                hint_timer = setTimeout(function () {
                    $('#hint-dialog').hide();
                }, 1000);
                return
            }
            post('goods/addEidtAddress', {
                user_id: self_.user_id,
                address_id: '',
                address_base: '',
                default: '',
                address: self_.address,
                mobile: self_.mobile,
                consignee: self_.consignee,
                province: self_.provinceId,
                city: self_.cityId,
                district: self_.districtId
            }).then(function (data) {
                console.log('保存成功', data.data);
                if (data.data.status == 1) {
                    self_.dialogCtr = ''
                    self_.prom_buy(data.data.result.id)
                }
            })
        },
        clearData: function () {
            console.log('清除成功');
            let self_ = this
            self_.consignee = ''
            self_.mobile = ''
            self_.area = ''
            self_.address = ''
            self_.provinceId = 0
            self_.cityId = 0
            self_.districtId = 0
            self_.province = '请选择'
            self_.city = '请选择'
            self_.district = '请选择'
            self_.area = '选择地区'
            self_.selectorActive = 'provinceOptions'
        },
        // 选择收货地址
        select_add: function (index) {
            $('#address_select_dialog').css('display', 'none')
            $('body').css('height', 'auto')
            $('#loading').css('display', 'flex')
            this.prom_buy(this.data[index].address_id);
        },
        // 为我点赞开团
        prom_buy: function (address_id) {
            // console.log(this.goods_info);
            var self_ = this;
            if (self_.specData.length>1) {
                self_.spec_key_obj = self_.currentIndexId +'_'+self_.current2IndexId
            } else {
                self_.spec_key_obj = self_.currentIndexId
            }
            post('/Purchase/getBuy', {
                goods_id: self_.goodsList[self_.goods_info].goods_id,
                user_id: self_.user_id,
                num: 1,
                spec_key: self_.spec_key_obj,
                // spec_key: self_.goodsList[self_.goods_info].spec_key,
                address_id: address_id,
                type: 1,
                openid: openid,
                code: 'weixin',
            }).then(function (data) {
                data = data.data
                if (data.status != -1) {
                    $('body').css('height', 'auto');
                    $('#add_address_dialog').css('display', 'none')
                    self_.group_id = data.result.group_id;
                    self_.getQrcode(data.result.group_id)
                } else {
                    $('#loading').css('display', 'none');
                    self_.ModalHelper('modal-open').beforeClose();
                    if (self_.terminal != 'wx') {
                        $('#uploadClose').css('display', 'flex');
                        $('#uploadClose').click();
                        $('#uploadClose').css('display', 'none');
                    }
                    $('#hint-dialog').find('p').text(data.msg);
                    $('#hint-dialog').show();
                    hint_timer = setTimeout(function () {
                        $('#hint-dialog').hide();
                    }, 2000);
                }
            }).catch(function () {
                console.log('请求失败')
            })
        },
        // 拉取二维码
        getQrcode: function (id) {
            var self_ = this;
            $.ajax({
                type: 'POST',
                url: 'https://wx.pinquduo.cn/wechat/qrcode.php',
                data: {
                    user_id: self_.user_id,
                    groupbuyid: id
                },
                // dataType:'jsonp',
                // jsonp: 'jsoncallback',
                async: true,
                success: function (data) {
                    data = JSON.parse(data)
                    self_.qrcode = data.address;
                    self_.getShareImg()
                }
            });
        },
        // 拉取分享图片
        getShareImg: function () {
            console.log('pic');
            var self_ = this;
            this.url = "'" + this.qrcode + "'";
            get('/Raisepic/raise_pic', {
                user_id: self_.user_id,
                prom_id: this.group_id,
                Qr_code: this.qrcode,
            }).then(function (data) {
                data = data.data;
                console.log('拉取图片成功');
                $('#loading').css('display', 'none')
                self_.imgUrl = data.result.url;
                self_.url = "'" + data.result.url + "'";
                $('#share_dialog').css('display', 'flex')
                $("body").addEventListener("touchmove", function (event) {
                    event.preventDefault();
                }, false)
            }).catch(function () {
                console.log('请求失败')
            })
        },

        // 继续分享直接加载二维码图片
        get_qrcode: function (id) {
            var self_ = this;
            $.ajax({
                type: 'POST',
                url: 'https://wx.pinquduo.cn/wechat/qrcode.php',
                data: {
                    user_id: self_.user_id,
                    groupbuyid: id
                },
                async: true,
                success: function (data) {
                    data = JSON.parse(data)
                    self_.qrcode = data.address;
                    self_.share(id)
                }
            });
        },

        // 分享给朋友或朋友圈
        share: function (prom_id) {
            var self_ = this;
            $('#loading').css('display', 'flex')
            post('/Raisepic/raise_pic', {
                user_id: self_.user_id,
                prom_id: prom_id,
                Qr_code: this.qrcode,
            }).then(function (data) {
                data = data.data;
                $('#loading').css('display', 'none')
                self_.imgUrl = data.result.url;
                self_.url = "'" + data.result.url + "'";
                $('#share_dialog').css('display', 'flex')

                self_.ModalHelper('modal-open').afterOpen();

            }).catch(function () {
                console.log('请求失败')
            })
        },
        selectAddClose: function () {
            $('body').css('height', 'auto');
            // console.log($('body'));
            $('#address_select_dialog').css('display', 'none')
            this.ModalHelper('modal-open').beforeClose();
        },
        addAddressClose: function () {
            $('#add_address_dialog').css('display', 'none')
            this.ModalHelper('modal-open').beforeClose();
        },

        // submitNew
        submitNew:function() {
            $.ajax({
                type: 'GET',
                url: 'https://z.pinquduo.cn/api_3_0_1/raisepic/captcha_verify/group_id/' + this.groupId + '/user_id/' + this.user_id + '/captcha/' + this.code,
                data: '',
                async: true,
                success: function (res) {
                    var data = JSON.parse(res)
                    if (data.status == 1) {
                        alert(data.msg)
                        location.href = 'https://wx.pinquduo.cn/redBao.html'
                    } else {
                        alert(data.msg)

                    }
                }
            });
        },
        // 滚动穿透
        ModalHelper: function (bodyCls) {

            var scrollTop;
            return {
                afterOpen: function () {
                    scrollTop = document.querySelector('#wrap').scrollTop;
                    document.querySelector('#wrap').classList.add(bodyCls);
                    document.querySelector('#wrap').style.top = -scrollTop + 'px';
                },
                beforeClose: function () {
                    document.querySelector('#wrap').classList.remove(bodyCls);
                    // scrollTop lost after set position:fixed, restore it back.
                    document.querySelector('#wrap').scrollTop = scrollTop;
                }
            };
        },
        // app获取用户信息
        // getAppUserInfo:function() {
        //     console.log('getappuserinfo')
        //     this.user_id = getAppUserInfo().user_id
        // }
        closeImg() {
            $('#share_dialog').hide()
        }
    },
    watch: {
        provinceId(val) {
            let self_ = this;
            get('Area/areaList', {
                parent_id: val,
            }).then(function (data) {
                self_.cityOptions = [];
                self_.city = '请选择'
                self_.district = '请选择'
                self_.cityOptions = data.data.result.items
            })

        },
        cityId(val) {
            let self_ = this;
            get('Area/areaList', {
                parent_id: val,
            }).then(function (data) {
                self_.districtOptions = [];
                self_.district = '请选择'
                self_.districtOptions = data.data.result.items
            })

        },
        districtId() {
            let self_ = this
            self_.districtOptions.forEach(function (item, index) {
                if (item.region_id == self_.districtId) {
                    self_.district = item.region_name;
                }
            })

        },
        dialogCtr:function(val) {
            if (val == '') {
                this.clearData()
                // console.log('隐藏');
                $('#add_address_dialog').css('display', 'none')
                this.ModalHelper('modal-open').beforeClose();
            } else {
                console.log('显示');
                $('#add_address_dialog').css('display', 'flex')
            }
        }
    }
});

