const cheerio = require('cheerio');
const { jvtc_post } = require('../utils/jvtc_request');
const { parsCookies } = require('../utils/jvtc_pars');
const { login } = require('../apis/api');

module.exports = async function (cookies, args) {
  return new Promise((resolve, reject) => {
    jvtc_post(login, { cookies, args }, (err, res) => {
      // console.log('err, res',err, res);
      try {
        // err 可能只是 status code 小错误 只要cookie完成就不用担心
        // if(err){
        //   throw new Error("接口出错，请联系开发人员");
        // }
        // 对 重定向处理
        if (!res) {
          console.log('---err', err);
          if (err.status > 300 && err.status < 400) {
            console.log('login=> 重定向');
          } else {
            throw '登录失败';
          }
        }

        // <script>alert('用户名或密码错误！');</script>
        const $ = cheerio.load(res.text);

        if ((res.text || "").includes(`<script>alert('用户名或密码错误！');</script>`)) {
          throw '用户名或密码错误！';
        }

        const html = new String($('script').html())
        if (html) {
          const rex = /alert\('(.*?)'\);/;
          const ms = html.match(rex);
          if (ms && ms.length >= 2) {
            throw ms[1];
          }
        }

        const cookies = parsCookies(res.headers);
        // 登录成功标志
        // this.isLogin = true;
        resolve([null, cookies]);

      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }).catch((error) => {
    return [error, null];
  });
}