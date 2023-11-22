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

//merge 5 here

exports.selectCommentsByArticleId = (id) => {
  const query = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`;
  return db.query(query, [id]).then((articleComments) => {
    console.log(articleComments.rows);
    return articleComments.rows;
  });
};
