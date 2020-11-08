const Bmob = require('hydrogen-js-sdk');
const nodeCron = require('node-cron');
/**
 * 
 * @param {Date} date 
 */
function formatDate (date) {
  return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0') + ' 00:00:00'
}

class Student {

  constructor() {
    this.table = Bmob.Query('student')
  }
  async save (sid, spass) {
    try {
      const table = Bmob.Query('student');
      table.equalTo("sid", "==", sid);
      const res = await table.find();
      const data = res[0];
      if (data) {
        table.set('id', data.objectId) //需要修改的objectId
      }
      table.set("sid", sid);
      table.set("spass", spass);
      await table.save();
    } catch (error) {
      console.log("ApiCount => ", error);
    }
  }
  async get () {
    try {
      const table = Bmob.Query('student');
      const list = await table.find();
      return list;
    } catch (error) {
      console.log("ApiCount => ", error);

    }
  }

  async getAllUserList () {
    const query = Bmob.Query('student');
    return query.count();
  }
  async getNewUserList () {
    const query = Bmob.Query('student');
    query.equalTo("createdAt", ">", formatDate(new Date()));
    query.equalTo("createdAt", "<", formatDate(new Date(new Date().setDate(new Date().getDate() + 1))));
    // query.equalTo("createdAt", ">", formatDate(new Date(new Date().setMonth(new Date().getMonth() - 1))));
    // query.equalTo("createdAt", "<", formatDate(new Date(new Date().setDate(new Date().getDate() + 1))));
    query.statTo("groupcount", "true");
    query.statTo("groupby", "createdAt");
    // query.statTo("order", "createdAt");
    return query.count();
  }
}

class ApiCount {

  constructor() {
    this.table = Bmob.Query('ApiCount')
  }
  async save (path) {
    try {
      this.table.set("path", path)
      await this.table.save();
    } catch (error) {
      console.log("ApiCount => ", error);
    }
  }
  async get () {
    try {
      const table = Bmob.Query('ApiCount');
      const list = await table.find();
      return list;
    } catch (error) {
      console.log("ApiCount => ", error);
    }
  }
  async getDataByToday () {
    const query = Bmob.Query('ApiCount')
    query.equalTo("createdAt", ">", formatDate(new Date()));
    query.equalTo("createdAt", "<", formatDate(new Date(new Date().setDate(new Date().getDate() + 1))));
    query.statTo("groupcount", "true");
    query.statTo("groupby", "path");
    return query.count();
  }
  async getApiCountByMonth () {
    const query = Bmob.Query('ApiCount')
    query.equalTo("createdAt", ">", formatDate(new Date(new Date().setMonth(new Date().getMonth() - 1))));
    query.equalTo("createdAt", "<", formatDate(new Date(new Date().setDate(new Date().getDate() + 1))));
    query.statTo("groupcount", "true");
    query.statTo("groupby", "createdAt");
    query.statTo("order", "createdAt");
    return query.count();
  }
}

class Msg {

  constructor() {
    this.table = Bmob.Query('msg')
  }
  async save (msg, stuNo) {
    try {
      this.table.set("msg", msg)
      this.table.set("stuNo", stuNo)
      await this.table.save();
    } catch (error) {
      console.log("ApiCount => ", error);
    }
  }
  async get () {
    try {
      const table = this.table;
      const list = await table.find();
      return list;
    } catch (error) {
      console.log("ApiCount => ", error);
    }
  }
}


function init (secretKey, securityCode) {
  // 0 0/10 * * * ? 
  const _init = () => {
    console.log('更新初始化Bmob');
    const index = (Math.random() * secretKey.length | 0);
    let isecretKey = secretKey[index];
    let isecurityCode = securityCode[index];
    Bmob.initialize(isecretKey, isecurityCode);
  }
  if (Array.isArray(secretKey)) {
    _init();
    const task = nodeCron.schedule('* */10 * * *', _init);
    task.start();
  } else {
    secretKey = [secretKey];
    securityCode = [securityCode];
    // Bmob.initialize(secretKey, securityCode);
    _init();
  }
  return {
    ApiCount,
    Student,
    Msg
  }
}

module.exports = init;