/* eslint-disable max-len */
const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor(service, playlistsService, validator) {
    this._service = service;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postCollabsHandler(request, h) {
    this._validator.validateCollabsPayload(request.payload);
    const {playlistId, userId} = request.payload;
    const {id: credentialId} = request.auth.credentials;
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.verifyUserById(userId);
    const collaborationId = await this._service.addCollaboration(playlistId, userId);
    const response = h.response({
      status: 'success',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollabsHandler(request) {
    this._validator.validateCollabsPayload(request.payload);
    const {playlistId, userId} = request.payload;
    const {id: credentialId} = request.auth.credentials;
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deleteCollaboration(playlistId, userId);
    return {
      status: 'success',
      message: 'kolaborasi berhasil dihapus',
    };
  }
}
module.exports = CollaborationsHandler;
