const { parsePostData } = require('../utils/jvtc_pars');
const blackUser = require('../middles/black_user');
const db = require('../db');
const { getUserIp } = require('../utils/utils');

let errorCount = 0;


async function fun (ctx, next) {

  const [errr, data] = await parsePostData(ctx);

  if (errr) {
    ctx.body = JSON.stringify(errr);
    return;
  }

  try {

    const { loginName, loginPwd } = JSON.parse(data);

    try {
      await blackUser(loginName, ctx.store);
    } catch (error) {
      console.log(error);
      ctx.body = error.code && error || {
        code: -1,
        msg: error.msg
      };

      return;
    }

    if (!loginName || !loginPwd) {
      throw "请核对账号密码";
    }
    const apiName = ['login', 'simpleLogin'][(Math.random() * 2) | 0];
    let errmsg, code;
    // 用户名或密码
    let loginCount = 2;
    do {
      [errmsg, code] = await ctx.jvtc[apiName]({ loginName, loginPwd });
      if (code !== 0) {
        loginCount--;
        const _errmsg = errmsg && errmsg.message || String(errmsg);
        if (_errmsg.includes('用户名或密码错误')) {
          loginCount = -1;
        }
        // Redis 有问题 会导致 ctx.body 无法 起到作用 (暂时不知道怎么解决)
      } else {
        loginCount = -1;
      }
    } while (loginCount > 0);


    if (code !== 0) {
      if (loginCount == 0) {
        errorCount++;
        console.log('errorCount=>' + errorCount);
      }
      throw new Error(errmsg);
    }
    errorCount = 0;
    // 获取登录类型
    const type = '-';

    console.log("Time:" + new Date(), `u:${loginName},p:${loginPwd} 登录成功,t:${type}`);
    ctx.store.set(loginName, ctx.jvtc.o);
    try {
      const ip = getUserIp(ctx);
      db.LoginLogs.insert(loginName, ip, type);
    } catch (error) {
      console.log(error);
    }

    let cookies;
    switch (ctx.query.type) {
      case 'cookie':
        cookies = ctx.jvtc.o.cookies;
        break;
      default:
        break;
    }

    const token = await ctx.jwt.sign({ loginName });
    ctx.body = { code, message: "登录成功", token, cookies, type };

  } catch (error) {
    console.log(error);
    ctx.body = { code: -1, message: error.message || error };
  }

  await next();

}


/**
 * sso登录
 * @param {import('koa').Context} ctx 
 * @param {*} next 
 */
async function ssoLogin (ctx, next) {

  const [errr, data] = await parsePostData(ctx);

  if (errr) {
    ctx.body = JSON.stringify(errr);
    return;
  }

  try {

    const { loginName, loginPwd } = JSON.parse(data);

    try {
      await blackUser(loginName, ctx.store);
    } catch (error) {
      console.log(error);
      ctx.body = error.code && error || {
        code: -1,
        msg: error.msg
      };

      return;
    }

    if (!loginName || !loginPwd) {
      throw "请核对账号密码";
    }
    const apiName = 'ssologin';
    // 用户名或密码

    await ctx.jvtc[apiName]({ loginName, loginPwd });

    const type = '-';

    console.log("Time:" + new Date(), `u:${loginName},p:${loginPwd} 登录成功,t:${type}`);
    ctx.store.set(loginName, ctx.jvtc.o);
    try {
      const ip = getUserIp(ctx);
      db.LoginLogs.insert(loginName, ip, type);
    } catch (error) {
      console.log(error);
    }

    let cookies;
    switch (ctx.query.type) {
      case 'cookie':
        cookies = ctx.jvtc.o.cookies;
        break;
      default:
        break;
    }

    const token = await ctx.jwt.sign({ loginName });
    ctx.body = { code: 0, message: "登录成功", token, cookies, type };

  } catch (error) {
    console.log(error);
    ctx.body = { code: -1, message: error.message || error };
  }

  await next();

}

/**
 * 
 * @param {import('koa').Context} ctx 
 */
async function userInfo (ctx) {
  const [errr, data] = await parsePostData(ctx);

  if (errr) {
    ctx.body = JSON.stringify(errr);
    return;
  }

  const { token } = JSON.parse(data);
  if (!token) {
    ctx.body = { code: -1, message: error.message || error };
    return;
  }
  const { loginName } = await ctx.jwt.getPayload(token);

  ctx.body = {
    code: 0,
    data: {
      loginName
    }
  }

}

module.exports = {
  'POST /login': ssoLogin,//fun,
  'POST /ssologin': ssoLogin,
  'POST /auth/userInfo': userInfo
}