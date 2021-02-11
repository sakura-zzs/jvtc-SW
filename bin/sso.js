const superagent = require('superagent');
const cookie = require('cookie');
const cheerio = require('cheerio');
const configs = require('../ocr.config');
const AiCode = require('./AiCode');
const ClientPool = require('./ClientPool');

const ocr = new AiCode({ debug: process.env.APP_ENV == 'development' })


const getCookies = (cookies) => {
  return cookies.map(item => cookie.parse(item)).reduce((pv, cv) => {
    pv = {
      ...pv,
      ...cv
    }
    return pv;
  }, {})
}

// 初始化数据
const getInitData = () => {
  return new Promise((resolve, reject) => {
    superagent.get('http://sso.jvtc.jx.cn/cas/login')
      .set('Accept-Language', 'zh-cn')
      .send()
      .redirects(0)
      .end((err, res) => {
        if (!res) {
          return reject(err);
        }
        const $ = cheerio.load(res.text)
        const lt = $('[name=lt]').val();
        return resolve({
          cookies: getCookies(res.header['set-cookie']),
          lt
        });
      })
  })

}

// 获取验证码 并识别
const getImgCode = (cookies) => {

  return new Promise((resolve, reject) => {

    superagent.get('http://sso.jvtc.jx.cn/cas/codeimage?' + ((Math.random() * 1000) | 0))
      // .responseType('image/jpeg')
      .timeout(3001)
      .set('Cookie', cookies)
      .send()
      .end((err, res) => {
        if (!res) {
          return reject(err);
        }
        ocr.sso(Buffer.from(res.body)).then(value => {
          resolve(value);
        }).catch(_err => {
          reject(_err);
        });
      })
  })
}

// 登录
const login = async (userAccount, userPassword, lt, cookies) => {
  const imgCode = await getImageCodeData(cookies);
  return new Promise((resolve, reject) => {

    superagent.post('http://sso.jvtc.jx.cn/cas/login')
      .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36')
      .set('Referer', 'http://sso.jvtc.jx.cn/cas/login')
      .set('Accept-Language', 'zh-cn')
      .timeout(3002)
      .set('Cookie', cookies).send(new URLSearchParams({
        username: userAccount,
        password: userPassword,
        errors: 0,
        imageCodeName: imgCode,
        lt,
        _eventId: 'submit',
      }).toString()).type('form').end((err, res) => {
        if (!res) {
          return reject(err);
        }
        const cookies = res.header['set-cookie'];

        if (!cookies || !cookies.length) {
          const $ = cheerio.load(res.text)
          const message = ($('#errorMessage').text() || '未知错误，可能是密码错误哦').replace(/[\n]/g, '').trim()
          return reject(new Error(message));
        }
        return resolve(getCookies(cookies));
      });
  });
};

// 识别验证码
const getImageCodeData = async (cookies) => {
  let i = 3;
  let _error = null;
  do {
    i--;
    try {
      const code = await getImgCode(cookies)
      return code;
    } catch (error) {
      _error = error;
      console.log(error);
      continue;
    }
  } while (i > 0);

  throw _error;
}

// 获取教务系统cookie
const getJwxtCookieBySsoCookie = (cookies, jwxtcookie) => {

  return new Promise((resolve, reject) => {
    superagent.get('http://sso.jvtc.jx.cn/cas/login?service=http%3A%2F%2Fjiaowu.jvtc.jx.cn%2Fjsxsd%2Fsso.jsp')
      .set('Accept-Language', 'zh-cn')
      .timeout(3003)
      .set('Cookie', cookies).redirects(0).send().end((err, res) => {
        if (!res) return reject(err);
        const location = res.header['location'];
        if (!location) {
          return reject(new Error("登录失败"));
        }

        superagent.get(location)
          .set('Accept-Language', 'zh-cn')
          .set('Cookie', jwxtcookie)
          .send()
          .end((err, res) => {
            if (!res) return reject(err);
            resolve();
          })
      })
  })
}

// 学工平台
const getSwCookieBySsoCookie = (cookies, swcookie) => {

  return new Promise((resolve, reject) => {
    superagent.get('http://sso.jvtc.jx.cn/cas/login?service=http%3a%2f%2fxz.jvtc.jx.cn%2fJVTC_XG%2fsso%2flogin.aspx%3ftargetUrl%3dbase64aHR0cDovL3h6Lmp2dGMuanguY24vSlZUQ19YRy9zc28vaW5kZXguYXNweA%3d%3d')
      .set('Accept-Language', 'zh-cn')
      .timeout(3004)
      .set('Cookie', cookies).redirects(0).send().end((err, res) => {
        if (!res) return reject(err);
        const location = res.header['location'];
        if (!location) {
          return reject(new Error("登录失败"));
        }

        superagent.get(location)
          .set('Accept-Language', 'zh-cn')
          .set('Cookie', swcookie)
          .send()
          .end((err, res) => {
            if (!res) return reject(err);
            resolve(getCookies(res.header['set-cookie']));
          })
      })
  })
}

const clientPool = new ClientPool({
  url: 'http://sso.jvtc.jx.cn/cas/login',
  name: 'sso',
  async getHandleClient () {
    return getInitData()
  }
});

module.exports = {
  async init (userid, userpass) {
    const initData = await clientPool.get()
    const cookies = initData.cookies;
    const _cookies = [`JSESSIONID=${cookies['JSESSIONID']}`, `sessoinMapKey=${cookies['sessoinMapKey']}`]

    let errCount = 2;
    let error;
    let success = false;
    do {
      errCount--;
      try {
        const newCookie = await login(userid, userpass, initData.lt, _cookies)

        _cookies.push('CASTGC=' + newCookie['CASTGC'])
        _cookies.push('CASPRIVACY=' + newCookie['CASPRIVACY'])
        success = true;
        break;
      } catch (error) {
        console.log('sso init error',error);

        error = error;
        if (!/验证码/.test(error.message)) {
          throw error;
        }
      }
    } while (errCount >= 0);

    if (!success) {
      throw error
    }

    return _cookies.join(';');
  },
  // 通过 sso cookie 激活 jwxt cookie
  async activeJwxtCookieBySsoCookie (jwxtCookie, ssoCookie) {
    for (let i = 0; i < 3; i++) {
      try {
        await getJwxtCookieBySsoCookie(ssoCookie, jwxtCookie);
        return true
      } catch (error) {
        console.log(error);
      }
    }

    throw new Error("激活失败")
  },
  // 通过 sso cookie 激活 sw cookie
  async activeSwCookieBySsoCookie (swCookie, ssoCookie) {
    for (let i = 0; i < 3; i++) {
      try {
        const newCookies = await getSwCookieBySsoCookie(ssoCookie, swCookie);
        return newCookies;
      } catch (error) {
        console.log(error);
      }
    }
    throw new Error("激活失败")
  }
}
