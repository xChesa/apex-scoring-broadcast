const redis = require("../connectors/redis");

const defaultDisplay = {
    "display": "score",
    "display2": "kills",
    "mode": "team",
    "game": "overall",
    "styled": true,
    "header": true,
    "dark": true,
    "showCharacters": true,
}

function getDisplayKey(org, event) {
    return `DISPLAY:${org}-${event}`;
}

async function setDisplaySettings(org, event, settings) {
    let display = {};
    Object.keys(defaultDisplay).forEach(key => display[key] = settings[key] || defaultDisplay[key]);
    redis.set(getDisplayKey(org, event), JSON.stringify(display));
}

async function getDisplaySettings(org, event) {
    let display = await redis.get(getDisplayKey(org, event));
    if (display) {
        display = JSON.parse(display);
    } else {
        display = defaultDisplay;
    }
    return display;
}

module.exports = {
    setDisplaySettings,
    getDisplaySettings,
}