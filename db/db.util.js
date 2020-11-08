const mysql = require('mysql');
const config = require('../db.config');

const connection = mysql.createConnection({
  ...config
});

connection.connect((err) => {
  if (err) return console.error('connection' + err);
  console.log('connection mysql success');
});

module.exports = connection;