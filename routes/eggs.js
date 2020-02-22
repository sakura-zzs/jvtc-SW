async function fun(ctx, next) {

  const { stuNo, type } = ctx.query;
  if (stuNo && type) {
    const eggs = (await ctx.store.get('eggs')) || [];
    const eggs_type = (await ctx.store.get('eggs_' + type));
    console.log(eggs_type);
    
    if (eggs_type) {
      ctx.body = { code: -1, message: "该彩蛋已被其他人找到" };
      return;
    }
    eggs.push({ stuNo, type });
    ctx.store.set('eggs', eggs, { maxAge: Date.now() });
    ctx.store.set('eggs_' + type, { is: true }, { maxAge: Date.now() });
    ctx.body = { code: 0, message: "恭喜" };
  } else {
    ctx.body = { code: -1, message: "参数不能为空" };
  }

  await next();
}

async function getEggs(ctx, next) {

  const stuNo = ctx.query.stuNo;

  if (stuNo) {
    const eggs = (await ctx.store.get('eggs')) || [];
    const res = eggs.filter(item => item.stuNo == stuNo);
    if (res.length) {
      ctx.body = {
        code: 0, message: "是的没错", data: res
      };
      return
    } else {
      ctx.body = { code: -1, message: "不存在" };
    }
  } else {
    ctx.body = { code: -1, message: "参数错误" };
  }

  await next();
}

module.exports = {
  'GET /eggs': fun,
  'GET /getEggs': getEggs,
}