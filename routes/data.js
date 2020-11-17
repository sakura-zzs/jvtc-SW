const _default = {
  toDayApiNum: -1,
  toMonthApisNum: -1,
  toAllUserNum: -1,
  toDayNewUserNum: -1,
  time: -1,
};
const db = require('../db');

async function fun (ctx, next) {
  // ctx.body = await ctx.dbx.msg.get();
  let { toDayApiNum, toMonthApisNum, toAllUserNum, toDayNewUserNum, time } = _default;
  if (Date.now() - time > 3600000) {
    try {
      toDayApiNum = await db.ApiCount.todayCount();
      toDayApiNum = _default.toDayApiNum = toDayApiNum || 0;
      toMonthApisNum = await db.ApiCount.count();
      _default.toMonthApisNum = toMonthApisNum;

      toAllUserNum = await db.LoginLogs.userCount();
      _default.toAllUserNum = toAllUserNum;
      toDayNewUserNum = await db.LoginLogs.todayCount();
      console.log('toDayNewUserNum',toDayNewUserNum);
      const tday = toDayNewUserNum || 0;
      _default.toDayNewUserNum = tday;
    } catch (error) {
    }
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