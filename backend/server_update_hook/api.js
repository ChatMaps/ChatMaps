const express = require("express")
const app = express()
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Uses nodejs and express as "basic" backend server
// Recieves webhook from Github at https://chatmaps.nicholaspease.com/api/v1/deploy
app.post("/api/v1/deploy", function (req, res) {
    console.log(req.body)
    if (req.body.action == "closed" && req.body.pull_request.merged == true && req.body.pull_request.base.ref == "main") {
        console.log("Closed & Merged")
    }
    res.send("OK")
})

// Generic endpoint, useful to test if updater is alive
app.get('/api/v1', (req, res) => {
    res.send('OK')
})

app.listen(8000)