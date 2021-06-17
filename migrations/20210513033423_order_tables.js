exports.up = function (knex) {
  return Promise.all([
    knex.raw(`
      SET SEARCH_PATH TO foodtruck, public;

      CREATE TABLE items (
        id                SERIAL PRIMARY KEY                                        ,
        name              TEXT NOT NULL                                             ,
        description       TEXT                                                      ,
        price             DECIMAL DEFAULT 0                                         ,
        available_options JSON NOT NULL DEFAULT '[]'                                ,
        default_options   JSON NOT NULL DEFAULT '[]'                                ,
        gluten_free       BOOL DEFAULT FALSE                                        ,
        vegetarian        BOOL DEFAULT FALSE                                        ,
        vegan             BOOL DEFAULT FALSE                                        ,
        active            BOOL DEFAULT TRUE                                         ,
        sold_out          BOOL DEFAULT FALSE                                        ,
        option_logic      TEXT NOT NULL DEFAULT 1                                   ,
        menu_grouping     TEXT                                                      
      );

      CREATE TABLE item_options (
        id                SERIAL PRIMARY KEY                                        ,
        name              TEXT NOT NULL                                             ,
        description       TEXT                                                      ,
        grouping          TEXT                                                      ,
        price             DECIMAL DEFAULT 0                                         ,
        active            BOOL DEFAULT TRUE                                         ,
        sold_out          BOOL DEFAULT FALSE                                        
      );

      CREATE TABLE menu_groupings (
        id                SERIAL PRIMARY KEY                                        ,
        index             INTEGER NOT NULL                                          ,
        name              TEXT NOT NULL                                             ,
        active            BOOL DEFAULT TRUE                                         
      );

      ALTER TABLE orders RENAME COLUMN subtotal TO pre_tax;
      ALTER TABLE orders ADD COLUMN notes TEXT;

      INSERT INTO menu_groupings (index, name) VALUES
      (1,'Entrees'),
      (2,'Drinks');

      INSERT INTO items (name, description, price, available_options, default_options, gluten_free, vegetarian, vegan, option_logic, menu_grouping) VALUES 
      ('Pulled Pork Burrito','-',11,'[1,2,3,4,5,6]','[1,2,3,4,5]',false,false,false,'N','Entrees'),
      ('Thai Basil Salad','-',10,'[1,2,6,7,8,9,10,11,12,13]','[6,7,8,9,10,11,12,13]',true,true,true,'N','Entrees'),
      ('Soda','-',1,'[15,16,17]','[]',false,false,false,'1','Drinks'),
      ('Beer','-',NULL,'[18,19]','[]',false,false,false,'1','Drinks');

      INSERT INTO item_options (name, description, grouping, price) VALUES 
      ('Rice', '-', 'Grain', NULL),
      ('Black Beans', '-', 'Veggie', NULL),
      ('Cotija Cheese', '-', 'Dairy', NULL),
      ('Pulled Pork', '-', 'Meat', NULL),
      ('Carolina BBQ Sauce', '-', 'Sauce', NULL),
      ('Corn', '-', 'Veggie', NULL),
      ('Basil', '-', 'Veggie', NULL),
      ('Mint', '-', 'Veggie', NULL),
      ('Cilantro', '-', 'Veggie', NULL),
      ('Onions', '-', 'Veggie', NULL),
      ('Edamame', '-', 'Veggie', NULL),
      ('Lime', '-', 'Veggie', NULL),
      ('Thai Chiles', '-', 'Veggie', NULL),
      ('Kimchi', '-', 'Veggie', NULL),
      ('Coke', '-', 'Soda', NULL),
      ('Pepsi', '-', 'Soda', NULL),
      ('Root Beer', '-', 'Soda', NULL),
      ('Party in the Woods', '-', 'Beer', 5),
      ('PBR', '-', 'Beer', 3);
    `),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.raw(`
      SET SEARCH_PATH TO foodtruck, public;

      ALTER TABLE orders DROP COLUMN IF EXISTS notes;
      ALTER TABLE orders RENAME COLUMN pre_tax TO subtotal;

      DROP TABLE IF EXISTS menu_groupings;
      DROP TABLE IF EXISTS item_options;
      DROP TABLE IF EXISTS items;
    `),
  ]);
};
