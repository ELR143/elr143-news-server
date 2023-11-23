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
//merge 6 here
exports.insertNewUser = (username) => {
  if (!username) {
    return Promise.reject({ status: 400, msg: "Error: bad request" });
  } else {
    const query =
      "INSERT INTO users (username, name) VALUES ($1, 'placeholderName') RETURNING *;";
    return db.query(query, [username]).then((user) => {
      return user.rows[0];
    });
  }
};

exports.insertNewComment = (newComment, article_id) => {
  if (Object.keys(newComment).length !== 2) {
    return Promise.reject({ status: 400, msg: "Error: bad request" });
  }

  const { username, body } = newComment;
  const author = username;

  if (!body) {
    return Promise.reject({ status: 400, msg: "Error: bad request" });
  } else {
    const query =
      "INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING*;";
    return db.query(query, [body, author, article_id]).then((post) => {
      return post.rows[0];
    });
  }
};
