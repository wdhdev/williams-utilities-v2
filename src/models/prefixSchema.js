const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    _id: String,
    prefix: String
})

module.exports = mongoose.model("prefixes", schema, "prefixes")