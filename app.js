const express = require("express");
const {
  getAllTopics,
  getArticleById,
} = require("./controllers/news-controller");
const { pathDoesNotExist, handleCustomErrors } = require("./errors");


const { getAllTopics, getApi } = require("./controllers/news-controller");


const app = express();
app.use(express.json());

app.get("/api/topics", getAllTopics);


app.get("/api/articles/:article_id", getArticleById);

app.get("/api", getApi);

app.all("*", pathDoesNotExist);

app.use(handleCustomErrors);

module.exports = app;
