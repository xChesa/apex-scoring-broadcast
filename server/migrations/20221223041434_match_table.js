/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.raw(`
        CREATE TABLE IF NOT EXISTS "match" (
            "id" serial,
            "organizer" integer,
            "eventId" character varying(128),
            PRIMARY KEY(id)
        );

        ALTER TABLE "game" ADD COLUMN "matchId" integer;
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};
