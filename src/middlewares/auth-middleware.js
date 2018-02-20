module.exports = () =>
  async (ctx, next) => {
    const { accessToken } = ctx.state;
    if (!accessToken) {
      ctx.throw(401, 'Missing access token');
    }

    const { authService } = ctx.state.services;
    const user = await authService.getUserByAccessToken(accessToken);
    if (!user) {
      ctx.throw(401, 'Invalid access token');
    }

    ctx.state.user = user;

    return next();
  };
