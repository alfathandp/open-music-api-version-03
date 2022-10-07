const ClientError = require('../../exceptions/ClientError');
const collabsPayloadSchema = require('./schema');

const CollabsValidator = {
  validateCollabsPayload: (payload) => {
    const validationResult = collabsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new ClientError(validationResult.error.message);
    }
  },
};

module.exports = CollabsValidator;
