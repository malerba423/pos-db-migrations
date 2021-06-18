exports.up = function (knex) {
  return Promise.all([
    knex.raw(`
      SET SEARCH_PATH TO foodtruck, public;
      
      CREATE OR REPLACE FUNCTION are_we_currently_open()
      RETURNS BOOL
      LANGUAGE PLPGSQL
      AS
      $$
      DECLARE
        overrideValue BOOL;
      BEGIN
        SELECT EXISTS (select * FROM foodtruck.hours_of_operation_overrides WHERE currently_taking_orders=TRUE)
        INTO overrideValue;
        
        RETURN overrideValue;
      END;
      $$;

    `),
  ]);
};

//the are_we_currently_open function that this creates is broken, but i wanted to have true UP / DOWN functions
exports.down = function (knex) {
  return Promise.all([
    knex.raw(`
      SET SEARCH_PATH TO foodtruck, public;
        
      CREATE OR REPLACE FUNCTION are_we_currently_open()
      RETURNS BOOL
      LANGUAGE PLPGSQL
      AS
      $$
      DECLARE
        overrideValue BOOL;
      BEGIN
        SELECT EXISTS (select * FROM foodtruck.hours_of_operation_overrides WHERE currently_taking_orders=TRUE)
        INTO overrideValue;
        
        RETURN (hoursValue AND NOT(holidayValue)) OR overrideValue;
      END;
      $$;
    `),
  ]);
};
