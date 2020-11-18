/*
 * @Author: bucai
 * @Date: 2020-11-18 11:44:30
 * @LastEditors: bucai
 * @LastEditTime: 2020-11-18 11:56:52
 * @Description: 
 */
const { jvtc_get, jvtc_post } = require('../utils/jvtc_request');
const { parsArgs, ParseStuAllLeaveManage } = require('../utils/jvtc_pars');
const { StuAllLeaveManage } = require('../apis/api');

async function jvtc_fun () {

  return new Promise((resolve, reject) => {

    jvtc_get(StuAllLeaveManage, { cookies: this.o.cookies }, (err, res) => {
      if (!res) {
        return reject(err);
      }

      const { text } = res;

      const list = ParseStuAllLeaveManage(res.text);

      this.o.args = parsArgs(text);

      return resolve([null, list]);
    });
  }).catch((error) => {
    return [error, null];
  });
}

module.exports = jvtc_fun;
