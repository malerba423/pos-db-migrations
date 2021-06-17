exports.up = function (knex) {
  return Promise.all([
    knex.raw(`
      CREATE SCHEMA IF NOT EXISTS foodtruck;
      SET SEARCH_PATH TO foodtruck, public;

      CREATE EXTENSION pgcrypto;

      CREATE OR REPLACE FUNCTION trigger_set_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TABLE users (
        id          SERIAL PRIMARY KEY                                             ,
        email       TEXT NOT NULL UNIQUE                                           ,
        password    TEXT NOT NULL                                                  ,
        first_name  TEXT                                                           ,
        last_name   TEXT                                                           ,
        active      BOOL DEFAULT TRUE                                              ,
        inserted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP    ,
        updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE orders (
        id              SERIAL PRIMARY KEY                                          ,
        checkout_type   TEXT NOT NULL                                               ,
        order_status    TEXT NOT NULL DEFAULT 'NEW'                                 ,
        stripe_paymentintent_id   TEXT NOT NULL                                     ,
        inserted_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP ,
        updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP ,
        items           JSON                                                        ,
        tip             JSON                                                        ,
        sales_tax       TEXT NOT NULL                                               ,
        sales_tax_rate  TEXT NOT NULL                                               ,
        subtotal        TEXT NOT NULL                                               ,
        total           TEXT NOT NULL                      
      );

      CREATE TRIGGER set_timestamp BEFORE UPDATE ON orders FOR EACH ROW
      EXECUTE PROCEDURE trigger_set_timestamp();

      CREATE TRIGGER set_timestamp BEFORE UPDATE ON users FOR EACH ROW
      EXECUTE PROCEDURE trigger_set_timestamp();

    `),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.raw(`
      SET SEARCH_PATH TO foodtruck, public;

      DROP TRIGGER IF EXISTS set_timestamp ON orders;
      DROP TRIGGER IF EXISTS set_timestamp ON users;
      
      DROP FUNCTION IF EXISTS trigger_set_timestamp;

      DROP EXTENSION IF EXISTS pgcrypto;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS orders;

      SET SEARCH_PATH TO public;
      DROP SCHEMA IF EXISTS foodtruck;
    `),
  ]);
};
