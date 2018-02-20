module.exports = () =>
  (ctx, next) => {
    const authHeaderString = ctx.headers.authorization;
    if (authHeaderString && authHeaderString.startsWith('Bearer')) {
      const accessToken = authHeaderString.split('Bearer').pop().trim();
      ctx.state.accessToken = accessToken;
    }
    return next();
  };
