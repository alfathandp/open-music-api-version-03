const Joi = require('joi');

const SongsAtPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});
module.exports = SongsAtPlaylistPayloadSchema;
