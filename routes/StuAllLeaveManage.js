/*
 * @Author: bucai
 * @Date: 2020-11-18 11:49:29
 * @LastEditors: bucai
 * @LastEditTime: 2020-11-18 11:50:39
 * @Description: 
 */
async function fun (ctx, next) {

  try {

    const [error, data] = await ctx.jvtc.StuAllLeaveManage();

    if (!error && data) {
      ctx.body = { code: 0, data }

      return;
    }

    throw error;

  } catch (error) {
    console.log(error);
    ctx.body = { code: -1, message: error.message || error };
  }

  await next();
}

module.exports = {
  'GET /StuAllLeaveManage': fun
}