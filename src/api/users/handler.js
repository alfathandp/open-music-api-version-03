const autoBind = require('auto-bind');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUsersHandler(request, h) {
    this._validator.validateUsersPayload(request.payload);
    const {username, password, fullname} = request.payload;
    const userId = await this._service.addUsers(username, password, fullname);
    const response = h.response({
      status: 'success',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }
}
module.exports = UsersHandler;
