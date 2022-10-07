const InvariantError = require('../../exceptions/InvariantError');
const postPlaylistPayloadSchema = require('./schema');

const PlaylistsValidator = {
  validatePostPlaylistPayload: (payload) => {
    const validationResult = postPlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
module.exports = PlaylistsValidator;
