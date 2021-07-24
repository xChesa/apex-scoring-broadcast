import axios from "axios";

export default {
    install(Vue, options) {
        Vue.prototype.$apex = apexService(options);
    }
}

function apexService(config) {

    async function getStats(eventId, round) {
        let stats = await axios.get(config.baseUrl + "/stats/event/" + eventId + "/round/" + round);
        return stats.data;
    }

    async function generateStats(eventId, statsCode, round, skipFetch) {
        await axios.post(config.baseUrl + "/stats", {
            eventId, statsCode, round, skipFetch,
        })
    }

    return {
        getStats,
        generateStats
    }
}