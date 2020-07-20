const JSEncrypt = require('node-jsencrypt');

// function encrypt (key, text) {
//   console.log(key,text);
//   return new Promise((ok, gg) => {
//     ne.encrypt({ text: text, key: key }, (err, ciphertext) => {
//       if (err) return gg(err);
//       ok(ciphertext);
//     })
//   })
// }

module.exports = function (_args, loginName, loginPwd, code) {
  const jsEncrypt = new JSEncrypt();
  jsEncrypt.setPrivateKey(_args.pubKey);

  // console.log('_args',_args);
  //  原接口(无需code)
  // const args = {
  //   ...this.o.args,
  //   'Top1$UserName': loginName,
  //   'Top1$PassWord': loginPwd
  // }
  // args['Top1$StuLogin.x'] = ~~(Math.random() * 30);
  // args['Top1$StuLogin.y'] = ~~(Math.random() * 30);

  // 新接口 参数
  const UName = jsEncrypt.encrypt(loginName);
  const pwd = jsEncrypt.encrypt(loginPwd);
  const args = {
    ..._args,
    UName,
    pwd,
    // pubKey: key,
    'UserName': loginName,
    UserPass: '******',
    // 'UserPass': loginPwd,
    "CheckCode": parseInt(code)
  }

  args['Btn_OK.x'] = ~~(Math.random() * 30 + 10);
  args['Btn_OK.y'] = ~~(Math.random() * 30 + 10);

  return args;
}