exports.up = function (knex) {
  return Promise.all([
    knex.raw(`
      SET SEARCH_PATH TO foodtruck, public;
      ALTER TABLE orders ALTER COLUMN stripe_paymentintent_id DROP NOT NULL;
    `),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.raw(`
      SET SEARCH_PATH TO foodtruck, public;
      ALTER TABLE orders ALTER COLUMN stripe_paymentintent_id SET NOT NULL;
    `),
  ]);
};
