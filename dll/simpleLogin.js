const { jvtc_post } = require('../utils/jvtc_request');
const { simpleLogin } = require('../apis/api');
const { parsCookies } = require('../utils/jvtc_pars');

const ClientPool = require('../bin/ClientPool');

const clientPool = new ClientPool({
  url: simpleLogin,
  name: "simpleLogin"
});

async function jvtc_fun ({ loginName, loginPwd }) {

  return new Promise(async (resolve, reject) => {
    const o = await clientPool.get();
    this.o = o;

    const args = {
      ...o.args,
      'Top1$UserName': loginName,
      'Top1$PassWord': loginPwd
    };
    args['Top1$StuLogin.x'] = ~~(Math.random() * 30);
    args['Top1$StuLogin.y'] = ~~(Math.random() * 30);

    jvtc_post(simpleLogin, { cookies: o.cookies, args }, (err, res) => {

      if (!res) {
        return reject(err)
      }
      const isLoginSuccess = res.header['set-cookie'];

      if (!isLoginSuccess) {
        const rx = /<script>alert\((.*?)\);?<\/script>/;
        const [, errmsg] = res.text.match(rx) || [];

        return reject(new Error(errmsg || '未知错误'));
      }
      const cookies = parsCookies(res.headers);

      this.o.cookies += cookies;

      resolve([null, 0]);
    });
  }).catch(err => {
    return [err, -1];
  })

}

module.exports = jvtc_fun;