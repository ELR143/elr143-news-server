const db = require("../db/connection");
const format = require("pg-format");

exports.selectAllTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((topics) => {
    return topics.rows;
  });
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
