const {nanoid} = require('nanoid');
const {Pool} = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsAtPlaylistService {
  constructor(collaborationsService, playlistsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
  }

  async verifySongsAtPlaylistsAccess(playlistId, userId) {
    try {
      await this._playlistsService.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationsService.verifyCollabs(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }

  async verifySongsId(songId) {
    const query = {
      text: 'SELECT * FROM playlist_songs WHERE song_id = $1',
      values: [songId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Lagu tidak dapat ditemukan');
    }
  }

  async verifySongsById(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('lagu tidak ditemukan');
    }
  }

  async addPlaylistSong(songId, playlistId) {
    const id = `PS-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES ($1,$2,$3) RETURNING id',
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('lalalala');
    }
    return result.rows;
  }

  async getPlaylistByPlaylistId(playlistId) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
      FROM playlists
      LEFT JOIN users ON users.id = playlists.owner
      WHERE playlists.id= $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('resource tidak ditemukan');
    }
    return result.rows[0];
  }

  async getSongsByPlaylistId(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM songs
      LEFT JOIN playlist_songs
      ON songs.id = playlist_songs.song_id
      WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteSongsAtPlaylist(songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1',
      values: [songId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}
module.exports = SongsAtPlaylistService;
