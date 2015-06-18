var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'library-server'
    },
    port: 8888,
    db: 'mongodb://localhost/library-server-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'library-server'
    },
    port: 8888,
    db: 'mongodb://localhost/library-server-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'library-server'
    },
    port: 8888,
    db: 'mongodb://localhost/library-server-production'
  }
};

module.exports = config[env];
