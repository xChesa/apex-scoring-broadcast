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

function getApiKeyHeaders() {
    return {
        "x-organizer-key": localStorage.getItem("organizer-key"),
        "x-organizer-name": localStorage.getItem("organizer-username"),
    }
}

function apexService(config) {

    async function checkApiKey(username, key) {
        let result = await axios.post(`${config.baseUrl}auth/organizer`, { username, key });

        return result.data.valid;
    }

    async function getStatsFromCode(statsCode) {
        let stats = await axios.get(`${config.baseUrl}stats/code/${statsCode}`, {headers: getApiKeyHeaders()});
        return stats.data;
    }

    async function getStats(eventId, round) {
        let stats = await axios.get(config.baseUrl + "stats/event/" + eventId + "/round/" + round);
        return stats.data;
    }

    async function generateStats(eventId, statsCode, round, startTime, skipFetch, killPoints, placementPoints) {
        await axios.post(config.baseUrl + "stats", {
            eventId, statsCode, round, startTime, killPoints, placementPoints, skipFetch
        }, {headers: getApiKeyHeaders()})
    }

    async function getDisplayView(eventId) {
        let data = await axios.get(config.baseUrl + "display/" + eventId);
        return data.data;
    }

    async function setDisplayView(eventId, display) {
        await axios.post(config.baseUrl + "display/" + eventId, display, {headers: getApiKeyHeaders()});
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
        checkApiKey
    }
}