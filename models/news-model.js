const db = require("../db/connection");
const format = require("pg-format");
const endpoints = require("../endpoints.json");

exports.selectAllTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((topics) => {
    return topics.rows;
  });
};

exports.describeApi = () => {
  return Promise.resolve(endpoints);
};

exports.selectArticleById = (id) => {
  const query = `SELECT * FROM articles WHERE article_id = $1;`;
  return db.query(query, [id]).then((article) => {
    if (article.rows.length === 0) {
      return Promise.reject();
    }
    return article.rows[0];
  });
};

exports.selectAllArticles = () => {
  return db
    .query(`SELECT * FROM articles ORDER BY created_at DESC;`)
    .then((articles) => {
      return articles.rows;
    });
};

exports.countComments = () => {
  return db
    .query(
      `SELECT article_id, COUNT (article_id) FROM comments GROUP BY article_id;`
    )
    .then((commentCounts) => {
      return Promise.all(commentCounts.rows);
    });
};

exports.selectCommentsByArticleId = (id) => {
  const query = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`;
  return db.query(query, [id]).then((articleComments) => {
    return articleComments.rows;
  });
};

exports.updateArticleById = (incrementVotes, id) => {
  const query = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`;
  return db.query(query, [incrementVotes, id]).then((article) => {
    if (article.rows.length === 0) {
      return Promise.reject();
    }
    return article.rows[0];
  });
};
