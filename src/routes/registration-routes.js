const Router = require('koa-router');

module.exports = function createRegistrationRoutes(prefix) {
  const router = new Router({ prefix });
  return router
    .post('/', async (ctx) => {
      const { registrationService, authService } = ctx.state.services;
      const { name, email, password } = ctx.request.body;
      await registrationService.register(name, email, password);
      ctx.body = await authService.authenticate(email, password);
    })
  ;
};
