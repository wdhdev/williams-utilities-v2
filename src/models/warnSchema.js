const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    id: Number,
    guild: Number,
    member: String,
    moderator: String,
    reason: String,
    timestamp: Number
})

module.exports = mongoose.model("warnings", schema, "warnings")