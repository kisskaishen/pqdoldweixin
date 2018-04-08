/**
 * git do not control webim.config.js
 * everyone should copy webim.config.js.demo to webim.config.js
 * and have their own configs.
 * In this way , others won't be influenced by this config while git pull.
 *
 */
// var WebIM = {};
// WebIM.config = {
//     /*
//      * XMPP server
//      */
//     xmppURL: 'im-api.easemob.com',
//     /*
//      * Backend REST API URL
//      */
//     apiURL: (location.protocol === 'https:' ? 'https:' : 'http:') + '//a1.easemob.com',
//     /*
//      * Application AppKey
//      */
//     appkey: 'easemob-demo#chatdemoui',
//     /*
//      * Whether to use wss
//      * @parameter {Boolean} true or false
//      */
//     https: false,
//     /*
//      * isMultiLoginSessions
//      * true: A visitor can sign in to multiple webpages and receive messages at all the webpages.
//      * false: A visitor can sign in to only one webpage and receive messages at the webpage.
//      */
//     isMultiLoginSessions: false,
//     /*
//      * Set to auto sign-in
//      */
//     isAutoLogin: false,
//     /**
//      * Whether to use window.doQuery()
//      * @parameter {Boolean} true or false
//      */
//     isWindowSDK: false,
//     /**
//      * isSandBox=true:  xmppURL: 'im-api-sandbox.easemob.com',  apiURL: '//a1-sdb.easemob.com',
//      * isSandBox=false: xmppURL: 'im-api.easemob.com',          apiURL: '//a1.easemob.com',
//      * @parameter {Boolean} true or false
//      */
//     isSandBox: false,
//     /**
//      * Whether to console.log in strophe.log()
//      * @parameter {Boolean} true or false
//      */
//     isDebug: false,
//     /**
//      * will auto connect the xmpp server autoReconnectNumMax times in background when client is offline.
//      * won't auto connect if autoReconnectNumMax=0.
//      */
//     autoReconnectNumMax: 2,
//     /**
//      * the interval secons between each atuo reconnectting.
//      * works only if autoReconnectMaxNum >= 2.
//      */
//     autoReconnectInterval: 2,
//     /**
//      * webrtc supports WebKit and https only
//      */
//     isWebRTC: /WebKit/.test(navigator.userAgent) && /^https\:$/.test(window.location.protocol),
//     /**
//      * after login, send empty message to xmpp server like heartBeat every 45s, to keep the ws connection alive.
//      */
//     heartBeatWait: 4500,
//     /**
//      * while http access,use ip directly,instead of ServerName,avoiding DNS problem.
//      */
//     isHttpDNS: false
// };
var WebIM = {};
WebIM.config = {
    // /*
    //  * XMPP server
    //  */
    // xmppURL: 'im-api.easemob.com',
    // /*
    //  * Backend REST API URL
    //  */
    // apiURL: 'http://a1.easemob.com',
    // /*
    //  * Application AppKey
    //  */
    // appkey: 'chengzi#pingquduo',
    // /*
    //  * Whether to use HTTPS
    //  * @parameter {Boolean} true or false
    //  */
    // https: false,
    // /*
    //  * isMultiLoginSessions
    //  * true: A visitor can sign in to multiple webpages and receive messages at all the webpages.
    //  * false: A visitor can sign in to only one webpage and receive messages at the webpage.
    //  */
    // isMultiLoginSessions: false,
    // /*
    //  * Set to auto sign-in
    //  */
    isAutoLogin: true,

    xmppURL: 'im-api.easemob.com',            // xmpp Server地址，对于在console.easemob.com创建的appKey，固定为该值

    apiURL: 'http://a1.easemob.com',          // rest Server地址，对于在console.easemob.com创建的appkey，固定为该值

    appkey: 'chengzi#pingquduo',        // App key

    https : false,                            // 是否使用https

    isMultiLoginSessions: true,              // 是否开启多页面同步收消息

    isAutoLogin: true,                        // 自动出席，（如设置为false，则表示离线，无法收消息，需要在登录成功后手动调用conn.setPresence()才可以收消息）

    isDebug: false,                           // 打开调试，会自动打印log，在控制台的console中查看log

    autoReconnectNumMax: 2,                   // 断线重连最大次数

    autoReconnectInterval: 2,                 // 断线重连时间间隔

    heartBeatWait: 4500                       // 使用webrtc（视频聊天）时发送心跳包的时间间隔，单位ms
};
