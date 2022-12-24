import axios from "axios";

const mapMap = {
    "mp_rr_canyonlands_hu": "Kings Canyon (Season 14)",
    "mp_rr_tropic_island_mu1": "Storm Point (Season 13)",
    "mp_rr_desertlands_mu3": "Worlds Edge (Season 10)",
    "mp_rr_olympus_mu2": "Olympus (Season 12)",
    "mp_rr_divided_moon": "Broken Moon (Season 15)"
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

    async function getStats(organizer, eventId, game) {
        let stats = await axios.get(config.baseUrl + "stats/" + organizer + "/" + eventId + "/" + game);
        return stats.data;
    }

    async function getGameCount(organizer, eventId) {
        let stats = await axios.get(config.baseUrl + "count/" + organizer + "/" + eventId);
        return stats.data;
    }

    async function generateStats(eventId, statsCode, game, startTime, skipFetch, killPoints, placementPoints) {
        await axios.post(config.baseUrl + "stats", {
            eventId, statsCode, game, startTime, killPoints, placementPoints, skipFetch
        }, {headers: getApiKeyHeaders()})
    }

    async function deleteStats(organizer, eventId, game) {
        await axios.delete(config.baseUrl + "stats/" + organizer + "/" + eventId + "/" + game, { headers: getApiKeyHeaders() });
    }

    async function getBroadcastSettings(organizer, eventId) {
        let data = await axios.get(config.baseUrl + "settings/broadcast/" + organizer+ "/" + eventId);
        return data.data;
    }

    async function setBroadcastSettings(organizer, eventId, display) {
        await axios.post(config.baseUrl + "settings/broadcast/" + organizer + "/" + eventId, display, {headers: getApiKeyHeaders()});
    } 


    async function getPublicSettings(organizer, eventId) {
        let data = await axios.get(config.baseUrl + "settings/public/" + organizer + "/" + eventId);
        return data.data;
    }

    async function setPublicSettings(organizer, eventId, display) {
        await axios.post(config.baseUrl + "settings/public/" + organizer + "/" + eventId, display, { headers: getApiKeyHeaders() });
    } 

    async function getLatest() {
        let data = await axios.get(config.baseUrl + "stats/latest");
        return data.data;
    } 

    function getMapName(mapid) {
        return mapMap[mapid] || mapid;
    }

    return {
        getStats,
        generateStats,
        getBroadcastSettings,
        setBroadcastSettings,
        getPublicSettings,
        setPublicSettings,
        getMapName,
        getStatsFromCode,
        checkApiKey,
        getGameCount,
        deleteStats,
        getLatest
    }
}