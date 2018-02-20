const Router = require('koa-router');

module.exports = function createFeatureRoutes(prefix, { accessToken, auth, roles, selfAdmin }) {
  const router = new Router({ prefix });
  return router
    .use(accessToken())
    .use(auth())
    .get('/', roles('user_manager', 'admin'), async (ctx) => {
      const { userService } = ctx.state.services;
      ctx.body = await userService.getAll();
    })
    .put('/:userId', roles('owner', 'user_manager', 'admin'), selfAdmin(), async (ctx) => {
      const { userService } = ctx.state.services;
      const { userId } = ctx.params;
      const { name, email, password } = ctx.request.body;
      ctx.body = await userService.update(
        Number(userId),
        name, email, password
      );
    })
    .put('/:userId/roles', roles('admin'), async (ctx) => {
      const { userService } = ctx.state.services;
      const { userId } = ctx.params;
      const { roles } = ctx.request.body;
      ctx.body = await userService.updateRoles(
        Number(userId),
        roles
      );
    })
    .post('/', roles('user_manager', 'admin'), async (ctx) => {
      const { userService } = ctx.state.services;
      const { name, email, password } = ctx.request.body;
      ctx.body = await userService.create(
        name, email, password
      );
    })
    .delete('/:userId', roles('admin'), async (ctx) => {
      const { userService, jogService } = ctx.state.services;
      const { userId } = ctx.params;
      await userService.delete(userId);
      await jogService.deleteByUserId(userId);
      ctx.status = 200;
    })
  ;
};
