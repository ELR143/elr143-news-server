const express = require("express");
const cors = require("cors");

const {
  getAllTopics,
  getApi,
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  postNewComment,
  patchArticleById,
  deleteCommentById,
  getAllUsers,
} = require("./controllers/news-controller");
const {
  pathDoesNotExist,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/topics", getAllTopics);
app.get("/api", getApi);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/users", getAllUsers);

app.post("/api/articles/:article_id/comments", postNewComment);
app.patch("/api/articles/:article_id", patchArticleById);
app.delete("/api/comments/:comment_id", deleteCommentById);

app.all("*", pathDoesNotExist);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
