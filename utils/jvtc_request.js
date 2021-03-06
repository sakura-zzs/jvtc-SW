
let superagent = require('superagent');
const charset = require("superagent-charset");
// const nocache = require('superagent-no-cache');
superagent = charset(superagent); //设置字符

function toError (fn) {
	return function (req, res) {
		const rex = /window\.top\.location='\.\.\/UserLogin\.html'/;
		if (res && rex.test(res.text)) {
			fn.errmsg = '登录超时'
		}
		fn && fn(req, res);
	}
}

function jvtc_post (url, { cookies, args }, fn) {
	// console.log('args',args);
	superagent.post(url)
		.timeout(6 * 1000)
		.set('Cookie', cookies)
		// .type("form")
		// .use(nocache)
		.buffer(true)
		.redirects(0)
		.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36")
		.set("Referer", "http://xz.jvtc.jx.cn/JVTC_XG/UserLogin.html")
		.set('Content-Type', "application/x-www-form-urlencoded")
		.send(args)
		.charset()
		.end(toError(fn))
}

function jvtc_get (url, { cookies = '', timeout } = {}, fn) {

	superagent.get(url)
		.set('Cookie', cookies)
		.timeout(timeout || 6 * 1000)
		// // 
		// .type("form")
		// .use(nocache)
		.buffer(true)
		.charset()
		// .redirects(0)
		.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36")
		.set("Referer", "http://xz.jvtc.jx.cn/JVTC_XG/UserLogin.html")
		// .set('Content-Type', "application/x-www-form-urlencoded")
		// .send(args)
		.end(toError(fn))
}

module.exports = {
	jvtc_get,
	jvtc_post
}