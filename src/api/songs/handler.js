const autoBind = require('auto-bind');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongsHandler(request, h) {
    this._validator.validateSongsPayload(request.payload);
    const {
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    } = request.payload;
    const songId = await this._service.addSongs(
        title,
        year,
        performer,
        genre,
        duration,
        albumId,
    );
    const response = h.response({
      status: 'success',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getAllSongsHandler() {
    const songs = await this._service.getAllSongs();
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongsByIdHandler(request, h) {
    const {id} = request.params;
    const song = await this._service.getSongsById(id);

    const response = h.response({
      status: 'success',
      data: {
        song,
      },
    });
    return response;
  }

  async putSongsByIdHandler(request, h) {
    this._validator.validateSongsPayload(request.payload);
    const {
      title,
      year,
      genre,
      performer,
      duration,
      albumId = null,
    } = request.payload;
    const {id} = request.params;
    await this._service.editSongsById(
        id,
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
    );
    return {
      status: 'success',
      message: 'Selamat, lagu berhasil diperbarui',
    };
  }

  async deleteSongsByIdHandler(request, h) {
    const {id} = request.params;
    await this._service.deleteSongsById(id);

    return {
      status: 'success',
      message: 'Selamat, lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
