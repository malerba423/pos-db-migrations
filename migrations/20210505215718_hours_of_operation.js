exports.up = function (knex) {
  return Promise.all([
    knex.raw(`
      SET SEARCH_PATH TO foodtruck, public;

      CREATE TYPE DAYOFWEEK AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

      CREATE TABLE hours_of_operation (
        id              SERIAL PRIMARY KEY                                          ,
        day_of_week     DAYOFWEEK UNIQUE NOT NULL                                   ,
        start_time      TEXT NOT NULL                                               ,
        end_time        TEXT NOT NULL                                               
      );

      CREATE TABLE hours_of_operation_overrides (
        id                        SERIAL PRIMARY KEY                                ,
        currently_taking_orders   BOOL DEFAULT FALSE                                
      );

      CREATE TABLE holidays (
        id              SERIAL PRIMARY KEY                                          ,
        holiday_name    TEXT                                                        ,
        notes           TEXT                                                        ,
        date            DATE NOT NULL                                               
      );

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

      INSERT INTO hours_of_operation_overrides (currently_taking_orders) VALUES 
      (false);

      INSERT INTO holidays (holiday_name, date) VALUES 
      ('memorial day','5/31/2021'),
      ('labor day','9/6/2021'),
      ('july fourth','7/4/2021');

      INSERT INTO hours_of_operation (day_of_week, start_time, end_time) VALUES 
      ('monday', '12:00', '20:00'),
      ('tuesday', '12:00', '20:00'),
      ('wednesday', '12:00', '20:00'),
      ('thursday', '12:00', '20:00'),
      ('friday', '12:00', '20:00'),
      ('saturday', '12:00', '20:00');

    `),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.raw(`
      SET SEARCH_PATH TO foodtruck, public;

      DROP FUNCTION IF EXISTS are_we_currently_open;

      DROP TABLE IF EXISTS holidays;
      DROP TABLE IF EXISTS hours_of_operation_overrides;
      DROP TABLE IF EXISTS hours_of_operation;

      DROP TYPE IF EXISTS DAYOFWEEK;
    `),
  ]);
};
