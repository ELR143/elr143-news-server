const express = require("express");
const {
  getAllTopics,
  getArticleById,
  getApi,
  getAllArticles,
  postNewComment,
} = require("./controllers/news-controller");
const {
  pathDoesNotExist,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors");

const app = express();
app.use(express.json());

app.get("/api/topics", getAllTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api", getApi);
app.get("/api/articles", getAllArticles);
//merge 6 here

app.post("/api/articles/:article_id/comments", postNewComment);

app.all("*", pathDoesNotExist);

app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
