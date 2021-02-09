/*
 * @Author: bucai
 * @Date: 2021-02-09 20:23:41
 * @LastEditors: bucai
 * @LastEditTime: 2021-02-09 21:19:29
 * @Description:
 */

const FormData = require('form-data')
const axios = require('axios').default

module.exports = class AiCode {

  constructor({
    debug = false
  } = {}) {
    // 暂无配置
    const BASE_URL = debug ? "https://ai.jiulow.com/api" : "http://172.24.3.9:7781";

    this.http = axios.create({
      baseURL: BASE_URL,
      timeout: 6 * 1000
    });

  }

  async sso (imgBuffer) {
    const fd = new FormData();
    fd.append('image_file', imgBuffer, { filename: 'image.png' });

    const res = await this.http.post('/code/sso', fd, {
      headers: fd.getHeaders()
    });

    const data = res.data;

    if (data['error_code']) {
      return Promise.reject(new Error("图片存在问题"));
    }

    return data.value;
  }

}