exports.up = function (knex) {
  return Promise.all([
    knex.raw(`
      SET SEARCH_PATH TO foodtruck, public;
      
      ALTER TABLE orders ADD COLUMN queue_length INTEGER NOT NULL DEFAULT 1;
    `),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.raw(`
      SET SEARCH_PATH TO foodtruck, public;
      
      ALTER TABLE orders DROP COLUMN queue_length;
    `),
  ]);
};
