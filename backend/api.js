const express = require("express")
const app = express()
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Uses nodejs and express as "basic" backend server
// Recieves webhook from Github at https://chatmaps.nicholaspease.com/api/v1/deploy
app.post("/api/v1/deploy", function (req, res) {
    console.log(req.body)
    res.send("OK")
})

app.get('/api/v1', (req, res) => {
    res.send('Hello World!')
})

app.listen(8000)