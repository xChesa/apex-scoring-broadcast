const mockStats = require("../mock/eastats3.json")
const statsService = require("../services/stats.service")
const config = require("../config/config.json")
config.statsUrl = process.argv[2] || config.statsUrl;
const { verifyOrganizerHeaders } = require("../middleware/auth");
const apexService = new require("../services/apex.service")(config);
const authService = require("../services/auth.service");

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

    app.post("/auth/organizer", async (req, res) => {
        const {
            key, username
        } = req.body;

        let organizer = await authService.getOrganizer(username, key);

        res.send({
            valid: organizer != undefined
        })
    })

    app.post("/stats", verifyOrganizerHeaders, async (req, res) => {
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
                    
            await statsService.writeStats(req.organizer, eventId, round, game);
        }
        res.status(200).send();
    })

    app.post("/display/:eventId", verifyOrganizerHeaders, (req, res) => {
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

    app.get("/stats/code/:statsCode", verifyOrganizerHeaders, async (req, res) => {
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

        let stats = await statsService.getStats(eventId, round);
        
        if (!stats || stats.length == 0) {
            return res.send({});
        }

        if (round == "overall") {
            res.send(apexService.generateOverallStats(stats));
        } else {
            res.send(stats[0]);
        }
    })

}