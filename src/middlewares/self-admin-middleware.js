module.exports = function selfAdmin() {
  return async (ctx, next) => {
    const { userService } = ctx.state.services;
    const { userId } = ctx.params;
    const updatedUser = await userService.getUserById(userId);
    if (updatedUser && updatedUser.roles.includes('admin')) {
      if (!ctx.state.user.roles.includes('admin')) {
        ctx.throw(401, 'Only admin can update admin');
      }
    }
    return next();
  };
}
