const { Pool } = require("pg");
const Config = require("./config");

module.exports = class PostgresSQL {
  #connection = null;

  constructor(conn) {
    this.#connection = conn;
  }
  static async initialize() {
    return new PostgresSQL(
      new Pool({
        user: Config.DB_USER,
        password: Config.DB_PASSWORD,
        port: Config.DB_PORT,
        database: Config.DB_DATABASE,
      })
    );
  }

  async executeQuery(sql, values) {
    try {
      const resp = await this.#connection.query(sql, values);
      return {
        err: false,
        rows: resp.rows,
        rowCount: resp.rowCount,
      };
    } catch (err) {
      throw err;
    }
  }

  getSearchQuery(searchValue, isIncludeWhere = true) {
    if (Object.keys(searchValue).length === 0) {
      return "";
    }
    let query = isIncludeWhere ? "WHERE " : "";
    Object.keys(searchValue).forEach((key, index) => {
      query += `LOWER(CAST(${key} as TEXT)) LIKE LOWER('%${searchValue[key]}%')`;
      query += index === Object.keys(searchValue).length - 1 ? "" : " AND ";
    });

    return query;
  }

  async trigerFunc() {
    const resp = await this
      .executeQuery(`CREATE OR REPLACE FUNCTION liked_count() RETURNS trigger AS $$
      DECLARE
      BEGIN
        PERFORM pg_notify('liked_count', json_build_object(
            'operation', TG_OP,
            'record', row_to_json(NEW)
          )::text
        );
      RETURN NEW;
      END;
      $$ LANGUAGE 'plpgsql'`);
    return !resp ? null : resp;
  }

  async createTrigger() {
    const resp = await this.executeQuery(`CREATE TRIGGER liked_count 
         AFTER UPDATE 
         ON places 
         FOR EACH ROW 
         EXECUTE PROCEDURE liked_count()`);

    return !resp ? null : resp;
  }

  async checkUserExistWithEmail(values) {
    const resp = await this.executeQuery(
      "SELECT * FROM users WHERE email=$1",
      values
    );
    return !resp ? null : resp;
  }

  async addUser(values) {
    const projection = ["name", "email", "prefrered_states"];
    const resp = await this.executeQuery(
      `INSERT INTO users (name, email, password, prefrered_states) VALUES ($1, $2, $3, $4) RETURNING ${projection.join(
        ", "
      )}`,
      values
    );
    return !resp ? null : resp.rows;
  }

  async loginUser(values) {
    const resp = await this.executeQuery(
      "SELECT * FROM users WHERE email=$1",
      values
    );

    return !resp ? null : resp;
  }

  async addPlaces(values) {
    const resp = await this.executeQuery(
      "INSERT INTO places (place_name, city, state, liked_count, popularity) VALUES ($1, $2, $3,$4,$5) RETURNING *",
      values
    );
    return !resp ? null : resp.rows;
  }

  async getPlaces(search) {
    const searchQuery = await this.getSearchQuery(search);
    const resp = await this.executeQuery(`SELECT * FROM places ${searchQuery}`);

    return !resp ? null : resp.rows;
  }

  async getUser(values) {
    const resp = await this.executeQuery(
      "SELECT * FROM users WHERE id=$1",
      values
    );
    return !resp ? null : resp.rows[0];
  }

  async likedInc(values) {
    const resp = await this.executeQuery(
      "UPDATE places SET liked_count = liked_count + 1 WHERE id=$1 RETURNING*",
      values
    );
    return !resp ? null : resp.rows[0];
  }

  async likedDec(values) {
    const resp = await this.executeQuery(
      "UPDATE places SET liked_count = liked_count - 1 WHERE id=$1 RETURNING *",
      values
    );
    return !resp ? null : resp.rows[0];
  }

  async addPlaceInUser(values) {
    const resp = await this.executeQuery(
      "UPDATE users SET liked_places=ARRAY_APPEND(liked_places,$2) WHERE id=$1 RETURNING *",
      values
    );
    return !resp ? null : resp.rows[0];
  }

  async removePlaceInUser(values) {
    const resp = await this.executeQuery(
      "UPDATE users SET liked_places=ARRAY_REMOVE(liked_places,$2) WHERE id=$1 RETURNING *",
      values
    );
    return !resp ? null : resp.rows[0];
  }
};
