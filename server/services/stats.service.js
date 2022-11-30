const {db} = require("../connectors/db");
const _ = require("lodash");

function assembleStatsDocuments(games, teams, players) {
    let teamsByGame = _(teams).groupBy("gameId").value();
    let playersByGame = _(players).groupBy(({ gameId }) => gameId).value();


    games.forEach(game => {
        game.teams = teamsByGame[game.id].map(team => {
            return {
                teamId: team.teamId,
                name: team.name,
                overall_stats: team,
                player_stats: playersByGame[game.id].filter(player => player.teamId == team.teamId)
            }
        })
    });
    return games;
}

async function getStats(organizer, eventId, game) {
    let where = game == "overall" ? { "o.username": organizer, eventId } : { "o.username": organizer, eventId, game };
    try {
        let games = await db("game")
            .leftJoin({o: "organizers"}, "game.organizer", "o.id")
            .where(where)
            .select("game.*", "o.username as organizer");
                
        let teams = await db("team_game_stats").whereIn("gameId",  games.map(game => game.id))
        let players = await db("player_game_stats").whereIn("gameId", games.map(game => game.id))
        
        return assembleStatsDocuments(games, teams, players);
    } catch (err) {
        console.error(err);
    }
}

async function writeStats(organizer, eventId, game, data) {
    try {
        db.transaction(async trx => {
            console.log({ organizer, eventId, game })
            let previousGame = await trx("game").
                where({ organizer, eventId })
                .first("id");

            if (previousGame) {
                console.log("Overwriting previous game " + previousGame.id);
                await trx("game")
                    .where({ id: previousGame.id })
                    .del();
                
                await trx("team_game_stats")
                    .where({ gameId: previousGame.id })
                    .del();
                
                await trx("player_game_stats")
                    .where({ gameId: previousGame.id })
                    .del();
            }

            let gameResult = await trx("game").insert({
                eventId,
                game,
                organizer: organizer,
                match_start: data.match_start,
                mid: data.mid,
                map_name: data.map_name,
                aim_assist_allowed: data.aim_assist_allowed,
            }, ["id"])


            let gameId = gameResult[0].id;

            let teamStats = data.teams.map(team => {
                return {
                    ...team.overall_stats,
                    teamId: team.id,
                    gameId: gameId,
                    name: team.name
                }
            });

            let playerStats = data.teams.map(team =>
                team.player_stats.map(player => {
                    let playerData = {
                        ...player,
                        teamId: team.id,
                        playerId: player.nidHash,
                        gameId
                    }
                    delete playerData.nidHash;
                    delete playerData.playerName;
                    delete playerData.teamNum;

                    return playerData;
                })
            ).flat();


            await trx("team_game_stats").insert(teamStats);
            await trx("player_game_stats").insert(playerStats);

        });
    } catch (err) {
        console.error("Failed to insert game into db", err);
    }
}

async function getGameCount(organizer, eventId) {
    try {
        let result = await db("game")
            .join("organizers", "game.organizer", "organizers.id")
            .orderBy("game", "desc")
            .where({"organizers.username": organizer, eventId})
            .first("game");
        return result.game;
    } catch (err) {
        console.error(err)
        return 0;
    }
}


module.exports = {
    writeStats,
    getStats,
    getGameCount
}