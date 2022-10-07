exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
  // constraint unique (agar tidak duplikasi)
  pgm.addConstraint('collaborations',
      'unique_playlist_id_and_user_id',
      'UNIQUE(playlist_id, user_id)',
  );

  // foreign key playlist_id terhadap platlists.id
  pgm.addConstraint('collaborations',
      'fk_collaborations.playlist_id_playlists.id',
      'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE',
  );

  // foreign key user_id terhadapt users.id
  pgm.addConstraint('collaborations',
      'fk_collaborations_user_id_users.id',
      'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('collaborations');
};
