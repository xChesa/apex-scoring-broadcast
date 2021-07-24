const Apex = require("apex-scoring");
const config = require("../config/config.json")
const apex = new Apex(config);
const { open } = require("fs/promises");

function generateStats(eventId, statsCode, round, skipFetch) {
    apex.createStats(eventId, statsCode, round, skipFetch)
}

function getStatsPath(eventId) {
    return config.statsPath + "/" + eventId + "/";
}

function getStatsFilePath(eventId, fileName) {
    return getStatsPath(eventId) + fileName + ".json";
}

async function getStatsFile(eventId, round) {
    let handle;
    try {
        handle = await open(getStatsFilePath(eventId, round), "r");
        let file = await handle.readFile();
        return JSON.parse(file);
    } finally {
        await handle?.close();
    }
}

module.exports = {
    generateStats,
    getStatsFile
}