const {nanoid} = require('nanoid');
const {Pool} = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool;
  }

  async addSongs(title, year, performer, genre, duration, albumId) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7)RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getAllSongs() {
    const {rows} = await this._pool.query(`SELECT id, title, 
    performer FROM songs`);

    return rows;
  }

  async getSongsById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Lagu gagal ditampilkan, id tidak ditemukan');
    }
    return result.rows[0];
  }

  async editSongsById(id, title, year, genre, performer, duration, albumId) {
    const query = {
      text: `UPDATE songs SET title = $1, year = $2, genre = $3, performer=$4, 
      duration = $5, "albumId" = $6 WHERE id = $7 RETURNING id`,
      values: [title, year, genre, performer, duration, albumId, id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Lagu gagal diperbarui, id tidak ditemukan');
    }
  }

  async deleteSongsById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id=$1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Lagu gagal dihapus, id tidak difasfatemukan');
    }
  }
};


module.exports = SongsService;
