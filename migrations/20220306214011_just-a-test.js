exports.up = function (knex) {
  return Promise.all([
    knex.raw(`      
      ALTER TABLE items ADD COLUMN just_a_test_column TEXT;
    `),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.raw(`
      ALTER TABLE items DROP COLUMN just_a_test_column;
    `),
  ]);
};
