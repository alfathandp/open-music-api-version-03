const autoBind = require('auto-bind');

class UploadsHandler {
  constructor(service, uploadService, validator) {
    this._service = service;
    this._uploadService = uploadService;
    this._validator = validator;

    autoBind(this);
  }
  async postUploadCoversHandler(request, h) {
    const {cover} = request.payload;
    const {id} = request.params;
    this._validator.validateImageHeaders(cover.hapi.headers);
    const filename = await this._service.writeFile(cover, cover.hapi);
    const path = `http://${process.env.HOST}:${process.env.PORT}/albums/${id}/covers/${filename}`;
    await this._uploadService.addCoverUrl(path, id);
    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
      data: {
        path,
      },
    }).code(201);
    return response;
  }
}
module.exports = UploadsHandler;
