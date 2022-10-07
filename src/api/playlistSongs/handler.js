/* eslint-disable max-len */
const autoBind = require('auto-bind');

class PlaylistSongsHandler {
  constructor(songsAtPlaylistService, validator) {
    this._songsAtPlaylistService = songsAtPlaylistService;
    this._validator = validator;

    autoBind(this);
  }

  async postSongsAtPlaylistHandler(request, h) {
    const {id} = request.params;
    this._validator.validateSongsAtPlaylist(request.payload);
    const {songId} = request.payload;
    const {id: credentialId} = request.auth.credentials;
    await this._songsAtPlaylistService.verifySongsAtPlaylistsAccess(id, credentialId);
    await this._songsAtPlaylistService.verifySongsById(songId);
    const playlists = await this._songsAtPlaylistService.addPlaylistSong(songId, id);
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke dalam Playlist',
      data: {
        playlists,
      },
    }).code(201);
    return response;
  }

  async getSongsAtPlaylistHandler(request, h) {
    const {id} = request.params;
    const {id: credentialId} = request.auth.credentials;
    await this._songsAtPlaylistService.verifySongsAtPlaylistsAccess(id, credentialId);
    const playlist = await this._songsAtPlaylistService.getPlaylistByPlaylistId(id);
    const songs = await this._songsAtPlaylistService.getSongsByPlaylistId(id);
    playlist.songs = songs;
    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deleteSongsAtPlaylistHandler(request) {
    const {id} = request.params;
    this._validator.validateSongsAtPlaylist(request.payload);
    const {songId} = request.payload;
    const {id: credentialId} = request.auth.credentials;
    await this._songsAtPlaylistService.verifySongsAtPlaylistsAccess(id, credentialId);
    await this._songsAtPlaylistService.verifySongsId(songId);
    await this._songsAtPlaylistService.deleteSongsAtPlaylist(songId);
    return {
      status: 'success',
      message: 'Lagu Berhasil Dihapus Dari Playlist',
    };
  }
}
module.exports = PlaylistSongsHandler;
