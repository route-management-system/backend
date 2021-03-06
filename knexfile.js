require("dotenv").config()

module.exports = {

  development: {
    client: 'pg',
    connection: {
      host : 'localhost',
      user : 'postgres',
      password : 'postgrespass',
      database : 'RouteMgmt'
    },
    migrations: {
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/seeds'
    },
    useNullAsDefault: true
  },

  testing: {
    client: 'pg',
    connection:'postgres://localhost/RouteMgmt',
    migrations: {
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/seeds'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/seeds'
    },
    useNullAsDefault: true
  }

};
