const AlbumsLikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albumLikes',
  version: '1.0.0',
  register: async (server, {service}) => {
    const albumsLikesHandler = new AlbumsLikesHandler(service);
    server.route(routes(albumsLikesHandler));
  },
};
