module.exports = () =>
  async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      if (err.validationErrors) {
        ctx.status = 422;
        ctx.body = err.validationErrors;
      } else {
        ctx.body = { message: err.message };
        ctx.status = err.status || 500;
      }
    }
  };
