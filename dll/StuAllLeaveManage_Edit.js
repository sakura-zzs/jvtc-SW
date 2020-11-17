/*
 * @Author: bucai
 * @Date: 2020-11-17 16:27:41
 * @LastEditors: bucai
 * @LastEditTime: 2020-11-17 20:49:37
 * @Description: 
 */
const { jvtc_get, jvtc_post } = require('../utils/jvtc_request');
const { parsArgs, parsFDYAllLeaveExam_EditForm, parseTeacherFDYAllLeaveExamStat } = require('../utils/jvtc_pars');
const { StuAllLeaveManage_Edit } = require('../apis/api');
const { json2form } = require('../utils/utils');
async function jvtc_fun ({ starttime, endtime, LeaveThing, OutAddress, id, isDelete }) {

  return new Promise((resolve, reject) => {
    let type = 'Add'
    if (id) {
      type = 'Edit&id=' + id
    }

    jvtc_get(StuAllLeaveManage_Edit + type, { cookies: this.o.cookies }, (err, res) => {
      if (!res) {
        return reject(err);
      }
      const { text } = res;
      this.o.args = parsArgs(text);
      const form = {

        "AllLeave1aLeaveBeginDate": starttime.split(' ')[0],
        "AllLeave1$LeaveBeginTime": starttime.split(' ')[1],
        "AllLeave1aLeaveEndDate": endtime.split(' ')[0] || '12',
        "AllLeave1$LeaveEndTime": endtime.split(' ')[1] || '12',
        "AllLeave1$LeaveNumNo": ((new Date(endtime.split(' ')[0]) - new Date(starttime.split(' ')[0])) / 3600 / 1000 / 24) | 0,
        "AllLeave1$LeaveType": "事假",
        "AllLeave1$LeaveThing": LeaveThing || "",
        "AllLeave1$OutAddress": OutAddress || '',
        "AllLeave1$WithNumNo": "0",
        "AllLeave1$OutTel": "",
        "AllLeave1$OutMoveTel": "",
        "AllLeave1$Relation": "",
        "AllLeave1$OutName": "",
        "AllLeave1$StuMoveTel": "",
        "AllLeave1$StuOtherTel": "",
        "AllLeave1aGoDate": "",
        "AllLeave1$GoTime": "12",
        "AllLeave1$GoVehicle": "汽车",
        "AllLeave1aBackDate": "",
        "AllLeave1$BackTime": "12",
        "AllLeave1$BackVehicle": "汽车",
        "AllLeave1$Hidden1": "1",
      }

      let typeObj = {
        'Save.x': (Math.random() * 30) | 0,
        'Save.y': (Math.random() * 30) | 0,
      }

      if (id && isDelete) {
        typeObj = {
          "Delete.x": (Math.random() * 30) | 0,
          "Delete.y": (Math.random() * 30) | 0,
        }
      }

      const args = {
        ...this.o.args,
        ...form,
        ...typeObj
      }

      jvtc_post(StuAllLeaveManage_Edit + type, { cookies: this.o.cookies, args: json2form(args) }, (err, res) => {
        try {
          if (!res) {
            throw err;
          }
          const { stat, error } = parseTeacherFDYAllLeaveExamStat(res.text);
          if (error) {
            return reject(error);
          }

          resolve([null, stat]);

        } catch (error) {
          reject(error);
        }
      });
    });


  }).catch((error) => {
    return [error, null];
  });
}

module.exports = jvtc_fun;
