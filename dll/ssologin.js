const { init } = require('../apis/api');

const ClientPool = require('../bin/ClientPool');
const sso = require('../bin/sso');

const clientPool = new ClientPool({
  url: init,
  name: "login"
});

async function jvtc_fun ({ loginName, loginPwd }) {
  const ssoCookies = await sso.init(loginName, loginPwd)

  // const { args, cookies } = await clientPool.get()

  // const newCookies = await sso.activeSwCookieBySsoCookie(cookies, ssoCookies)
  const newCookies = ssoCookies;
  const cookies = '';

  this.o = {
    args: {},
    cookies: [cookies, newCookies].join(';')
  }
}

module.exports = jvtc_fun;