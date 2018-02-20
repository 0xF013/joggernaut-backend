const Router = require('koa-router');

module.exports = function createSessionRoute(prefix, { accessToken }) {
  const router = new Router({ prefix });
  return router
    .post('/', async (ctx) => {
      const { authService } = ctx.state.services;
      const { email, password } = ctx.request.body;
      const authenticationPayload = await authService.authenticate(email, password);
      if (!authenticationPayload) {
        ctx.throw(401);
      }
      ctx.body = authenticationPayload;
    })
    .delete('/', accessToken(), async (ctx) => {
      const { authService } = ctx.state.services;
      await authService.logout(ctx.state.accessToken);
      ctx.status = 200;
    })
  ;
};
