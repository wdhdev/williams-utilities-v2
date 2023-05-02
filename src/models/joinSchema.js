const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    _id: String,
    channel: String,
    message: String
})

module.exports = mongoose.model("join", schema, "join")