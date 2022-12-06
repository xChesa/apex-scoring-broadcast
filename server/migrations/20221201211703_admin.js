/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.raw(`
        CREATE TABLE IF NOT EXISTS "admin_settings" (
            "id" serial,
            "organizer" integer,
            "eventId" character varying(128),
            "broadcast" json,
            "public" json,
            PRIMARY KEY(id)
        );
        CREATE UNIQUE INDEX admin_settings_organizer_idx ON public.admin_settings ("organizer","eventId");
        `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
