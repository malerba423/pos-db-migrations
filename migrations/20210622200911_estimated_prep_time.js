exports.up = function (knex) {
  return Promise.all([
    knex.raw(`
      SET SEARCH_PATH TO foodtruck, public;
      
      ALTER TABLE items ADD COLUMN estimated_prep_time_minutes INTEGER NOT NULL DEFAULT 0;
    `),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.raw(`
      SET SEARCH_PATH TO foodtruck, public;
      
      ALTER TABLE items DROP COLUMN estimated_prep_time_minutes;
    `),
  ]);
};
