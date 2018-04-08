;(function(global,undefined) {
	global.md5Sign = {
		sortedKeys: function(argObj){
			var arr = [];
			for (var k in argObj) {
				if (arr.length == 0) {
					arr.push(k);
				} else {
					var i;
					for (i=arr.length-1; i>=0; i--) {
						if (arr[i] <= k) {
							break;
						}
					}
					arr.splice(i+1, 0, k);
				}
			}

			return arr;
		},
		joinParams: function(argObj){
			var argKeys = this.sortedKeys(argObj);
			var arr = [];
			for(var i=0; i<argKeys.length; i++) {
				arr.push(argKeys[i] + '=' + argObj[argKeys[i]]);
			}

			return arr.join('&');
		},
		sign: function(argObj, sig){
			if(sig == undefined) {
				sig = 'pinquduo_sing';
			}
			var s = this.joinParams(argObj);
			var md5Sign = md5(s + '&sig=' + sig);
			return s + '&sig=' + md5Sign;
		},
		signUrl: function(url){
			var parts = url.split("?", 2);
			var path = parts[0];
			var params = {};
			var paramsArr = parts[1].split("&");
			for(var i=0; i<paramsArr.length; i++) {
				var kv = paramsArr[i].split("=", 2);
				params[kv[0]] = kv[1];
			}
			return path + '?' + this.sign(params);
		}
	}
})(window);
