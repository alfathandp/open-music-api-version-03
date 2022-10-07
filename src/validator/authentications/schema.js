const Joi = require('joi');

const postAuthPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const putAuthPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const deleteAuthPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {
  postAuthPayloadSchema,
  putAuthPayloadSchema,
  deleteAuthPayloadSchema,
};
