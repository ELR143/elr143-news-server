const express = require("express");
const { getAllTopics } = require("./controllers/news-controller");
const { pathDoesNotExist } = require("./errors");

const app = express();
app.use(express.json());

app.get("/api/topics", getAllTopics);

app.all("*", pathDoesNotExist);

module.exports = app;
