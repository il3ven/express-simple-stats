"use strict";
exports.__esModule = true;
var express = require("express");
var index_1 = require("../src/index");
var stats = index_1.Stats("password");
var app = express();
app.use("/stats", stats.router);
app.use(stats.middleware);
app.get("/", function (req, res) {
    res.send("Hello world");
});
app.listen(5000, function () {
    console.log("Listening");
});
