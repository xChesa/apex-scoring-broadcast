const { db } = require("../connectors/db");


async function getOrganizer(username, key) {
    if (!username || !key) {
        return false;
    }
    
    let result = await db("organizers").where({ username, key }).select("id", "username");
    return result[0];
}

module.exports = {
    getOrganizer,
}