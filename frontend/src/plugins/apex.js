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

    async function getDisplayView(eventId) {
        let data = await axios.get(config.baseUrl + "/display/" + eventId);
        return data.data;
    }

    async function setDisplayView(eventId, display) {
        await axios.post(config.baseUrl + "/display/" + eventId, display);
    } 

    return {
        getStats,
        generateStats,
        getDisplayView,
        setDisplayView,
    }
}