const cache = require("./cache.service");
const {db} = require("../connectors/db");

const defaultBroadcast = {
    "display": "score",
    "display2": "kills",
    "mode": "team",
    "game": "overall",
    "styled": true,
    "header": true,
    "dark": true,
    "showCharacters": true,
}

const checkBroadcast = {
    ...defaultBroadcast,
    display2: undefined,
}

function getBroadcastKey(org, event) {
    return `DISPLAY:${org}-${event}`;
}

async function setBroadcastSettings(organizer, orgName, eventId, settings) {
    let broadcast = {};
    Object.keys(defaultBroadcast).forEach(key => broadcast[key] = settings[key] || checkBroadcast[key]);

    await db("admin_settings")
        .insert({ organizer, eventId, broadcast: JSON.stringify(broadcast) })
        .onConflict(["organizer", "eventId"])
        .merge();

    cache.del(getBroadcastKey(orgName, eventId));
}

async function getBroadcastSettings(org, event) {
    let broadcast = await cache.get(getBroadcastKey(org, event));
    if (broadcast) {
        broadcast = JSON.parse(broadcast);
    } else {
        let result = await db("admin_settings")
            .join("organizers", "organizers.id", "admin_settings.organizer")
            .where({ "username": org })
            .first("broadcast");
        
        if (result) {
            broadcast = result.broadcast;
        } else {
            broadcast = defaultBroadcast;
        }
        await cache.put(getBroadcastKey(org, event), JSON.stringify(broadcast), 300)
    }
    return broadcast;
}

module.exports = {
    setBroadcastSettings,
    getBroadcastSettings,
}