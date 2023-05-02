const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    _id: String,
    afk: Boolean,
    reason: String
})

module.exports = mongoose.model("afk", schema, "afk")