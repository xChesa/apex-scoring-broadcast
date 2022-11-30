const axios = require("axios");
const _ = require("lodash");

const SCORE_ARRAY = [12, 9, 7, 5, 4, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]
const scoreSums = ["kills", "revivesGiven", "headshots", "assists", "respawnsGiven", "damageDealt", "hits", "knockdowns", "shots"];

module.exports = function Apex(config) {
    console.log("Using ", config.statsUrl, " as Respawn API")

    async function getStatsFromCode(statsCode, placementPoints, killPoints) {
        console.log("Getting stats from ", statsCode);

        let stats = await getStatsFromEA(statsCode);
        stats = stats.matches.sort((a, b) => b.match_start - a.match_start);
        stats = stats.map(stat => generateGameReport(stat, placementPoints, killPoints));

        return stats;
    }

    function generateOverallStats(stats) {
        stats = stats.map(stat => _.keyBy(stat.teams, "id"));

        let overall = [];
        let teams = _(stats).map(m => Object.keys(m)).flatten().uniq().value();

        teams.forEach(key => {
            let teamStats = {
                teamId: key,
                overall_stats: {
                    position: 20,
                    score: 0,
                    bestGame: 0,
                    bestPlacement: 20,
                    bestKills: 0,
                    id: key,
                },
                player_stats: {}
            };
            scoreSums.forEach(key => teamStats.overall_stats[key] = 0);
            stats.forEach(stat => {
                if (stat[key]) {
                    let t = stat[key].overall_stats;
                    let overall_stats = teamStats.overall_stats;
                    teamStats.name = t.name;
                    if (!teamStats.overall_stats.name)
                        teamStats.overall_stats.name = t.name;
                    overall_stats.score += t.score;
                    overall_stats.bestGame = Math.max(overall_stats.bestGame, t.score);
                    overall_stats.bestPlacement = Math.min(overall_stats.bestPlacement, t.teamPlacement);
                    overall_stats.bestKills = Math.max(overall_stats.bestKills, t.kills);
                    scoreSums.forEach(key => overall_stats[key] += t[key]);
                    overall_stats.accuracy = Math.floor(100 * (overall_stats.hits / overall_stats.shots)) / 100;

                    let playerStats = stat[key].player_stats;
                    playerStats.forEach(p => {
                        let player = teamStats.player_stats[p.playerId] || {
                            name: "",
                            playerId: p.playerId,
                        };

                        player.name = p.name;
                        scoreSums.forEach(key => player[key] = (player[key] || 0) + p[key]);
                        player.accuracy = Math.floor(100 * (player.hits / player.shots)) / 100;
                        player.characters = player.characters || []
                        player.characters.push(p.characterName);
                        player.characters = _.uniq(player.characters.reverse());

                        teamStats.player_stats[p.playerId] = player;
                    });
                }

            })

            teamStats.player_stats = _.values(teamStats.player_stats);
            overall.push(teamStats);
        });

        overall = overall.sort((a, b) => {
            a = a.overall_stats;
            b = b.overall_stats;
            if (a.score != b.score) {
                return b.score - a.score;
            } else if (a.bestGame != b.bestGame) {
                return b.bestGame - a.bestGame;
            } else if (a.bestPlacement != b.bestPlacement) {
                return a.bestPlacement - b.bestPlacement;
            } else {
                return b.bestKills - a.bestKills;
            }
        });

        overall.forEach((obj, index) => obj.overall_stats.position = index + 1)
        for (let i = 0; i < 20; i++) {
            if (!overall[i]) overall[i] = {
                overall_stats: {
                    position: "",
                    teamName: "",
                    score: "",
                    kills: "",
                },
                player_stats: []
            }
        }
        return overall;
    }

    function generateGameReport(data, placementPoints = SCORE_ARRAY, killScore = 1) {
        let teams = {};
        let playerData = data.player_results;
        playerData.forEach(player => {
            let teamId = "team" + player.teamNum;
            if (!teams[teamId]) {
                teams[teamId] = {
                    id: parseInt(teamId.replace("team", "")),
                    name: player.teamName,
                    overall_stats: {
                        teamPlacement: player.teamPlacement,
                        score: placementPoints[player.teamPlacement - 1]
                    },
                    player_stats: []
                };
            }
            let team = teams[teamId];
            team.player_stats.push(player);
            scoreSums.forEach(key => team.overall_stats[key] = (team.overall_stats[key] || 0) + player[key]);
            team.overall_stats.score += (player.kills * killScore)
        });

        teams = _.values(teams).map(team => {
            return {
                name: team.name,
                id: team.id,
                overall_stats: team.overall_stats,
                player_stats: team.player_stats.map(player => {
                    return {
                        ...player,
                        name: player.playerName
                    }
                })
            }
        });
        teams = teams.sort((a, b) => {
            return a.overall_stats.teamPlacement - b.overall_stats.teamPlacement;
        })

        delete data.player_results;
        return { ...data, teams };
    }

    async function getStatsFromEA(apexCode) {
        let stats = await axios(config['statsUrl'] + apexCode);

        return stats.data;
    }

    return {
        getStatsFromCode,
        generateOverallStats,
    }
}