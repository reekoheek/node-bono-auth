# node-bono-auth

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

app.use(auth.authenticate({ excludes: [ '/auth' ] }));

app.bundle('/auth', new auth.Bundle({ secret }));

app.listen(3000);
```
