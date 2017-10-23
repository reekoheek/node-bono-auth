const Bundle = require('./bundle');

class Auth {
  constructor ({ strategies = [] } = {}) {
    const auth = this;

    this.Auth = Auth;
    this.Bundle = class extends Bundle {
      constructor () {
        super({ auth });
      }
    };

    this.strategies = strategies;
  }

  use (strategy, name = '') {
    if (typeof strategy !== 'function') {
      throw new Error('Strategy must be function');
    }

    if (name) {
      strategy.name = name;
    }

    this.strategies.push(strategy);
  }

  authenticate () {
    let { strategies } = this;

    return async function (ctx, next) {
      let user = ctx.state.user;

      if (!user) {
        for (let fn of strategies) {
          user = await fn(ctx);
          if (user) {
            break;
          }
        }
      }

      if (!user) {
        ctx.throw(401);
      }

      ctx.state.user = user;
      await next();
    };
  }
}

module.exports = Auth;
