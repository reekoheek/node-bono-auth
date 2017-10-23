const Bundle = require('bono/bundle');

class AuthBundle extends Bundle {
  constructor ({ auth }) {
    super();

    this.auth = auth;

    this.post('/signin', this.signin.bind(this));
    // this.post('/signout', this.signout.bind(this));
  }

  async signin (ctx) {
    let authenticate = this.auth.authenticate();
    await authenticate(ctx, () => {});
    ctx.body = ctx.state.user;
  }

  // async signout (ctx) {
  //
  // }
}

module.exports = AuthBundle;
