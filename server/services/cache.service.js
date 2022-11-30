const redis = require("../connectors/redis");
const config = require("../config/config.json");

const PREFIX = config.cachePrefix || "CACHE:";

async function put(key, value, time) {
    value = JSON.stringify(value);
    if (time) {
        redis.setex(PREFIX + key, value, time);
    } else {
        redis.set(PREFIX + key, value);
    }
}

async function get(key) {
    let result = await redis.get(key);
    if (result) {
        return JSON.parse(result)
    }
    return undefined;
}

async function del(key) {
    return await redis.del(key);
}


module.exports = {
    put,
    get,
    del
}