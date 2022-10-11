const autoBind = require('auto-bind');

class AlbumsLikesHandler {
  constructor(service) {
    this._service = service;

    autoBind(this);
  }

  async postLikesHandler(request, h) {
    const {id} = request.params;
    const {id: credentialId} = request.auth.credentials;
    await this._service.verifyAlbums(id);
    await this._service.verifyLikes(credentialId, id);
    const response = h.response({
      status: 'success',
      message: 'terimakasih',
    }).code(201);
    return response;
  }

  async getLikesHandler(request, h) {
    const {id} = request.params;
    const {likes, isCache} = await this._service.getLikes(id);
    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    if (isCache) {
      response.header('X-Data-Source', 'cache');
    }
    return response;
  }
}
module.exports = AlbumsLikesHandler;
