const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    _id: String,
    channel: String
})

module.exports = mongoose.model("logs", schema, "logs")