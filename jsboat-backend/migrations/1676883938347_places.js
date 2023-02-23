/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("places", {
    id: "id",
    place_name: {
      type: "text",
      notNull: true,
    },
    city: {
      type: "text",
      notNull: true,
    },
    state: {
      type: "text",
      notNull: true,
    },
    liked_count: {
      type: "integer",
      notNull: true,
    },
    popularity: {
      type: "integer",
      notNull: true,
    },
    createdAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

exports.down = (pgm) => {};
