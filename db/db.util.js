const mysql = require('mysql');
const config = require('../db.config');

class DBUtils {
  constructor(options) {
    this.options = options;
    this.init();
  }
  init () {
    this.pool = mysql.createPool({
      ...this.options
    });
  }
  connection () {
    return new Promise((resolve, reject) => {
      // console.time('conn=>time');
      try {
        this.pool.getConnection((err, connection) => {
          // console.timeEnd('conn=>time');
          if (err) {
            console.log('err',err);
            reject(err)
          } else {
            resolve(connection);
          }
          this.pool.releaseConnection(connection);
        });
      } catch (error) {
        console.log('error',error);
        reject(error);
      }
    })
  }

  async query (...args) {
    const conn = await this.connection();
    if (typeof args[args.length - 1] === 'function') {
      return conn.query(...args);
    }
    return new Promise((resolve, reject) => {
      args.push((err, res) => {
        if (err) {
          return reject(err);
        }
        resolve(res);
      });
      const query = conn.query(...args);
      console.log('sql=>', query.sql);

    })
  }
}

module.exports = new DBUtils(config);