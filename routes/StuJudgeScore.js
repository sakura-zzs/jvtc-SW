const { parsePostData } = require("../utils/jvtc_pars");

async function fun (ctx, next) {

  const { TermTime } = ctx.query;
  try {

    const [error, code, data] = await ctx.jvtc.StuJudgeScore(TermTime);

    if (!error && code === 0) {
      ctx.body = { code, message: error, data }

      return;
    }

    throw error;

  } catch (error) {
    ctx.body = { code: -1, message: error.message || error };
  }

  await next();
}

module.exports = {
  'GET /stu_judge_score': fun
}