const {nanoid} = require('nanoid');
const {Pool} = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserAlbumLikes {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async verifyAlbums(albumId) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan bro');
    }
  }

  async verifyLikes(userId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1',
      values: [userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      await this.addLikes(userId, albumId);
    } else {
      await this.removeLikes(userId, albumId);
    }
  }

  async addLikes(userId, albumId) {
    const id = `like-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1,$2,$3)',
      values: [id, userId, albumId],
    };
    const result = await this._pool.query(query);
    await this._cacheService.delete(`likes: ${albumId}`);
    return result.rows;
  }

  async removeLikes(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };
    const result = await this._pool.query(query);
    await this._cacheService.delete(`likes: ${albumId}`);
    return result.rows;
  }

  async getLikes(albumId) {
    try {
      const result = await this._cacheService.get(`likes: ${albumId}`);
      return JSON.parse(result.rowCount);
    } catch (error) {
      const query = {
        text: 'SELECT user_id FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };
      const result = await this._pool.query(query);
      await this._cacheService.set(`likes: ${albumId}`, JSON.stringify(result));
      return result.rowCount;
    }
  }
}
module.exports = UserAlbumLikes;
