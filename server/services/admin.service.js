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

const defaultPublic = {
    title: ''
}

function getCacheKey(org, event, option) {
    return `SETTINGS:${org}-${event}-${option}`;
}

async function getResultAndSetCache(result, def, org, event, option) {
    let ret = undefined;
    if (result) {
        ret = result[option];
    } else {
        ret = def;
    }
    await cache.put(getCacheKey(org, event, option), JSON.stringify(ret), 300)
    return ret;
}

async function setBroadcastSettings(organizer, orgName, eventId, settings) {
    console.log(settings);
    let broadcast = {}
    Object.keys(defaultBroadcast).forEach(key => broadcast[key] = (settings[key] != undefined) ? settings[key] : checkBroadcast[key]);

    return await setSettings(organizer, orgName, eventId, broadcast, "broadcast")
}

async function getBroadcastSettings(org, event) {
    return await getSettings(org, event, "broadcast", defaultBroadcast);
}

async function setPublicSettings(organizer, orgName, eventId, settings) {
    let public = {}
    Object.keys(defaultPublic).forEach(key => public[key] = (settings[key] != undefined) ? settings[key] : defaultPublic[key]);

    return await setSettings(organizer, orgName, eventId, public, "public");
}

async function getPublicSettings(org, event) {
    return await getSettings(org, event, "public", defaultPublic)
}

async function setSettings(organizer, orgName, eventId, settings, option) {
    console.log(settings);
    await db("admin_settings")
        .insert({ organizer, eventId, [option]: JSON.stringify(settings) })
        .onConflict(["organizer", "eventId"])
        .merge();

    cache.del(getCacheKey(orgName, eventId, option));
}

async function getSettings(org, event, option, def) {
    let ret = await cache.get(getCacheKey(org, event, option));
    if (ret) {
        ret = JSON.parse(ret);
    } else {
        let result = await db("admin_settings")
            .join("organizers", "organizers.id", "admin_settings.organizer")
            .where({ "username": org, eventId: event })
            .first("*");
        
        ret = await getResultAndSetCache(result, def, org, event, option)
    }
    return ret;
}

module.exports = {
    setBroadcastSettings,
    getBroadcastSettings,
    getPublicSettings,
    setPublicSettings,
}