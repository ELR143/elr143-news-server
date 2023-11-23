const express = require("express");
const {
  getAllTopics,
  getApi,
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  patchArticleById,
} = require("./controllers/news-controller");
const { pathDoesNotExist, handleCustomErrors } = require("./errors");

const app = express();
app.use(express.json());

app.get("/api/topics", getAllTopics);
app.get("/api", getApi);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.patch("/api/articles/:article_id", patchArticleById);

app.all("*", pathDoesNotExist);

app.use(handleCustomErrors);

module.exports = app;
