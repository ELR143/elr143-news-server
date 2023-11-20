const { selectAllTopics, describeApi } = require("../models/news-model");

exports.getAllTopics = (req, res, next) => {
  selectAllTopics()
    .then((topicsArray) => {
      res.status(200).send({ topics: topicsArray });
    })
    .catch(next);
};

exports.getApi = (req, res, next) => {
  describeApi().then((endpointsData) => {
    res.status(200).send(endpointsData);
  });
};
