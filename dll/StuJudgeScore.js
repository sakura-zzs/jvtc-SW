const cheerio = require('cheerio');
const { jvtc_get, jvtc_post } = require('../utils/jvtc_request');
const { parsArgs, parsePostData,parseOptions } = require('../utils/jvtc_pars');
const { StuJudgeScore } = require('../apis/api');

async function jvtc_fun() {

  return new Promise((resolve, reject) => {

    const { o } = this;
    const args = {
      // ...this.o.args,
      __EVENTTARGET: 'GridView1',
      __EVENTARGUMENT: 'Page$3',
      __VIEWSTATEENCRYPTED: ''
    };
    jvtc_post(StuJudgeScore, { cookies: o.cookies, args }, (err, res) => {
      try {
        if (!res) {
          throw err;
        }
        const { text } = res;
        o.args = parsArgs(text);

        const data = parsePostData(text) || [];
        console.log('data', data);
        resolve([null, 0, data.reverse()]);

      } catch (error) {
        reject(error);
      }
    });
  }).catch((error) => {
    return [error, null, null];
  })
}

module.exports = jvtc_fun;