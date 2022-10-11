const InvariantError = require('../../exceptions/InvariantError');
const SongsAtPlaylistPayloadSchema = require('./schema');

const SongsAtPlaylistValidator = {
  validateSongsAtPlaylist: (payload) => {
    const validationResult = SongsAtPlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
module.exports = SongsAtPlaylistValidator;
