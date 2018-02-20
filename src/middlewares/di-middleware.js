module.exports = function createDIMiddleware(services) {
  return (ctx, next) => {
    ctx.state.services = services;
    return next();
  };
};
