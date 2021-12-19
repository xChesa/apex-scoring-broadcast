const mockStats = require("../mock/eastats2.json")
const apexService = require("../services/apex.service")
const _ = require("lodash");

const display = {};

module.exports = function router(app) {

    app.get("/mock", (req, res) => {
        res.json(mockStats)
    })

    app.post("/stats", (req, res) => {
        const {
            eventId,
            round,
            statsCode,
            skipFetch,
        } = req.body;

        const stats = apexService.generateStats(eventId, statsCode, round, skipFetch);
        res.json(stats);
    })

    app.post("/display/:eventId", (req, res) => {
        display[req.params.eventId] = {
            display: req.body.display,
            display2: req.body.display2,
            mode: req.body.mode,
            round: req.body.round,
            styled: req.body.styled,
        }
        res.json({});
    })

    app.get("/display/:eventId", (req, res) => {
        res.json(display[req.params.eventId]);
    })

    app.get("/stats/event/:eventId/round/:round", async (req, res) => {
        const {
            eventId,
            round
        } = req.params;

        let file = await apexService.getStatsFile(eventId, round);
        if (round != "overall") {
            file = _.values(file).map(team => {
                return {
                    overall_stats: {
                        ...team.overall_stats,
                        name: team.overall_stats.teamName
                    },
                    player_stats: team.player_stats.map(player => {
                        return {
                            ...player,
                            name: player.playerName
                        }
                    })
                }
            });
            file = file.sort((a, b) => {
                return b.score - a.score;
            })
        }
        res.send(file);
    })


}