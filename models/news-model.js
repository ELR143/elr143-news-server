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

exports.insertNewComment = (newComment, article_id) => {
  if (
    !Object.keys(newComment).includes("username") ||
    !Object.keys(newComment).includes("body")
  ) {
    return Promise.reject({ status: 400, msg: "Error: 400 bad request" });
  }

  const { username, body } = newComment;
  const checkingUserQuery = `SELECT username FROM users WHERE username = $1;`;

  return db
    .query(checkingUserQuery, [username])
    .then((authorsArray) => {
      if (authorsArray.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Error: 404 not found" });
      }
    })
    .then(() => {
      const query =
        "INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING*;";
      return db.query(query, [body, username, article_id]);
    })
    .then((post) => {
      return post.rows[0];
    });
};
