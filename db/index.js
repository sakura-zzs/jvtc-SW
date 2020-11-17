const db = require('./db.util');

class BaseTable {

}

class ApiCount extends BaseTable {
  // static that = null;
  // static getInstance () {
  //   if (ApiCount.that) return ApiCount.that;
  //   ApiCount.that = new ApiCount();
  //   return ApiCount.that;
  // }

  insert (base_path, path, ip, ua) {
    return new Promise((resolve, reject) => {
      db.query(`INSERT api_count(base_path,path,ip,ua) VALUES('${base_path}','${path}','${ip}','${ua}')`, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      })
    })
  }

  count () {
    return new Promise((resolve, reject) => {
      db.query(`SELECT COUNT(*) AS count FROM api_count`, (err, res) => {
        if (err) return reject(err);
        const g = res[0];
        resolve(g ? res[0].count : 0);
      })
    })
  }
  todayCount () {
    return new Promise((resolve, reject) => {
      db.query(`SELECT COUNT(*) AS count FROM (SELECT path FROM api_count WHERE date(created_time) = curdate()) t;`, (err, res) => {
        if (err) return reject(err);
        const c = res[0];
        resolve(c ? c.count : 0);
      })
    })
  }

  daysCount () {
    return new Promise((resolve, reject) => {
      db.query(`SELECT DATE_FORMAT(api_count.created_time,'%Y-%m-%d') days,count(*) AS count FROM api_count GROUP BY days ORDER BY days DESC LIMIT 30;`, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      })
    })
  }

  monthsCount () {
    return new Promise((resolve, reject) => {
      db.query(`SELECT DATE_FORMAT(api_count.created_time,'%Y-%m') AS months,count(*) AS count FROM api_count GROUP BY months`, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      })
    })
  }

  pathCount () {
    return new Promise((resolve, reject) => {
      db.query(`SELECT base_path,COUNT(*) AS count FROM api_count GROUP BY base_path`, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      })
    })
  }

}

class Students extends BaseTable {
  // static that = null;
  // static getInstance () {
  //   if (Students.that) return Students.that;
  //   Students.that = new Students();
  //   return Students.that;
  // }

  count () {
    return new Promise((resolve, reject) => {
      db.query(`SELECT count(*) AS count FROM students`, (err, res) => {
        if (err) return reject(err);
        const c = res[0];
        resolve(c ? c.count : 0);
      })
    });
  }

  gradeCount () {
    return new Promise((resolve, reject) => {
      db.query(`SELECT admission,count(*) AS count FROM students GROUP BY admission;`, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      })
    });
  }

  collegeCount () {
    return new Promise((resolve, reject) => {
      db.query(`SELECT college, admission, count(*) AS count FROM students GROUP BY college,admission ORDER BY admission DESC;`, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      })
    });
  }

  specialtyCount () {
    return new Promise((resolve, reject) => {
      db.query(`SELECT COUNT(*) as count FROM (SELECT DISTINCT specialty FROM students GROUP BY specialty) t;`, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      })
    });
  }

  classsCount () {
    return new Promise((resolve, reject) => {
      db.query(`SELECT COUNT(*) as count FROM (SELECT DISTINCT classs FROM students GROUP BY classs) t;`, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      })
    });
  }

  find (key) {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM students WHERE name LIKE '%${key}%' OR stu_no ='${key}' LIMIT 1;`, (err, res) => {
        if (err) return reject(err);
        const c = res[0];
        resolve(c);
      })
    });
  }

  findByNo (no) {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM students WHERE stu_no ='${no}' LIMIT 1;`, (err, res) => {
        if (err) return reject(err);
        const c = res[0];
        resolve(c);
      })
    });
  }
}

class Staff extends BaseTable {
  // static that = null;
  // static getInstance () {
  //   if (Staff.that) return Staff.that;
  //   Staff.that = new Staff();
  //   return Staff.that;
  // }

  count () {
    return new Promise((resolve, reject) => {
      db.query(`select COUNT(*) AS count FROM staff;`, (err, res) => {
        if (err) return reject(err);
        const c = res[0];
        resolve(c ? c.count : 0);
      })
    });
  }

  unitCount () {
    return new Promise((resolve, reject) => {
      db.query(`select unit,COUNT(*) AS count FROM staff GROUP BY unit ORDER BY count DESC;`, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      })
    });
  }

  educationCount () {
    return new Promise((resolve, reject) => {
      db.query(`SELECT  education, COUNT(*) AS count FROM  staff GROUP BY education ORDER BY count DESC;`, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      })
    });
  }
  find (name) {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM staff WHERE name LIKE "%${name}%" LIMIT 1;`, (err, res) => {
        if (err) return reject(err);
        const c = res[0];
        resolve(c);
      })
    });
  }
}

class RobotUser {
  // static getInstance () {
  //   if (RobotUser.that) return RobotUser.that;
  //   RobotUser.that = new RobotUser();
  //   return RobotUser.that;
  // }

  count () {
    return new Promise((resolve, reject) => {
      db.query(`select COUNT(*) AS count FROM robot_users;`, (err, res) => {
        if (err) return reject(err);
        const c = res[0];
        resolve(c ? c.count : 0);
      })
    });
  }

  findByQQ (qq) {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM robot_users WHERE qq='${qq}' LIMIT 1;`, (err, res) => {
        if (err) return reject(err);
        const c = res[0];
        resolve(c);
      })
    });
  }


  findBySNo (sNo) {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM robot_users WHERE stu_no='${sNo}' LIMIT 1;`, (err, res) => {
        if (err) return reject(err);
        const c = res[0];
        resolve(c);
      })
    });
  }

  bind (sNo, qq) {
    return new Promise((resolve, reject) => {
      db.query(`insert into robot_users (qq, stu_no) 
      values ("${qq}","${sNo}")
      ON DUPLICATE KEY UPDATE stu_no=VALUES(stu_no);`, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      })
    });
  }

}


class LoginLogs {
  // static getInstance () {
  //   if (LoginLogs.that) return LoginLogs.that;
  //   LoginLogs.that = new LoginLogs();
  //   return LoginLogs.that;
  // }

  count () {
    return new Promise((resolve, reject) => {
      db.query(`select COUNT(*) AS count FROM login_logs;`, (err, res) => {
        if (err) return reject(err);
        const c = res[0];
        resolve(c ? c.count : 0);
      })
    });
  }
  userCount () {
    return new Promise((resolve, reject) => {
      db.query(`SELECT COUNT(*) AS count FROM (SELECT distinct stu_no FROM login_logs) t;`, (err, res) => {
        if (err) return reject(err);
        const c = res[0];
        resolve(c ? c.count : 0);
      })
    })
  }
  todayCount () {
    return new Promise((resolve, reject) => {
      db.query(`SELECT COUNT(*) as count FROM (SELECT DISTINCT stu_no FROM login_logs WHERE date(created_time) = curdate()) t;`, (err, res) => {
        if (err) return reject(err);
        const c = res[0];
        resolve(c ? c.count : 0);
      })
    })
  }
  daysCount () {
    return new Promise((resolve, reject) => {
      db.query(`SELECT days, COUNT(*) AS count FROM (SELECT DATE_FORMAT(t.created_time,'%Y-%m-%d') days,stu_no, count(*) AS count FROM login_logs t GROUP BY days,stu_no) t1 GROUP BY days ORDER BY days DESC LIMIT 30;`, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      })
    });
  }
  userGroupCount (size = 10) {
    return new Promise((resolve, reject) => {
      db.query(`select stu_no,COUNT(*) AS count FROM login_logs GROUP BY stu_no ORDER BY count DESC LIMIT ?;`, [size], (err, res) => {
        if (err) return reject(err);
        resolve(res);
      })
    });
  }

  insert (stu_no, ip, type) {
    return new Promise((resolve, reject) => {
      db.query(`INSERT login_logs(stu_no,ip,type) VALUES(?,?,?);`, [stu_no, ip, type], (err, res) => {
        if (err) return reject(err);
        resolve(res);
      })
    });
  }

}




module.exports.ApiCount = new ApiCount();
module.exports.Students = new Students();
module.exports.Staff = new Staff();
module.exports.RobotUser = new RobotUser();
module.exports.LoginLogs = new LoginLogs();