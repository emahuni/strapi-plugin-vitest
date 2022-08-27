import path from 'path';

export default ({ env }) => ({
  connection: {
    client:           'sqlite',
    connection:       {
      filename: path.resolve(process.env.PWD, env('DATABASE_FILENAME', '.tmp/data.db')),
    },
    useNullAsDefault: true,
  },
});
