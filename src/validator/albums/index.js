const ClientError = require('../../exceptions/ClientError');
const albumPayloadSchema = require('./schema');


const albumsValidator = {
  validateAlbumsPayload: (payload) => {
    const albumValidationResult = albumPayloadSchema.validate(payload);

    if (albumValidationResult.error) {
      throw new ClientError(albumValidationResult.error.message);
    }
  },
};


module.exports = albumsValidator;

