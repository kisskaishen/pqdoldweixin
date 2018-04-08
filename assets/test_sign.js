var sign = require('../assets/sign');

var obj = {
	a: 3,
	f: 6,
	b: 4,
	g: 2
};

console.log(sign.sortedKeys(obj));
console.log(sign.joinParams(obj));
console.log(sign.sign(obj));

var url = "https://z.pinquduo.cn/api_3_0_1/index?a=1&b=2";

console.log(sign.signUrl(url));