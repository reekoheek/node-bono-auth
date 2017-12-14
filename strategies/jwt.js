const jwt = require('jsonwebtoken');

module.exports = function ({ secret, getToken = getTokenFromHeader, generateExpire = generateDefaultExpire }) {
  let strategy = async function (ctx) {
    let token = await getToken(ctx);
    if (!token) {
      return;
    }

    let user = jwt.verify(token, secret);
    let exp = new Date(user.exp * 1000);
    if (exp <= new Date()) {
      return;
    }

    return user;
  };

  strategy.createToken = function (args) {
    const exp = generateExpire();
    let token = jwt.sign({ ...args }, secret);
    return { ...args };
  };

  return strategy;
};

function generateDefaultExpire () {
  const today = new Date();
  const expDate = new Date(today);
  expDate.setDate(today.getDate() + 1);
  return parseInt(expDate.getTime() / 1000);
}

function getTokenFromHeader (ctx) {
  let matches = ctx.get('Authorization').match(/^Bearer\s+([^\s]+)/);
  if (!matches) {
    return;
  }
  return matches[1];
}
