const _default = {
  toDayApiNum: -1,
  toMonthApisNum: -1,
  toAllUserNum: -1,
  toDayNewUserNum: -1,
  time: -1,
};
const db = require('../db');


async function initData () {
  try {
    console.time('todayCount')
    toDayApiNum = await db.ApiCount.todayCount();
    console.timeEnd('todayCount')
    toDayApiNum = _default.toDayApiNum = toDayApiNum || 0;
    
    console.time('count')
    toMonthApisNum = await db.ApiCount.count();
    console.timeEnd('count')
    _default.toMonthApisNum = toMonthApisNum;


    console.time('userCount')
    toAllUserNum = await db.LoginLogs.userCount();
    console.timeEnd('userCount')
    _default.toAllUserNum = toAllUserNum;


    console.time('LoginLogs todayCount')
    toDayNewUserNum = await db.LoginLogs.todayCount();
    console.timeEnd('LoginLogs todayCount')
    console.log('toDayNewUserNum', toDayNewUserNum);
    const tday = toDayNewUserNum || 0;
    _default.toDayNewUserNum = tday;


  } catch (error) {
    console.log('error', error);
  }
  setTimeout(async () => {
    initData();
  }, 3600 * 1000);
}

initData();

async function fun (ctx, next) {
  // ctx.body = await ctx.dbx.msg.get();
  let { toDayApiNum, toMonthApisNum, toAllUserNum, toDayNewUserNum, time } = _default;
  if (Date.now() - time > 3600000) {
    
  }

  ctx.body = {
    code: 0,
    data: {
      toDayApiNum,
      toMonthApisNum,
      toAllUserNum,
      toDayNewUserNum,
      // newUserNum:toAllUser[toAllUser.length-1]._count,
    }
  };
  await next();
}
async function announcement (ctx, next) {

  const announcement = (await ctx.store.getText('announcement'));
  ctx.body = { code: 0, message: announcement };

  await next();
}
module.exports = {
  'GET /data': fun,
  'GET /announcement': announcement,
}