webpackJsonp([28],{Djtq:function(e,i,t){"use strict";function n(e){t("rR32")}Object.defineProperty(i,"__esModule",{value:!0});var o=t("UCV6"),r=t("pYHS"),A=t("Z0/y"),a=n,s=A(o.a,r.a,!1,a,null,null);i.default=s.exports},UCV6:function(e,i,t){"use strict";var n=t("yclV");i.a={name:"Negotiation",data:function(){return{userId:t.i(n.a)("user_id"),data:[]}},mounted:function(){this.getData()},methods:{getData:function(){var e=this;this.http("get","user/order_service_history",{user_id:this.userId,order_id:this.$route.query.orderId},function(i){console.log(i),e.data=i.result.service_history})},formatDate:function(e){return new Date(1e3*e).toLocaleString().replace(/\//g,"-").replace("上午","").replace("下午","")}}}},pYHS:function(e,i,t){"use strict";var n=function(){var e=this,i=e.$createElement,t=e._self._c||i;return t("div",{staticClass:"Negotiation"},e._l(e.data,function(i){return t("div",{},[t("div",{staticClass:"roler"},[t("span",[t("img",{attrs:{src:i.operate_role_info.role_logo,alt:""}})]),e._v(" "),t("p",[t("span",[e._v(e._s(i.operate_role_info.role_name))]),e._v(" "),t("span",[e._v(e._s(e.formatDate(i.create_time)))])])]),e._v(" "),i.operate_title?t("p",{staticClass:"title"},[e._v(e._s(i.operate_title))]):e._e(),e._v(" "),i.operate_type_str?t("div",{staticClass:"item"},[t("span",[e._v("\n        回复\n      ")]),e._v(" "),t("p",[e._v(e._s(i.operate_type_str))])]):e._e(),e._v(" "),i.shipping_name?t("div",{staticClass:"item"},[t("span",[e._v("\n        物流公司\n      ")]),e._v(" "),t("p",[e._v(e._s(i.shipping_name))])]):e._e(),e._v(" "),i.shipping_order?t("div",{staticClass:"item"},[t("span",[e._v("\n        物流单号\n      ")]),e._v(" "),t("p",[e._v(e._s(i.shipping_order))])]):e._e(),e._v(" "),i.service_type?t("div",{staticClass:"item"},[t("span",[e._v("\n        类型\n      ")]),e._v(" "),t("p",[e._v(e._s(i.service_type))])]):e._e(),e._v(" "),i.return_money?t("div",{staticClass:"item"},[t("span",[e._v("\n        金额\n      ")]),e._v(" "),t("p",[e._v(e._s(i.return_money))])]):e._e(),e._v(" "),i.reason?t("div",{staticClass:"item"},[t("span",[e._v("\n        原因\n      ")]),e._v(" "),t("p",[e._v(e._s(i.reason))])]):e._e(),e._v(" "),i.description?t("div",{staticClass:"item"},[t("span",[e._v("\n        说明\n      ")]),e._v(" "),t("p",[e._v(e._s(i.description))])]):e._e(),e._v(" "),i.proof_imgs?t("div",{staticClass:"item imgs"},[t("span"),e._v(" "),t("p",e._l(i.proof_imgs,function(e){return t("img",{attrs:{src:e,alt:""}})}))]):e._e()])}))},o=[],r={render:n,staticRenderFns:o};i.a=r},rR32:function(e,i,t){var n=t("ySYq");"string"==typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);t("FIqI")("d939070e",n,!0,{})},ySYq:function(e,i,t){i=e.exports=t("XLS9")(!0),i.push([e.i,".Negotiation>div{margin-top:.15rem;padding:.34rem .69rem .35rem .37rem;background-color:#fff}.Negotiation>div .roler{margin-bottom:.35rem}.Negotiation>div .roler,.Negotiation>div .roler>span{display:-webkit-box;display:-ms-flexbox;display:flex;height:.65rem}.Negotiation>div .roler>span{width:.65rem;border-radius:50%;overflow:hidden;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.Negotiation>div .roler>span img{width:100%}.Negotiation>div .roler p{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;height:100%}.Negotiation>div .roler p span:first-child{font-size:.32rem;color:#313131;line-height:.32rem}.Negotiation>div .roler p span:last-child{font-size:.26rem;color:#aeaeae;line-height:.26rem}.Negotiation>div>p{font-size:.28rem;color:#292929}.Negotiation>div .item{display:-webkit-box;display:-ms-flexbox;display:flex}.Negotiation>div .item span{width:1.4rem;font-size:.28rem;color:#292929}.Negotiation>div .item p{width:5.2rem;font-size:.28rem;color:#292929}.Negotiation>div .imgs{margin-top:.2rem}.Negotiation>div .imgs p img{height:1.24rem;width:1.24rem;border-radius:.05rem;margin-right:.14rem}","",{version:3,sources:["/Users/qwk/Desktop/old-weixin/src/page/Negotiation/Negotiation.vue"],names:[],mappings:"AACA,iBACE,kBAAmB,AACnB,oCAAqC,AACrC,qBAAuB,CACxB,AACD,wBAKI,oBAAsB,CACzB,AACD,qDANI,oBAAqB,AACrB,oBAAqB,AACrB,aAAc,AACd,aAAe,CAiBlB,AAdD,6BAEM,aAAc,AACd,kBAAmB,AACnB,gBAAiB,AAIjB,wBAAyB,AACrB,qBAAsB,AAClB,uBAAwB,AAChC,yBAA0B,AACtB,sBAAuB,AACnB,kBAAoB,CACjC,AACD,iCACQ,UAAY,CACnB,AACD,0BACM,oBAAqB,AACrB,oBAAqB,AACrB,aAAc,AACd,4BAA6B,AAC7B,6BAA8B,AAC1B,0BAA2B,AACvB,sBAAuB,AAC/B,yBAA0B,AACtB,sBAAuB,AACnB,8BAA+B,AACvC,WAAa,CAClB,AACD,2CACQ,iBAAkB,AAClB,cAAe,AACf,kBAAoB,CAC3B,AACD,0CACQ,iBAAkB,AAClB,cAAe,AACf,kBAAoB,CAC3B,AACD,mBACI,iBAAkB,AAClB,aAAe,CAClB,AACD,uBACI,oBAAqB,AACrB,oBAAqB,AACrB,YAAc,CACjB,AACD,4BACM,aAAc,AACd,iBAAkB,AAClB,aAAe,CACpB,AACD,yBACM,aAAc,AACd,iBAAkB,AAClB,aAAe,CACpB,AACD,uBACI,gBAAkB,CACrB,AACD,6BACM,eAAgB,AAChB,cAAe,AACf,qBAAsB,AACtB,mBAAqB,CAC1B",file:"Negotiation.vue",sourcesContent:["\n.Negotiation > div {\n  margin-top: .15rem;\n  padding: .34rem .69rem .35rem .37rem;\n  background-color: #fff;\n}\n.Negotiation > div .roler {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    height: .65rem;\n    margin-bottom: .35rem;\n}\n.Negotiation > div .roler > span {\n      height: .65rem;\n      width: .65rem;\n      border-radius: 50%;\n      overflow: hidden;\n      display: -webkit-box;\n      display: -ms-flexbox;\n      display: flex;\n      -webkit-box-pack: center;\n          -ms-flex-pack: center;\n              justify-content: center;\n      -webkit-box-align: center;\n          -ms-flex-align: center;\n              align-items: center;\n}\n.Negotiation > div .roler > span img {\n        width: 100%;\n}\n.Negotiation > div .roler p {\n      display: -webkit-box;\n      display: -ms-flexbox;\n      display: flex;\n      -webkit-box-orient: vertical;\n      -webkit-box-direction: normal;\n          -ms-flex-direction: column;\n              flex-direction: column;\n      -webkit-box-pack: justify;\n          -ms-flex-pack: justify;\n              justify-content: space-between;\n      height: 100%;\n}\n.Negotiation > div .roler p span:first-child {\n        font-size: .32rem;\n        color: #313131;\n        line-height: .32rem;\n}\n.Negotiation > div .roler p span:last-child {\n        font-size: .26rem;\n        color: #AEAEAE;\n        line-height: .26rem;\n}\n.Negotiation > div > p {\n    font-size: .28rem;\n    color: #292929;\n}\n.Negotiation > div .item {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n}\n.Negotiation > div .item span {\n      width: 1.4rem;\n      font-size: .28rem;\n      color: #292929;\n}\n.Negotiation > div .item p {\n      width: 5.2rem;\n      font-size: .28rem;\n      color: #292929;\n}\n.Negotiation > div .imgs {\n    margin-top: .2rem;\n}\n.Negotiation > div .imgs p img {\n      height: 1.24rem;\n      width: 1.24rem;\n      border-radius: .05rem;\n      margin-right: .14rem;\n}\n"],sourceRoot:""}])}});
//# sourceMappingURL=28.822eb68314210886464b.js.map