module.exports = async function (loginName, store) {

  const key = loginName + '_black';
  const userLoginNum = (await store.get(key)) || { num: 0, time: 0 };

  if (userLoginNum.num >= 90) {
    throw {
      code: -1,
      msg: "兄弟，登录这么多次不累吗，服务器好累的"
    }
  }

  // 登录间隙
  if (userLoginNum.time + 100 > Date.now()) {
    throw {
      code: -1,
      msg: "登录频繁，3秒后再试试吧"
    }
  }
  await store.set(key, { num: userLoginNum.num + 1, time: Date.now() });
}