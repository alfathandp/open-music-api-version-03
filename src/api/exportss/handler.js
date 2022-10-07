const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(service, playlistsService, validator) {
    this._service = service;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportPlaylistHandler(request, h) {
    const {playlistId} = request.params;
    this._validator.validateExportPlaylistSchema(request.payload);
    const {id: credentialId} = request.auth.credentials;
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    const message = {
      userId: request.auth.credentials.id,
      targetEmail: request.payload.targetEmail,
    };

    await this._service.sendMessage('export:playlist', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    }).code(201);
    return response;
  }
}
module.exports = ExportsHandler;
