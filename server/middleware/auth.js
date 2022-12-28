const auth = require("../services/auth.service")
const config = require("../config/config.json")

async function verifyOrganizerHeaders(req, res, next) {
    let username = req.header("x-organizer-name");
    let key = req.header("x-organizer-key");

    let organizer = await auth.getOrganizer(username, key);

    if (organizer) {
        req.organizer = organizer;
        next();
    } else {
        console.log("Bad user/key", username);
        res.sendStatus(403);
    }
}

async function verifyAdminHeaders(req, res, next) {
    let adminKey = req.header("x-admin-key");

    if (adminKey === config.adminKey) {
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports = {
    verifyOrganizerHeaders,
    verifyAdminHeaders,
}