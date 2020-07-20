const cheerio = require('cheerio');
const { jvtc_get, jvtc_post } = require('../utils/jvtc_request');
const { parsArgs, parseStuJudegScore, parseOptions } = require('../utils/jvtc_pars');
const { StuJudgeScore } = require('../apis/api');
const { json2form } = require('../utils/utils');

async function jvtc_fun (TermTime) {

  return new Promise((resolve, reject) => {

    const { o } = this;

    // console.log('args',args);
    jvtc_get(StuJudgeScore, { cookies: o.cookies }, (err, res) => {
      try {
        if (!res) {
          throw err;
        }
        o.args = parsArgs(res.text);
        const args = {
          ...this.o.args,
          TermTime,
          BtnSearch: "查询"
          // __EVENTTARGET: 'GridView1',
          // __EVENTARGUMENT: 'Page$3',
          // __VIEWSTATEENCRYPTED: ''
        };
        jvtc_post(StuJudgeScore, { cookies: o.cookies, args: json2form(args) }, (err, res) => {
          try {
            if (!res) {
              throw err;
            } 
            const { text } = res;
            o.args = parsArgs(text);

            // console.log('text', text);

            const data = parseStuJudegScore(text) || {
              list: [],
              options: []
            };

            console.log('data', data);
            resolve([null, 0, data]);

          } catch (error) {
            reject(error);
          }
        });

      } catch (error) {
        reject(error);
      }
    })
  }).catch((error) => {
    return [error, null, null];
  })
}

module.exports = jvtc_fun;