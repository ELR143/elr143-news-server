const { checkExists } = require("../models/utils-model");
const {
  selectAllTopics,
  describeApi,
  selectArticleById,
  selectCommentsByArticleId,
} = require("../models/news-model");

exports.getAllTopics = (req, res, next) => {
  selectAllTopics()
    .then((topicsArray) => {
      res.status(200).send({ topics: topicsArray });
    })
    .catch(next);
};

exports.getApi = (req, res, next) => {
  describeApi()
    .then((endpointsData) => {
      res.status(200).send({ endpoints: endpointsData });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

// merge 5 here

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  const commentsCheck = checkExists("articles", "article_id", article_id);

  const pendingComments = selectCommentsByArticleId(article_id);

  Promise.all([pendingComments, commentsCheck])
    .then(([resolvedPromises]) => {
      res.status(200).send({ comments: resolvedPromises });
    })
    .catch(next);
};
