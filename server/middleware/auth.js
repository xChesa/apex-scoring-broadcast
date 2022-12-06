const auth = require("../services/auth.service")

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

module.exports = {
    verifyOrganizerHeaders,
}