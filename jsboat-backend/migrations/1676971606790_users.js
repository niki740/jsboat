/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("users", {
    id: "id",
    name: {
      type: "text",
      notNull: true,
    },
    email: {
      type: "text",
      unique: true,
      notNull: true,
    },
    password: {
      type: "text",
      notNull: true,
    },
    prefrered_states: {
      type: "text[]",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

exports.down = (pgm) => {};
