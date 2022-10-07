const ClientError = require('../../exceptions/ClientError');
const UserPayloadSchema = require('./schema');

const usersValidator = {
  validateUsersPayload: (payload) => {
    const UsersValidationResult = UserPayloadSchema.validate(payload);
    if (UsersValidationResult.error) {
      throw new ClientError(UsersValidationResult.error.message);
    }
  },
};
module.exports = usersValidator;
