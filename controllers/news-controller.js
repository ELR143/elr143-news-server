const { selectAllTopics } = require("../models/news-model");

exports.getAllTopics = (req, res, next) => {
  selectAllTopics()
    .then((topicsArray) => {
      res.status(200).send(topicsArray.rows);
    })
    .catch(next);
};