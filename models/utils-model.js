const db = require("../db/connection");
const format = require("pg-format");

exports.checkExists = (table, column, value) => {
  const query = format(`SELECT * FROM %I WHERE %I = $1;`, table, column);
  return db.query(query, [value]).then((commentsArray) => {
    if (commentsArray.rows.length === 0) {
      return Promise.reject();
    }
  });
};
