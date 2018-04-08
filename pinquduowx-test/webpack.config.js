var webpack = require('webpack');
var path = require('path');
// NodeJS中的Path对象，用于处理目录的对象，提高开发效率。
// 模块导入
module.exports = {
    devtool: false,
    // 入口文件地址，不需要写完，会自动查找
    entry: {
        // // //首页
        home: './assets/home.js',
        // //排行榜
        // ranking: './assets/ranking.js',
        // //免单拼
        // prom_free: './assets/prom_free.js',
        // //探索
        // seek: './assets/seek.js',
        // //个人中心
        // user_center: './assets/user_center.js',
        // //产品详情
        // goods_detail: './assets/goods_detail.js',
        // //店铺详情
        // shop_detail: './assets/shop_detail.js',
        // //立即支付
        // to_pay: './assets/to_pay.js',
        // //新增收货地址
        // adr_add: './assets/adr_add.js',
        // //编辑收货地址
        // adr_edit: './assets/adr_edit.js',
        // //品质水果
        // qualityFruit: './assets/qualityFruit.js',
        // //9.9元专场
        // special99: './assets/special99.js',
        // //9.9专场列表页
        // special99_group: './assets/special99_group.js',
        // //海淘
        // haitao: './assets/haitao.js',
        // //海淘顶部生活馆分类
        // haitao_pavilion: './assets/haitao_pavilion.js',
        // //限时抢购
        // special_timed: './assets/special_timed.js',
        // //参团详情
        regiment: './assets/regiment.js',
        // // 家居优品
        // homeProducts:'./assets/homeProducts.js',
        // // 品牌清仓
        // brandClearance:'./assets/brandClearance.js',
        // //探索 商品列表
        // cat_page: './assets/cat_page.js',
        // //搜索页
        // goods_search: './assets/goods_search.js',
        // //搜索结果
        // goods_search_results: './assets/goods_search_results.js',
        // //我的搜藏
        // goods_collection: './assets/goods_collection.js',
        // //我的订单
        // goods_order: './assets/goods_order.js',
        // //订单详情
        // order_detail: './assets/order_detail.js',
        // //物流详情
        // logistics_detail: './assets/logistics_detail.js',
        // //我的拼团
        // my_prom: './assets/my_prom.js',
        // //我的免单
        // my_freeprom: './assets/my_freeprom.js',
        // //我的优惠券
        // coupon_group: './assets/coupon_group.js',
        // //我的消息
        // my_msg: './assets/my_msg.js',
        // //免单拼
        // free_group: './assets/free_group.js',
        // //省钱大法
        // save_money: './assets/save_money.js',
        // //免单拼钱款去向
        // money_direction: './assets/money_direction.js',
        // //售后
        // after_sales: './assets/after_sales.js',
        // //申请售后
        // after_sales_apply: './assets/after_sales_apply.js',
        // //帮助中心、常见问题
        // help: './assets/help.js',
        // //客服
        // customer: './assets/customer.js',
        // // 为我点赞
        likes:'./assets/likes.js',
        // // // 为我助力详情
        // my_likes: './assets/my_likes.js',
        // // //趣多严选
        // strict_selection:'./assets/strict_selection.js',
        // // 退差价入口1
        // refund_difference1:'./assets/refund_difference1.js',
        // // 退差价入口2
        // refund_difference2:'./assets/refund_difference2.js',
    },
    // 输出
    output: {
        path: './dist',
        // 文件地址，使用绝对路径形式
        publicPath: '/dist',
        filename: '[name].js'
    },
    // 服务器配置相关，自动刷新!
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true
    },
    // 加载器
    module: {
        // 加载器
        loaders: [
            // 解析.vue文件
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            // 转化ES6的语法
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            // 编译css并自动添加css前缀
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader!autoprefixer'
            },
            //.scss 文件想要编译，scss就需要这些东西！来编译处理
            //install css-loader style-loader sass-loader node-sass --save-dev
            {
                test: /\.scss$/,
                loader: 'style!css!sass?sourceMap'
            },
            // 图片转化，小于8K自动转化为base64的编码
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8192'
            },
            //html模板编译？
            {
                test: /\.(html|tpl)$/,
                loader: 'html-loader'
            },
        ]
    },
    // .vue的配置。需要单独出来配置
    vue: {
        loaders: {
            css: 'style!css!autoprefixer',
            html: 'html-loader',
            js: 'babel-loader'
        }
    },
    // 转化成es5的语法
    babel: {
        presets: ['es2015', 'stage-0'],
        // plugins: ['transform-runtime']
    },
    resolve: {
        // require时省略的扩展名，如：require('module') 不需要module.js
        extensions: ['', '.js', '.vue'],
        /**
         * Vue v2.x 之後 NPM Package 預設只會匯出 runtime-only 版本，若要使用 standalone 功能則需下列設定
         */
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
    // 开启source-map，webpack有多种source-map，在官网文档可以查到
    // devtool: 'eval-source-map'
};
