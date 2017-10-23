# node-bono-auth

```sh
npm i bono-auth
```

```js
const Bundle = require('bono');
const auth = require('bono-auth');

const secret = 'this is secret';
const app = new Bundle();

auth.use(async ctx => {
  let { username, password } = await ctx.parse();
  if (username === 'admin' && password === 'password') {
    return { username };
  }
});

const api = new Bundle();
api.use(auth.authenticate());
app.bundle('/api', api);
app.bundle('/auth', new auth.Bundle());

app.listen(3000, () => console.log('Listening at http://localhost:3000'));
```
