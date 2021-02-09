/*
 * @Author: bucai
 * @Date: 2021-01-08 13:41:28
 * @LastEditors: bucai
 * @LastEditTime: 2021-02-07 22:50:15
 * @Description: 
 */
const AipOcrClient = require("baidu-aip-sdk").ocr;
// 需要先生成一个cookie

class OcrClient {
  constructor(options) {
    if (!Array.isArray(options.configs)) {
      this.configs = [options.configs];
    } else {
      this.configs = options.configs;
    }
    this.init();
  }

  init () {
    const clients = this.configs.map(config => {
      const client = new AipOcrClient(config.APP_ID, config.API_KEY, config.SECRET_KEY);
      return client;
    });
    this.clients = clients;
  }

  getClient () {
    const index = (Math.random() * this.clients.length) | 0;
    return this.clients[index];
  }

  generalBasic (imgbuffer) {
    let url = imgbuffer;
    if (Buffer.isBuffer(imgbuffer)) {
      url = imgbuffer.toString('base64');
    }
    const client = this.getClient();
    return client.generalBasic(url).then(function (result) {
      if (result.error_code > 0) {
        throw new Error(result.error_msg)
      }

      const word_result = result.words_result[0];
      if (word_result && word_result.words) {
        const words = (word_result.words || '').replace(/[oO]/g, '0').replace(/[ilIL]/g, '1').replace(/[B]/g, '8').replace(/[zZ]/g, '2').replace(/[q]/g, '9').replace(/[^0-9]/g, '');
        if (words.length >= 4) {
          return words;
        }
      }
      throw new Error("识别失败");
    })
  }


  generalBasic2 (imgbuffer) {
    let url = imgbuffer;
    if (Buffer.isBuffer(imgbuffer)) {
      url = imgbuffer.toString('base64');
    }
    const client = this.getClient();
    return client.generalBasic(url, { language_type: 'ENG' }).then(function (result) {
      try {
        if (result.error_code > 0) {
          return Promise.reject(new Error(result.error_msg));
        }

        const word_result = result.words_result[0];
        if (word_result && word_result.words) {
          let words = (word_result.words || '').replace(/[^A-z]/g, '');
          if (words.length >= 4) {
            return words;
          }
        }
        console.log('ocr', JSON.stringify(result));
        return Promise.reject({ message: "识别失败" });
      } catch (error) {
        return Promise.reject(error);
      }
    })
  }

}

module.exports = OcrClient;