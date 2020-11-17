/*
 * @Author: bucai
 * @Date: 2020-11-17 16:42:21
 * @LastEditors: bucai
 * @LastEditTime: 2020-11-17 20:49:20
 * @Description: 
 */
const { parsePostData } = require("../utils/jvtc_pars");

async function fun (ctx, next) {

  const [errr, data] = await parsePostData(ctx);
  if (errr) {
    ctx.body = JSON.stringify(errr);
    return;
  }

  try {
    const { starttime, endtime, LeaveThing, OutAddress, id, isDelete } = JSON.parse(data);

    if (!starttime || !endtime) {
      ctx.body = { code: -1, message: "参数错误" };
      return;
    }


    const [err, data_] = await ctx.jvtc.StuAllLeaveManage_Edit({ starttime, endtime, LeaveThing, OutAddress, id, isDelete })

    if (err) throw err;
    ctx.body = {
      code: 0,
      message: "",
      data: {
        stat: data_,
        msg: "成功"
      }
    };

  } catch (error) {
    console.log(error);

    ctx.body = { code: -1, message: error.message || error };
  }
  // ctx.body = "123";
  // await next();

}

module.exports = {
  'POST /StuAllLeaveManage_Edit': fun
}