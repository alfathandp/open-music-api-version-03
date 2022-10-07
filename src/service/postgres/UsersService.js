const {nanoid} = require('nanoid');
const {Pool} = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyCredentials(username, password) {
    const query = {
      text: 'SELECT id, password from users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthenticationError('Maaf, Kredensial yang anda berikan salah');
    }
    const {id, password: hashedPassword} = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) {
      throw new AuthenticationError('Maaf, Kredensial yang Anda berikan salah');
    }

    return id;
  }

  async verifyUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);
    if (result.rowCount > 0) {
      throw new InvariantError('Maaf username telah digunakan');
    }
  }
  async addUsers(username, password, fullname) {
    await this.verifyUsername(username);
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 12);
    const query = {
      text: 'INSERT INTO users VALUES ($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Maaf, User gagal ditambahkan');
    }
    return result.rows[0].id;
  }
}
module.exports = UsersService;
