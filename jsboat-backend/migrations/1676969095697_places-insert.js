/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.db.query(
    `COPY places FROM 'N:/project/Demo-Test/test-backend/places.csv' DELIMITER ',' CSV HEADER`
  );
};

exports.down = (pgm) => {};
