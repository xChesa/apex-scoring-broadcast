const config = require("../config/config.json")
const {db} = require("../connectors/db");
const _ = require("lodash");

function assembleStatsDocuments(games, teams, players) {
    let teamsByGame = _(teams).groupBy("gameId").value();
    let playersByGame = _(players).groupBy(({ gameId }) => gameId).value();

    games.forEach(game => {
        game.teams = teamsByGame[game.id].map(team => {
            return {
                id: team.teamId,
                name: team.name,
                overall_stats: team,
                player_stats: playersByGame[game.id].filter(player => player.teamId == team.teamId)
            }
        })
    });
    return games;
}

async function getStats(organizer, eventId, round) {
    let where = round == "overall" ? { "organizers.username": organizer, eventId } : { "organizers.username": organizer, eventId, round };
    try {
        let games = await db("game")
            .join("organizers", "game.organizer", "organizers.id")
            .where(where)
            .select("*");

        let teams = await db("team_game_stats").whereIn("gameId",  games.map(game => game.id))
        let players = await db("player_game_stats").whereIn("gameId", games.map(game => game.id))
        
        return assembleStatsDocuments(games, teams, players);
    } catch (err) {
        console.error(err);
    }
}

async function writeStats(organizer, eventId, round, data) {
    try {
        db.transaction(async trx => {
            let gameResult = await trx("game").insert({
                eventId,
                round,
                organizer: organizer.id,
                match_start: data.match_start,
                mid: data.mid,
                map_name: data.map_name,
                aim_assist_allowed: data.aim_assist_allowed,
            }, ["id"]);


            let gameId = gameResult[0].id;

            let teamStats = data.teams.map(team => {
                return {
                    ...team.overall_stats,
                    teamId: team.id,
                    round,
                    gameId: gameId,
                    name: team.name
                }
            });

            let playerStats = data.teams.map(team =>
                team.player_stats.map(player => {
                    //console.log(player)
                    let playerData = {
                        ...player,
                        teamId: team.id,
                        playerId: player.nidHash,
                        round, 
                        gameId
                    }
                    delete playerData.nidHash;
                    delete playerData.playerName;
                    delete playerData.teamNum;

                    return playerData;
                })
            ).flat();


            await db("team_game_stats").insert(teamStats);
            await db("player_game_stats").insert(playerStats);

        });
    } catch (err) {
        console.error("Failed to insert game into db", err);
    }
}

async function getGameCount(organizer, eventId) {
    try {
        let result = await db("game")
            .join("organizers", "game.organizer", "organizers.id")
            .orderBy("round", "desc")
            .where({"organizers.username": organizer, eventId})
            .first("round");
        return result.round;
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