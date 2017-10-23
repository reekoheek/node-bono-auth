const test = require('supertest');
const Bundle = require('bono');
const { Auth } = require('../../');
const unless = require('koa-unless');
const assert = require('assert');

describe('strategy: jwt', () => {
  let auth = new Auth();
  beforeEach(() => {
    auth = new Auth();
  });

  it('fail', async () => {
    let app = new Bundle();

    let jwtStrategy = require('../../strategies/jwt')({ secret: 'this is secret' });
    auth.use(jwtStrategy);
    auth.use(async ctx => {
      if (ctx.method !== 'POST') {
        return;
      }

      let { username, password } = await ctx.parse();
      if (username === 'foo' && password === 'bar') {
        return jwtStrategy.createToken({ username });
      }
    });
    app.use(unless.call(auth.authenticate(), { path: [ /^\/auth/ ] }));

    app.get('/foo', ctx => {
      ctx.body = 'bar';
    });
    app.bundle('/auth', new auth.Bundle());

    await test(app.callback()).get('/foo').expect(401);
    let { body: { username, token } } = await test(app.callback())
      .post('/auth/signin')
      .send({ username: 'foo', password: 'bar' })
      .expect(200);

    assert.equal(username, 'foo');

    await test(app.callback())
      .get('/foo')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('bar');
  });
});
