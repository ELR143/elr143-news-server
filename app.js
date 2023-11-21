const express = require("express");
const {
  getAllTopics,
  getArticleById,
  getApi,
  getCommentsByArticleId,
} = require("./controllers/news-controller");
const { pathDoesNotExist, handleCustomErrors } = require("./errors");

const app = express();
app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api", getApi);

//merge 5 here

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.all("*", pathDoesNotExist);

app.use(handleCustomErrors);

module.exports = app;
