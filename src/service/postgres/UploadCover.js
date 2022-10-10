const {Pool} = require('pg');

class UploadService {
  constructor() {
    this._pool = new Pool;
  }

  async addCoverUrl(path, albumId) {
    const query = {
      text: 'UPDATE albums SET "coverUrl"= $1 WHERE id = $2',
      values: [path, albumId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}
module.exports = UploadService;
