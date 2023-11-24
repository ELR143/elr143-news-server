const { checkExists } = require("../models/utils-model");
const {
  selectAllTopics,
  describeApi,
  selectArticleById,
  countComments,
  selectAllArticles,
  selectCommentsByArticleId,
  insertNewComment,
  updateArticleById,
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

exports.getAllArticles = (req, res, next) => {
  const comments = countComments();
  const articles = selectAllArticles();

  Promise.all([comments, articles])
    .then(([comments, articles]) => {
      const commentReference = comments.reduce((current, comment) => {
        current[comment.article_id] = parseInt(comment.count);
        return current;
      }, {});

      const updatedArticle = articles.map((article) => {
        delete article.body;
        const commentCount = commentReference[article.article_id];
        return { ...article, comment_count: commentCount || 0 };
      });
      return updatedArticle;
    })
    .then((updatedArticles) => {
      res.status(200).send({ articles: updatedArticles });
    })
    .catch(next);
};

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

exports.postNewComment = (req, res, next) => {
  const newComment = req.body;
  const { article_id } = req.params;

  insertNewComment(newComment, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const incrementVotes = req.body.inc_votes;

  updateArticleById(incrementVotes, article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
