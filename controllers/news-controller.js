const { selectAllTopics, selectArticleById } = require("../models/news-model");

exports.getAllTopics = (req, res, next) => {
  selectAllTopics()
    .then((topicsArray) => {
      res.status(200).send({ topics: topicsArray });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  selectArticleById
}