const usersRoutes = (handler) => [{
  method: 'POST',
  path: '/users',
  handler: handler.postUsersHandler,
}];
module.exports = usersRoutes;
