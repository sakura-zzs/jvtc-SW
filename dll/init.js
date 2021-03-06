
const { jvtc_get } = require('../utils/jvtc_request');
const { parsCookies, parsArgs } = require('../utils/jvtc_pars');
const { init } = require('../apis/api');


async function jvtc_fun () {
  return new Promise((resolve, reject) => {
    console.time('INIT GET TIME')
    jvtc_get(init, { cookies: "", args: "", timeout: 1200 }, (err, res) => {
      console.timeEnd('INIT GET TIME')
      try {
        if (!res) {
          if (err && err.code == 'ECONNABORTED') {
            throw "学校服务器访问超时，重试几次无效请放弃";
          }
          throw err;
        }
        const { o } = this;

        o.cookies = parsCookies(res.headers)

        o.args = parsArgs(res.text);

        if (o.cookies && o.args) {
          resolve([null, 0]);
        } else {
          throw "失败";
        }
      } catch (error) {
        // console.log(error);
        reject(error);
      }
    });
  }).catch((error) => {
    return [error, null];
  })

}

module.exports = jvtc_fun;