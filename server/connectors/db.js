const config = require("../config/config.json").db;
const db = require("knex")(config);



module.exports = { db };