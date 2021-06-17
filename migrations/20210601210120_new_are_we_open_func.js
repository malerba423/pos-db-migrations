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
        
        RETURN (hoursValue AND NOT(holidayValue)) OR overrideValue;
      END;
      $$;

    `),
  ]);
};

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
        hoursValue BOOL;
        holidayValue BOOL;
        overrideValue BOOL;
      BEGIN
        SELECT EXISTS (SELECT * FROM foodtruck.hours_of_operation 
        WHERE day_of_week=TRIM(TO_CHAR(NOW(),'day'))::foodtruck.dayofweek AND
        NOW()::time >= start_time::time AND
        NOW()::time <= end_time::time)
        INTO hoursValue;
        
        SELECT COUNT(*) FROM foodtruck.holidays WHERE date=NOW()::date
        INTO holidayValue;
        
        SELECT EXISTS (select * FROM foodtruck.hours_of_operation_overrides WHERE currently_taking_orders=TRUE)
        INTO overrideValue;
        
        RETURN (hoursValue AND NOT(holidayValue)) OR overrideValue;
      END;
      $$;
    `),
  ]);
};
