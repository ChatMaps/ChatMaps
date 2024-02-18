const express = require("express")
const app = express()

// Uses nodejs and express as "basic" backend server
// Recieves webhook from Github at https://chatmaps.nicholaspease.com/api/v1/deploy
app.post("/api/v1/deploy", function (req, res) {
    console.log(req.body)
})

app.listen(8000)