/* eslint-disable max-len */
const UploadsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, {service, uploadService, validator}) => {
    const uploadsHandler = new UploadsHandler(service, uploadService, validator);
    server.route(routes(uploadsHandler));
  },
};
