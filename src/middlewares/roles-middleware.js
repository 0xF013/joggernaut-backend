module.exports = (...roles) =>
  async (ctx, next) => {
    const { user } = ctx.state;

    // check for roles
    if (!user.roles.find(r => roles.includes(r))) {
      // check for owner
      if (roles.includes('owner') && user.id !== Number(ctx.params.userId)) {
        ctx.throw(401, 'Unauthorized');
      }
    }

    return next();
  };
