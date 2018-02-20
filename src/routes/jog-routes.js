const Router = require('koa-router');

module.exports = function createFeatureRoutes(prefix) {
  const router = new Router({ prefix });
  return router
    .get('/', async (ctx) => {
      const { jogService } = ctx.state.services;
      ctx.body = await jogService.fetchForUser(ctx.params.userId);
    })
    .get('/averages', async (ctx) => {
      const { jogService } = ctx.state.services;
      ctx.body = await jogService.getAverages(ctx.params.userId);
    })
    .post('/', async (ctx) => {
      const { jogService } = ctx.state.services;
      const { date, distance: km, duration } = ctx.request.body;
      const jogId = await jogService.create(ctx.params.userId, { date, km, duration });
      ctx.body = await jogService.getJogById(jogId);
    })
    .put('/:jogId', async (ctx) => {
      const { jogService } = ctx.state.services;
      const { date, distance: km, duration } = ctx.request.body;
      const jogId = await jogService.update(
        ctx.params.jogId,
        ctx.params.userId,
        { date, km, duration }
      );
      ctx.body = await jogService.getJogById(jogId);
    })
    .delete('/:jogId', async (ctx) => {
      const { jogService } = ctx.state.services;
      await jogService.delete(ctx.params.jogId, ctx.params.userId);
      ctx.status = 200;
    })
  ;
};
