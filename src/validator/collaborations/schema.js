const Joi = require('joi');

const collabsPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = collabsPayloadSchema;
