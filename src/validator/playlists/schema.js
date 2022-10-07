const Joi = require('joi');

const postPlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = postPlaylistPayloadSchema;
