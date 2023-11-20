const express = require("express");
const { getAllTopics, getApi } = require("./controllers/news-controller");
const { pathDoesNotExist } = require("./errors");

const app = express();
app.use(express.json());

app.get("/api/topics", getAllTopics);
app.get("/api", getApi);

app.all("*", pathDoesNotExist);

module.exports = app;
