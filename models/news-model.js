const db = require("../db/connection");
const format = require("pg-format");
const endpoints = require("../endpoints.json");
const { checkExists } = require("./utils-model");

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

exports.selectAllArticles = (topic) => {
  const queryValues = [];
  let queryString = `SELECT * FROM articles `;

  if (topic) {
    return checkExists("topics", "slug", topic)
      .then((checkedTopic) => {
        if (!checkedTopic) {
          queryValues.push(topic);
          queryString += `WHERE topic = $1 `;
        }
      })
      .then(() => {
        queryString += `ORDER BY created_at DESC;`;
        return db.query(queryString, queryValues);
      })
      .then((articles) => {
        return articles.rows;
      });
  } else {
    queryString += `ORDER BY created_at DESC;`;
    return db.query(queryString).then((articles) => {
      return articles.rows;
    });
  }
};

exports.countComments = () => {
  return db
    .query(
      `SELECT article_id, COUNT(article_id) as comment_count FROM comments GROUP BY article_id;`
    )
    .then((commentCounts) => {
      const commentCountReference = commentCounts.rows.reduce(
        (current, comment) => {
          current[comment.article_id] = comment.comment_count;
          return current;
        },
        {}
      );
      return commentCountReference;
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

exports.updateArticleById = (incrementVotes, id) => {
  const query = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`;

  if (!incrementVotes) {
    return Promise.reject({ status: 400, msg: "Error: 400 bad request" });
  }

  return db.query(query, [incrementVotes, id]).then((article) => {
    if (article.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Error: 404 not found" });
    }
    return article.rows[0];
  });
};

exports.deleteCommentFromDatabase = (id) => {
  const query = `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`;
  return db.query(query, [id]).then((response) => {
    if (response.rows.length === 0) {
      return Promise.reject();
    }
  });
};

exports.selectAllUsers = () => {
  return db.query(`SELECT * FROM users;`).then((usersArray) => {
    return usersArray.rows;
  });
};
