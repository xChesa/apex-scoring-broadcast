import axios from "axios";

const mapMap = {
    "mp_rr_canyonlands_hu": "Kings Canyon (Season 14)",
    "mp_rr_tropic_island_mu1": "Storm Point (Season 13)",
    "mp_rr_desertlands_mu3": "Worlds Edge (Season 10)",
    "mp_rr_olympus_mu2": "Olympus (Season 12)",
}

export default {
    install(Vue, options) {
        Vue.prototype.$apex = apexService(options);
    }
}

function apexService(config) {

    async function getStatsFromCode(statsCode) {
        let stats = await axios.get(`${config.baseUrl}stats/code/${statsCode}`);
        return stats.data;
    }

    async function getStats(eventId, round) {
        let stats = await axios.get(config.baseUrl + "stats/event/" + eventId + "/round/" + round);
        return stats.data;
    }

    async function generateStats(eventId, statsCode, round, startTime, skipFetch, killPoints, placementPoints) {
        await axios.post(config.baseUrl + "stats", {
            eventId, statsCode, round, startTime, killPoints, placementPoints, skipFetch
        })
    }

    async function getDisplayView(eventId) {
        let data = await axios.get(config.baseUrl + "display/" + eventId);
        return data.data;
    }

    async function setDisplayView(eventId, display) {
        await axios.post(config.baseUrl + "display/" + eventId, display);
    } 

    function getMapName(mapid) {
        return mapMap[mapid] || mapid;
    }

    return {
        getStats,
        generateStats,
        getDisplayView,
        setDisplayView,
        getMapName,
        getStatsFromCode,
    }
}