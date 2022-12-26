const { db } = require("../connectors/db");
const cache = require("./cache.service.js")
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';


function generateRandomString() {
    let randomString = '';

    for (let i = 0; i < 5; i++) {
        randomString += characters[Math.floor(Math.random() * characters.length)];
    }

    return randomString;
}

function getCacheKey(hash) {
    return `redirect-${hash}`;
}

async function getHash(url) {
    console.log(url);
    let hash = cache.get(getCacheKey(url));

    if (!hash) {
        let result = db("short_link").where({ url }).first("hash");
        if (result) {
            hash = result.hash;
            await cache.put(getCacheKey(hash), url);
            await cache.put(getCacheKey(url), hash);
        }
    }
    return hash;
}

async function createShortLink(url) {
    let hash = generateRandomString();

    await db("short_link").insert({ hash, url });
    await cache.put(getCacheKey(hash), url);
    await cache.put(getCacheKey(url), hash);

    return hash;
}

async function getUrl(hash) {
    let url = cache.get(getCacheKey(hash));

    if (!url) {
        let result = db("short_link").where({ hash }).first("url");
        if (result) {
            url = result.url;
            await cache.put(getCacheKey(hash), url);
            await cache.put(getCacheKey(url), hash);
        }
    }
    return url;
}

async function incrementVisit(hash) {
    await db("short_link").where({ hash }).increment("count", 1);
}

module.exports = {
    getUrl,
    getHash,
    createShortLink,
    incrementVisit
}