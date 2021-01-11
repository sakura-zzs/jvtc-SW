const OcrClient = require('../bin/OcrClient');
const jvtc_code = require('../utils/jvtc_code');
const jvtc_cookies = require('../utils/jvtc_cookies');
const jvtc_args = require('../utils/jvtc_args');
const configs = require('../ocr.config');
const ClientPool = require('../bin/ClientPool');
const { init } = require('../apis/api');

const ocrClient = new OcrClient({
  configs: configs
})


const clientPool = new ClientPool({
  url: init,
  name: "login"
});

async function jvtc_fun ({ loginName, loginPwd }) {
  // 简单过滤一下账号密码
  if (!/^([0-9]{4,})$/.test(loginName) || !/^([^'"]+)$/.test(loginPwd)) {
    return ["传入的参数错误", -1];
  }

  return new Promise(async (resolve, reject) => {

    this.o = await clientPool.get();

    const cookies = this.o.cookies;
    // 标志
    let i = 2;
    let code = '00000';
    // 识别三次
    do {

      try {
        // 获取验证码的buffer对象
        const buffer = await jvtc_code(cookies);
        // 识别
        const timeLabel = 'TIME: ocrClient:' + i;
        console.time(timeLabel);
        const result = await ocrClient.generalBasic(buffer);
        if (result.length == 5 && String(parseInt(result)).length == 5) {
          console.log("Time:" + new Date(), `CODE: 识别 ${4 - i} 次成功`);
          i = 0;
          code = result;
        }
        console.timeEnd(timeLabel);

      } catch (error) {
        // 不处理
        console.log("Time:" + new Date(), `CODE: 识别失败 ERROR: `, error);
      } finally {

        i--;
      }

    } while (i > 0);
    // 获取参数列表
    const args = jvtc_args(this.o.args, loginName, loginPwd, code);

    // 登录并获取之后的cookie
    const [err, data] = await jvtc_cookies(cookies, args);
    console.log('JVTC_COOKIES-> ', data);
    if (err) {
      return reject(err);
    }
    // 绑定状态
    this.o.cookies += data;
    // 响应状态
    resolve([null, 0]);

  }).catch((error) => {
    return [error, null];
  });
}

module.exports = jvtc_fun;
