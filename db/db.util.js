const mysql = require('mysql');
const config = require('../db.config');

class DBUtils {
  constructor(options) {
    this.options = options;
    this.connection();
  }
  connection () {
    if (this.conn) {
      try {
        this.conn.destroy();
      } catch (error) {
        console.log('destroy=>', error);
      }
    }
    const connection = this.conn = mysql.createConnection(this.options);
    connection.connect((err) => {
      if (err) {
        console.error('connection=> ' + err);
        setTimeout(() => {
          this.connection()
        }, 1000);
        return;
      }
      console.log('connection mysql success');
    });
    connection.on('error', (err) => {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        this.connection();
      } else {
        throw err;
      }
    });
  }

  query (...args) {
    if (typeof args[args.length - 1] === 'function') {
      return this.conn.query(...args);
    }
    return new Promise((resolve, reject) => {
      args.push((err, res) => {
        if (err) return reject(err);
        resolve(res);
      })
      this.conn.query(...args);
    })
  }
}

module.exports = new DBUtils(config);