/* eslint-disable max-len */
require('dotenv').config();
const Jwt = require('@hapi/jwt');
const Hapi = require('@hapi/hapi');
const path = require('path');
const config = require('./utils/config');
const inert = require('@hapi/inert');

const albums = require('./api/albums');
const songs = require('./api/songs');
const AlbumsService = require('./service/postgres/AlbumsService');
const SongsService = require('./service/postgres/SongsService');
const albumsValidator = require('./validator/albums');
const songsValidator = require('./validator/songs');

// user
const UsersService = require('./service/postgres/UsersService');
const usersValidator = require('./validator/users');
const users = require('./api/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./service/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// playlists
const PlaylistsService = require('./service/postgres/PlaylistsService');
const playlists = require('./api/playlists');
const PlaylistsValidator = require('./validator/playlists');

// playlist_songs junction
const playlistSongs = require('./api/playlistSongs');
const SongsAtPlaylistValidator = require('./validator/playlistSongs');
const SongsAtPlaylistService = require('./service/postgres/PlaylistSongsService');
const ClientError = require('./exceptions/ClientError');

// Collaborations
const CollaborationsService = require('./service/postgres/CollaborationsService');
const collaborations = require('./api/collaborations');
const CollabsValidator = require('./validator/collaborations');

// Exports
const ProducerService = require('./service/rabbitmq/ProducerService');
const exportss = require('./api/exportss');
const ExportsValidator = require('./validator/exports');

// Uploads
const uploads = require('./api/uploads');
const StorageService = require('./service/storage/StorageService');
const UploadsValidator = require('./validator/uploads');
const UploadService = require('./service/postgres/UploadCover');

// Album Likes
const UserAlbumLikes = require('./service/postgres/UserAlbumLikes');
const albumLikes = require('./api/albumLikes');
const CacheService = require('./service/redis/CacheService');


const init = async () => {
  const cacheService = new CacheService();
  const collaborationsService = new CollaborationsService();
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService();
  const songsAtPlaylistService = new SongsAtPlaylistService(collaborationsService, playlistsService);
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));
  const userAlbumLikes = new UserAlbumLikes(cacheService);
  const uploadService = new UploadService();

  const server = Hapi.server({
    port: config.app.port,
    host: config.app.host,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // onPreResponse utk mencegah boilerplate code
  server.ext('onPreResponse', (request, h) => {
    // mendapat konteks response dari request
    const {response} = request;
    if (response instanceof Error) {
      // handling client error
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      // mempertahankan handling client error oleh hapi (404,dll)
      if (!response.isServer) {
        return h.continue;
      }
      // handling server error
      const newResponse = h.response({
        status: 'error',
        message: ' Maaf, Server kami sedang bermasalah',
      });
      newResponse.code(500);
      console.error(response);
      return newResponse;
    }
    // jika bukan error, lanjut response sebelumnya
    return h.continue;
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: inert,
    },
  ]);

  // JWT Auth strategy
  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
        username: artifacts.decoded.payload.username,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: albumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: songsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: usersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        UsersService: usersService,
        AuthenticationsService: authenticationsService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: playlistSongs,
      options: {
        songsAtPlaylistService,
        validator: SongsAtPlaylistValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        service: collaborationsService,
        playlistsService,
        validator: CollabsValidator,
      },
    },
    {
      plugin: exportss,
      options: {
        service: ProducerService,
        playlistsService,
        validator: ExportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        uploadService,
        validator: UploadsValidator,
      },
    },
    {
      plugin: albumLikes,
      options: {
        service: userAlbumLikes,
      },
    },
  ]);
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();


