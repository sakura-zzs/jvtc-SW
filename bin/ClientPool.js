/*
 * @Author: bucai
 * @Date: 2021-01-09 11:40:24
 * @LastEditors: bucai
 * @LastEditTime: 2021-01-21 21:57:46
 * @Description: 
 */
const { jvtc_get } = require('../utils/jvtc_request');
const { parsCookies, parsArgs } = require('../utils/jvtc_pars');

const colors = require('colors');

let nameNo = 0;
class ClientPool {
  constructor({
    url,
    name,
    POOL_COUNT = 10,
    getHandleClient
  }) {
    this.name = name || nameNo++;
    this.POOL_COUNT = POOL_COUNT || 10;
    this.getHandleClient = getHandleClient;
    this.intiUrl = url;
    this.list = [];
    this._init();
    this._live();
  }
  // 存活检测 定时器，半个小时如果都没活跃就干掉
  async _live () {
    console.log(`[${colors.green(this.name)}] 守护‘进程’: ${colors.green('已更新')}`);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {

      console.log(`[${colors.green(this.name)}] 守护‘进程’: ${colors.red('已执行')}`);
      // 直接抛弃现有的客户端
      this.list = [];
      this._init();
      // 再自己干自己一次保持活跃检测
      this._live();
    }, 30 * 60 * 1000);


  }

  async _init () {
    if (this.ing) return;

    this.ing = true;
    let size = this.POOL_COUNT - this.list.length;
    console.log(`[${colors.green(this.name)}] 客户端池开始初始化: 数量[${colors.yellow(size)}]`);

    const status = {
      success: 0,
      error: 0
    }
    for (let i = 0; i < size; i++) {
      try {
        const client = await this._getClient();
        this.list.push(client);
        status.success++;
      } catch (error) {
        status.error++;
        console.log('ClientPool=>' + error);
      }
    }
    console.log(`[${colors.green(this.name)}] 客户端池已初始化完毕: 成功[${colors.blue(status.success)}]  失败[${colors.red(status.error)}]`);
    this.ing = false;
  }

  async _getClient () {
    if (this.getHandleClient) {
      return this.getHandleClient()
    }
    return new Promise((resolve, reject) => {
      jvtc_get(this.intiUrl, { cookies: '', args: '', timeout: 2000 }, (err, res) => {
        if (!res) {
          return reject(err)
        }
        try {
          const args = parsArgs(res.text)

          const cookies = parsCookies(res.headers)
          resolve({
            args,
            cookies
          });
        } catch (error) {
          console.error('error', error);
          reject(error)
        }
      })
    });
  }

  async get () {

    this._live();

    const clientList = this.list;
    if (clientList.length <= this.POOL_COUNT / 3 * 2) {
      this._init();
    }
    let client = clientList.shift();

    if (!client) {
      client = await this._getClient();
    }

    return client;
  }

}



module.exports = ClientPool