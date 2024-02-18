// Physical Server Update Hook
// Imports
// Requires express, body-parser, child_process
const express = require("express")
const bodyParser = require("body-parser")
const { exec } = require("child_process")

// Start the express app and initialize
const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // This processes all the POST data as JSON

// Uses nodejs and express as "basic" backend server
// Recieves webhook from Github at https://chatmaps.nicholaspease.com/
app.post("/api/v1/deploy", function (req, res) {
    // Webhook returns all pull request actions
    // Limit to "closed", "merged", and the target branch being "main"
    if (req.body.action == "closed" && req.body.pull_request.merged == true && req.body.pull_request.base.ref == "main") {
        // (re)Start all the systemd files
        exec("systemctl restart frontend-next.service", (error, stdout, stderr) => {});
        exec("systemctl restart server_update_hook.service", (error, stdout, stderr) => {});
    }
    res.send("OK")
})

// Generic endpoint, useful to test if updater is alive
app.get('/api/v1', (req, res) => {
    res.send('OK')
})

// Server runs on port 8000, exposed on server at /api/v1
app.listen(8000)