const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, {
    UsersService,
    AuthenticationsService,
    tokenManager,
    validator,
  }) => {
    const authenticationsHandler = new AuthenticationsHandler(
        UsersService,
        AuthenticationsService,
        tokenManager,
        validator,
    );
    server.route(routes(authenticationsHandler));
  },
};
