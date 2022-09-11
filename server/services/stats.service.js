const config = require("../config/config.json")
const fs = require("fs");
const { open } = require("fs/promises");

console.log("Using ", config.statsUrl, " as Respawn API")

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
    } catch (err) {
        
    } finally {
        await handle?.close();
    }
}

function writeStats(eventId, round, data) {
    const path = getFilePath(eventId);

    fs.mkdirSync(path, { recursive: true });
    fs.writeFileSync(path + round + ".json", JSON.stringify(data));
}

function getFilePath(eventId) {
    return config.statsPath + "/" + eventId + "/";
}

module.exports = {
    getStatsFile,
    writeStats,
    getFilePath,
}