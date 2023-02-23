/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.dropColumns("users", ["liked_places"]),
    pgm.addColumns("users", {
      liked_places: {
        type: "integer[]",
      },
    });
};

exports.down = (pgm) => {};
