/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.raw(`
        CREATE TABLE IF NOT EXISTS "short_link"(
            "id" serial,
            "hash" character varying(10),
            "url" character varying(256),
            "count" integer DEFAULT 0,
            PRIMARY KEY(id)
        );
        CREATE UNIQUE INDEX short_link_hash_idx ON short_link ("hash");
        CREATE UNIQUE INDEX short_link_url_idx ON short_link ("url");
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};
