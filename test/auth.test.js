const Bundle = require('bono');
const test = require('supertest');

const { Auth } = require('../');

describe('auth', () => {
  let auth;

  beforeEach(() => {
    auth = new Auth();
  });

  describe('default auth', () => {
    it('fail on empty auth', async () => {
      let app = new Bundle();

      app.use(auth.authenticate());
      app.get('/', ctx => {
        ctx.body = 'OK';
      });

      await test(app.callback()).get('/').expect(401);
    });

    it('success auth', async () => {
      let app = new Bundle();

      auth.use(ctx => {
        if (ctx.get('X-Token') === 'valid-token') {
          return { username: 'foo' };
        }
      });

      app.use(auth.authenticate());
      app.get('/', ctx => {
        ctx.body = 'OK';
      });

      await test(app.callback()).get('/')
        .set('X-Token', 'valid-token')
        .expect(200).expect('OK');

      await test(app.callback()).get('/')
        .set('X-Token', 'invalid-token')
        .expect(401);
    });
  });
});
