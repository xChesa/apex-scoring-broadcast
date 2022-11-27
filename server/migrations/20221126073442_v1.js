/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.raw(`
        CREATE TABLE IF NOT EXISTS "player_game_stats" (
            id serial,
            "playerId" character varying(128) NOT NULL,
            "name" character varying(64),
            "gameId" integer,
            "teamId" integer,
            "teamName" character varying(32),
            "round" integer,
            "shots" integer,
            "hits" integer,
            "knockdowns" integer,
            "revivesGiven" integer,
            "respawnsGiven" integer,
            "survivalTime" integer,
            "assists" integer,
            "damageDealt" integer,
            "teamPlacement" integer,
            "hardware" character varying(10),
            "kills" integer,
            "characterName" character varying(16),
            "headshots" integer,
            PRIMARY KEY(id)
        );
    
        CREATE TABLE IF NOT EXISTS "team_game_stats" (
            "id" serial,
            "teamId" integer,
            "gameId" integer,
            "round" integer,
            "teamPlacement" integer,
            "name" character varying(32),
            "score" integer,
            "kills" integer,
            "revivesGiven" integer,
            "headshots" integer,
            "assists" integer,
            "respawnsGiven" integer,
            "damageDealt" integer,
            "knockdowns" integer,
            "shots" integer,
            "hits" integer,
            PRIMARY KEY(id)
        );

        CREATE TABLE IF NOT EXISTS "game" (
            id serial,
            "organizer" integer,
            "eventId" character varying(128),
            "round" integer,
            "match_start" integer,
            "mid" character varying(43),
            "map_name" character varying(32),
            "aim_assist_allowed" boolean,
            PRIMARY KEY(id)
        );

        CREATE TABLE "organizers"
        (
            id serial,
            username character varying(32),
            key character varying(36),
            PRIMARY KEY (id)
        );
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
