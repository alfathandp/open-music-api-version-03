const autoBind = require('auto-bind');

class AuthenticationsHandler {
  constructor(UsersService, AuthenticationsService, tokenManager, validator) {
    this._UsersService = UsersService;
    this._AuthenticationsService = AuthenticationsService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    autoBind(this);
  }

  async postAuthenticationHandler(request, h) {
    this._validator.validatePostAuthPayload(request.payload);
    const {username, password} = request.payload;
    const id = await this._UsersService.verifyCredentials(username, password);
    const accessToken = this._tokenManager.generateAccessToken({id});
    const refreshToken = this._tokenManager.generateRefreshToken({id});
    await this._AuthenticationsService.addRefreshToken(refreshToken);
    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request, h) {
    this._validator.validatePutAuthPayload(request.payload);
    const {refreshToken} = request.payload;
    await this._AuthenticationsService.verifyRefreshToken(refreshToken);
    const {id} = this._tokenManager.verifySignatureRefreshToken(refreshToken);
    const accessToken = this._tokenManager.generateAccessToken({id});
    return {
      status: 'success',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(request, h) {
    this._validator.validateDeleteAuthPayload(request.payload);
    const {refreshToken} = request.payload;
    await this._AuthenticationsService.verifyRefreshToken(refreshToken);
    await this._AuthenticationsService.deleteRefreshToken(refreshToken);
    return {
      status: 'success',
      message: ' Anda Berhasil Logout',
    };
  }
}
module.exports = AuthenticationsHandler;
