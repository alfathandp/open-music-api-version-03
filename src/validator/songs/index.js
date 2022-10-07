const ClientError = require('../../exceptions/ClientError');
const songsPayloadSchema = require('./schema');

const songsValidator = {
  validateSongsPayload: (payload) => {
    const songsValidationResult = songsPayloadSchema.validate(payload);
    if (songsValidationResult.error) {
      throw new ClientError(songsValidationResult.error.message);
    }
  },
};

module.exports = songsValidator;
