const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  // eslint-disable-next-line max-len
  generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  // eslint-disable-next-line max-len
  generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  // verifikasi signature
  verifySignatureRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
      const {payload} = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Maaf, Token anda tidak valid');
    }
  },

};
module.exports = TokenManager;
