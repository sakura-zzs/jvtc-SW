async function fun(ctx, next) {
  // ctx.body = await ctx.dbx.msg.get();
  let toDayApiNum, toMonthApisNum, toAllUserNum, toDayNewUserNum;

  try {
    toDayApiNum = await ctx.dbx.apiCount.getDataByToday();
  } catch (error) {
    toDayApiNum = -1;
  }

  try {
    toMonthApisNum = await ctx.dbx.apiCount.getApiCountByMonth();
  } catch (error) {
    toMonthApisNum = -1;
  }

  try {
    toAllUserNum = await ctx.dbx.student.getAllUserList();
  } catch (error) {
    toAllUserNum = -1;
  }

  try {
    toDayNewUserNum = await ctx.dbx.student.getNewUserList();
  } catch (error) {
    toDayNewUserNum = -1;
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

module.exports = {
  'GET /data': fun,
}