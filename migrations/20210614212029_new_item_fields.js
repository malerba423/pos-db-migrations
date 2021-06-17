exports.up = function (knex) {
  return Promise.all([
    knex.raw(`
      SET SEARCH_PATH TO foodtruck, public;
      
      ALTER TABLE items ADD COLUMN recipe_text TEXT;
      ALTER TABLE items ADD COLUMN assembly_text TEXT;
      ALTER TABLE items ADD COLUMN image_src_base64 TEXT;
    `),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.raw(`
      SET SEARCH_PATH TO foodtruck, public;
      
      ALTER TABLE items DROP COLUMN recipe_text;
      ALTER TABLE items DROP COLUMN assembly_text;
      ALTER TABLE items DROP COLUMN image_src_base64;
    `),
  ]);
};
