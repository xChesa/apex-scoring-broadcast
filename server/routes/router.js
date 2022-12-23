
const statsService = require("../services/stats.service")
const config = require("../config/config.json")
config.statsUrl = process.argv[2] || config.statsUrl;
const { verifyOrganizerHeaders } = require("../middleware/auth");
const apexService = new require("../services/apex.service")(config);
const authService = require("../services/auth.service");
const adminService = require("../services/admin.service");
const cache = require("../services/cache.service");

module.exports = function router(app) {

    async function deleteCache(username, eventId, game) {
        await cache.del(`stats:${username}-${eventId}-${game}`);
        await cache.del(`stats:${username}-${eventId}-overall`);
    }

    app.get("/mock", (req, res) => {
        const mockStats = require("../mock/eastats3.json")
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

    app.post("/settings/broadcast/:organizer/:eventId", verifyOrganizerHeaders, (req, res) => {
        adminService.setBroadcastSettings(req.organizer.id, req.params.organizer, req.params.eventId, req.body);
        res.sendStatus(200);
    })

    app.get("/settings/broadcast/:organizer/:eventId", async (req, res) => {
        let result = await adminService.getBroadcastSettings(req.params.organizer, req.params.eventId);
        res.send(result);
    })

    app.post("/settings/public/:organizer/:eventId", verifyOrganizerHeaders, (req, res) => {
        adminService.setPublicSettings(req.organizer.id, req.params.organizer, req.params.eventId, req.body);
        res.sendStatus(200);
    })

    app.get("/settings/public/:organizer/:eventId", async (req, res) => {
        let result = await adminService.getPublicSettings(req.params.organizer, req.params.eventId);
        res.send(result);
    })

    app.get("/stats/code/:statsCode", verifyOrganizerHeaders, async (req, res) => {
        res.send(await apexService.getStatsFromCode(req.params.statsCode));
    })

    app.post("/stats", verifyOrganizerHeaders, async (req, res) => {
        const {
            eventId,
            game,
            statsCode,
            startTime,
            placementPoints, 
            killPoints,
            skipFetch,
        } = req.body;

        if (!skipFetch) {
            const allStats = await apexService.getStatsFromCode(statsCode, placementPoints, killPoints);
            let gameStat;
            if (startTime)
                gameStat = allStats.find(({ match_start }) => match_start == startTime);
            else
                gameStat = allStats[0]

            if (!gameStat)
                return res.sendStats(404);
                    
            await statsService.writeStats(req.organizer.id, eventId, game, gameStat);
            await deleteCache(req.organizer.username, eventId, game);
        }
        res.status(200).send();
    })

    app.get("/count/:organizer/:eventId", async (req, res) => {
        const {
            organizer,
            eventId,
        } = req.params;

        let orgId = await authService.getOrganizerId(organizer)

        let result = await statsService.getGameCount(orgId, eventId);
        res.send({count: result});
    })

    app.get("/stats/:organizer/:eventId/:game", async (req, res) => {
        const {
            organizer,
            eventId,
            game
        } = req.params;
        const cacheKey = `stats:${organizer}-${eventId}-${game}`;

        let cachedStats = await cache.get(cacheKey);

        if (cachedStats) {
            return res.send(cachedStats);
        } 

        let orgId = await authService.getOrganizerId(organizer)
        let stats = await statsService.getStats(orgId, eventId, game);
        
        if (!stats || stats.length == 0) {
            return res.send({});
        }

        if (game == "overall") {
            stats = {
                total: stats.length,
                games: stats,
                teams: apexService.generateOverallStats(stats),
            }
        } else {
            stats = stats[0];
        }

        cache.put(cacheKey, stats, 300); //cache for 5m
        res.send(stats);
    })

    app.delete("/stats/:organizer/:eventId/:game", verifyOrganizerHeaders, async (req, res) => {
        const {
            organizer,
            eventId,
            game
        } = req.params;

        await statsService.deleteStats(req.organizer.id, eventId, game);
        await deleteCache(organizer, eventId, game);

        res.sendStatus(200);
    })

    app.get("/stats/latest", async (req, res) => {
        let matches = await statsService.getLatest();
        
        if (matches) {
            let stats = matches.map(match => {
                console.log(match)
                return {
                    id: match.id,
                    organizer: match.organizer,
                    eventId: match.eventId,
                    top3: apexService.generateOverallStats(match.stats).slice(0, 3).map(team => team.overall_stats)
                }
            });
            res.send(stats);
        }
        

    })
}