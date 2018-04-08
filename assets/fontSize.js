
import $ from 'webpack-zepto';
module.exports=function(){
	function IsPC() {
	    var userAgentInfo = navigator.userAgent;
	    var Agents = ["Android", "iPhone",
	                "SymbianOS", "Windows Phone",
	                "iPad", "iPod"];
	    var flag = true;
	    for (var v = 0; v < Agents.length; v++) {
	        if (userAgentInfo.indexOf(Agents[v]) > 0) {
	            flag = false;
	            break;
	        }
	    }
	    return flag;
	};
	var isPC = IsPC();
	$(document).ready(function(){
		var doc=document;
		var setFontSize=function(){
			var deviceWidth=doc.documentElement.clientWidth>=768?768:doc.documentElement.clientWidth;
			if(isPC){
				deviceWidth = 540;
			};
			document.body.style.width = deviceWidth+'px';
			doc.documentElement.style.fontSize=deviceWidth*10/320+'px';
		};
		setFontSize();
		$('#wrap').show();
		window.addEventListener('resize',setFontSize);
	});
};