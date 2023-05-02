module.exports = (client) => {
    const express = require("express");
    const app = express();

    const fs = require("fs");
    const config = require("../config.json");

    const port = config.dashboard.port || 80;

    app.get("/", async (req, res) => {
        let values = fs.readFileSync(__dirname + "/src/index.html", { encoding: "utf8" });

        values = values.replace("{guilds}", client.guilds.cache.size);
        values = values.replace("{users}", client.users.cache.size);

        res.send(values);
    })

    app.use(express.static(__dirname + "/src"));

    app.get("/invite", async (req, res) => {
        res.redirect(config.default.invite);
    })

    // Start Dashboard
    app.listen(port, () => {
        console.log(`Dashboard Listening on Port: ${port}`);
    })
}