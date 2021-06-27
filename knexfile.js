let testEnv = {};
let prodEnv = {};
try {
  testEnv = require("./knexfile.test");
  prodEnv = require("./knexfile.production");
} catch (e) {}

module.exports = {
  development: {
    client: "postgresql",
    connection: "postgresql://postgres:postgres@localhost:5432/postgres",
    migrations: {
      tableName: "knex_migrations",
    },
  },

  ...testEnv,
  ...prodEnv,
};