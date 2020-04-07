const _default = {
  toDayApiNum: -1,
  toMonthApisNum: -1,
  toAllUserNum: -1,
  toDayNewUserNum: -1,
  time: -1,
};

async function fun(ctx, next) {
  // ctx.body = await ctx.dbx.msg.get();
  let { toDayApiNum, toMonthApisNum, toAllUserNum, toDayNewUserNum, time } = _default;
  if (Date.now() - time > 3600000) {
    try {
      toDayApiNum = await ctx.dbx.apiCount.getDataByToday();
      _default.toDayApiNum = toDayApiNum;
      toMonthApisNum = await ctx.dbx.apiCount.getApiCountByMonth();
      _default.toMonthApisNum = toMonthApisNum;
      toAllUserNum = await ctx.dbx.student.getAllUserList();
      _default.toAllUserNum = toAllUserNum;
      toDayNewUserNum = await ctx.dbx.student.getNewUserList();
      _default.toDayNewUserNum = toDayNewUserNum;
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
async function announcement(ctx, next) {

  const announcement = (await ctx.store.getText('announcement'));
  ctx.body = { code: 0, message: announcement };

  await next();
}
module.exports = {
  'GET /data': fun,
  'GET /announcement': announcement,
}