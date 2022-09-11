const mockStats = require("../mock/eastats3.json")
const statsService = require("../services/stats.service")
const config = require("../config/config.json")
config.statsUrl = process.argv[2] || config.statsUrl;

const apexService = new require("../services/apex.service")(config);


const display = {};
const defaultDisplay = {
    "display": "score",
    "display2": "kills",
    "mode": "team",
    "round": "overall",
    "styled": true,
    "header": true,
    "dark": true,
    "showCharacters": true,
}

module.exports = function router(app) {

    app.get("/mock", (req, res) => {
        res.json(mockStats)
    })

    app.post("/stats", async (req, res) => {
        const {
            eventId,
            round,
            statsCode,
            startTime,
            placementPoints, 
            killPoints,
            skipFetch,
        } = req.body;

        if (!skipFetch) {
            const allStats = await apexService.getStatsFromCode(statsCode, placementPoints, killPoints);
            let game;
            if (startTime)
                game = allStats.find(({ match_start }) => match_start == startTime);
            else
                game = allStats[0]

            if (!game)
                return res.sendStats(404);
        
            await statsService.writeStats(eventId, round, game);
        }
        const overall = apexService.generateOverallStats(eventId, round);
        await statsService.writeStats(eventId, "overall", overall);

        res.json(overall);
    })

    app.post("/display/:eventId", (req, res) => {
        display[req.params.eventId] = {
            display: req.body.display,
            display2: req.body.display2,
            mode: req.body.mode,
            round: req.body.round,
            styled: req.body.styled,
            header: req.body.header,
            dark: req.body.dark,
            showCharacters: req.body.showCharacters
        }
        res.json({});
    })

    app.get("/stats/code/:statsCode", async (req, res) => {
        res.send(await apexService.getStatsFromCode(req.params.statsCode));
    })

    app.get("/display/:eventId", (req, res) => {
        res.json(display[req.params.eventId] || defaultDisplay);
    })

    app.get("/stats/event/:eventId/round/:round", async (req, res) => {
        const {
            eventId,
            round
        } = req.params;

        let file = await statsService.getStatsFile(eventId, round);
        res.send(file);
    })

}